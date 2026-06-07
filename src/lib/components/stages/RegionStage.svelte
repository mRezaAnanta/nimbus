<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from 'd3-geo';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	import landData from '$lib/data/land-110m.json';
	import type { LessonText, RegionText } from '$lib/chapters/types';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const land = landData as any;
	const graticule = geoGraticule10();

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as RegionText);

	// code drives the city label (text files) and is the unique key; lon/lat drive
	// both the globe and the flat map (flat x/y are computed from lon/lat below).
	type Region = { code: string; lon: number; lat: number; ms: number };

	const users = { lon: -58.4, lat: -34.6 }; // Buenos Aires, Argentina

	// Every AWS region in the standard commercial partition. ms is the estimated
	// round-trip latency from Argentina (smaller is closer/faster).
	const regions: Region[] = [
		// South America
		{ code: 'sa-east-1', lon: -46.6, lat: -23.5, ms: 24 },
		// North America
		{ code: 'us-east-1', lon: -77.5, lat: 39.0, ms: 120 },
		{ code: 'us-east-2', lon: -82.99, lat: 39.96, ms: 128 },
		{ code: 'us-west-1', lon: -121.96, lat: 37.35, ms: 155 },
		{ code: 'us-west-2', lon: -122.0, lat: 45.5, ms: 165 },
		{ code: 'ca-central-1', lon: -73.6, lat: 45.5, ms: 130 },
		{ code: 'ca-west-1', lon: -114.07, lat: 51.05, ms: 175 },
		{ code: 'mx-central-1', lon: -100.39, lat: 20.59, ms: 150 },
		// Europe
		{ code: 'eu-west-1', lon: -6.26, lat: 53.35, ms: 210 },
		{ code: 'eu-west-2', lon: -0.12, lat: 51.5, ms: 213 },
		{ code: 'eu-west-3', lon: 2.35, lat: 48.85, ms: 216 },
		{ code: 'eu-central-1', lon: 8.68, lat: 50.1, ms: 220 },
		{ code: 'eu-central-2', lon: 8.54, lat: 47.37, ms: 224 },
		{ code: 'eu-south-1', lon: 9.19, lat: 45.46, ms: 228 },
		{ code: 'eu-south-2', lon: -0.88, lat: 41.65, ms: 205 },
		{ code: 'eu-north-1', lon: 18.07, lat: 59.33, ms: 235 },
		// Africa
		{ code: 'af-south-1', lon: 18.42, lat: -33.93, ms: 330 },
		// Middle East
		{ code: 'il-central-1', lon: 34.78, lat: 32.07, ms: 310 },
		{ code: 'me-south-1', lon: 50.58, lat: 26.07, ms: 335 },
		{ code: 'me-central-1', lon: 55.27, lat: 25.2, ms: 345 },
		// Asia Pacific
		{ code: 'ap-south-1', lon: 72.88, lat: 19.08, ms: 320 },
		{ code: 'ap-south-2', lon: 78.49, lat: 17.39, ms: 325 },
		{ code: 'ap-east-1', lon: 114.16, lat: 22.32, ms: 330 },
		{ code: 'ap-east-2', lon: 121.56, lat: 25.03, ms: 335 },
		{ code: 'ap-northeast-1', lon: 139.7, lat: 35.7, ms: 290 },
		{ code: 'ap-northeast-2', lon: 126.98, lat: 37.57, ms: 300 },
		{ code: 'ap-northeast-3', lon: 135.5, lat: 34.69, ms: 295 },
		{ code: 'ap-southeast-1', lon: 103.8, lat: 1.35, ms: 340 },
		{ code: 'ap-southeast-2', lon: 151.21, lat: -33.87, ms: 305 },
		{ code: 'ap-southeast-3', lon: 106.85, lat: -6.2, ms: 350 },
		{ code: 'ap-southeast-4', lon: 144.96, lat: -37.81, ms: 312 },
		{ code: 'ap-southeast-5', lon: 101.69, lat: 3.14, ms: 345 },
		{ code: 'ap-southeast-7', lon: 100.5, lat: 13.75, ms: 348 }
	];

	let mode = $state<'flat' | 'globe'>('flat');

	// ---- shared selection state ----
	let selected = $state<Region | null>(null);
	let hovered = $state<Region | null>(null);
	const active = $derived(hovered ?? selected);
	let tried = $state<string[]>([]);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let fired = false;
	let loadTimer: ReturnType<typeof setTimeout> | undefined;
	const latency = new Tween(0, { duration: 650, easing: cubicOut });

	function pick(r: Region) {
		if (suppressClick) return;
		selected = r;
		latency.target = r.ms;
		if (!tried.includes(r.code)) tried = [...tried, r.code];
		if (loadTimer) clearTimeout(loadTimer);
		browser = 'loading';
		loadTimer = setTimeout(() => (browser = 'loaded'), Math.min(2000, 250 + r.ms * 5));
		onstate?.(r.ms <= 60 ? 'near' : r.ms <= 200 ? 'mid' : 'far');
		if (tried.length >= 2 && !fired) {
			fired = true;
			oncomplete?.();
		}
	}

	type VKey = 'instant' | 'fast' | 'ok' | 'slow' | 'laggy';
	function verdictKey(ms: number): VKey {
		if (ms <= 15) return 'instant';
		if (ms <= 50) return 'fast';
		if (ms <= 100) return 'ok';
		if (ms <= 180) return 'slow';
		return 'laggy';
	}
	const tone: Record<VKey, string> = { instant: 'grass', fast: 'grass', ok: 'amber', slow: 'amber', laggy: 'danger' };
	const toneText: Record<string, string> = { grass: 'text-grass', amber: 'text-amber', danger: 'text-danger' };
	const toneBg: Record<string, string> = {
		grass: 'bg-grass-soft text-grass',
		amber: 'bg-amber-soft text-amber',
		danger: 'bg-danger-soft text-danger'
	};

	// ---- flat map (equirectangular, cropped 84N..56S to match WorldMap) ----
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	function fx(lon: number) {
		return ((lon + 180) / 360) * FLAT_W;
	}
	function fy(lat: number) {
		return ((84 - lat) / 140) * FLAT_H;
	}
	const userFx = $derived(fx(users.lon));
	const userFy = $derived(fy(users.lat));
	function arcFlat(r: Region) {
		const ux = fx(users.lon);
		const uy = fy(users.lat);
		const rx = fx(r.lon);
		const ry = fy(r.lat);
		const cx = (ux + rx) / 2;
		const cy = Math.min(uy, ry) - 70;
		return `M ${ux} ${uy} Q ${cx} ${cy} ${rx} ${ry}`;
	}
	const flatArc = $derived(selected ? arcFlat(selected) : '');

	// label placement for the one active pin (keeps it inside the frame)
	function flatLabel(r: Region) {
		const x = fx(r.lon);
		const y = fy(r.lat);
		const anchor = x > 820 ? 'end' : x < 140 ? 'start' : 'middle';
		const lx = anchor === 'end' ? x - 13 : anchor === 'start' ? x + 13 : x;
		const side = anchor !== 'middle';
		const below = y < FLAT_H - 60;
		const nameY = side ? y - 1 : below ? y + 24 : y - 19;
		const codeY = side ? y + 13 : below ? y + 37 : y - 6;
		return { anchor, lx, nameY, codeY };
	}

	// ---- globe ----
	const SIZE = 440;
	let rotL = $state(52);
	let rotP = $state(18);
	const projection = $derived(
		geoOrthographic()
			.scale(SIZE / 2 - 8)
			.translate([SIZE / 2, SIZE / 2])
			.rotate([rotL, rotP])
			.clipAngle(90)
	);
	const pathGen = $derived(geoPath(projection));
	const landPath = $derived(pathGen(land) ?? '');
	const gratPath = $derived(pathGen(graticule) ?? '');
	function project(lon: number, lat: number): [number, number] | null {
		if (geoDistance([lon, lat], [-rotL, -rotP]) > Math.PI / 2) return null;
		return projection([lon, lat]) ?? null;
	}
	const usersPt = $derived(project(users.lon, users.lat));
	const globeArc = $derived(
		selected
			? // eslint-disable-next-line @typescript-eslint/no-explicit-any
				(pathGen({ type: 'LineString', coordinates: [[users.lon, users.lat], [selected.lon, selected.lat]] } as any) ??
					'')
			: ''
	);

	let dragging = $state(false);
	let lastX = 0;
	let lastY = 0;
	let suppressClick = false;
	function down(e: PointerEvent) {
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		suppressClick = false;
	}
	function move(e: PointerEvent) {
		if (!dragging) return;
		const dx = e.clientX - lastX;
		const dy = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		if (Math.abs(dx) + Math.abs(dy) > 3) suppressClick = true;
		rotL += dx * 0.45;
		rotP = Math.max(-85, Math.min(85, rotP - dy * 0.45));
	}
	function up() {
		dragging = false;
	}

	onDestroy(() => clearTimeout(loadTimer));
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<!-- Map / Globe -->
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background: #f1f6fc;">
		<!-- view toggle -->
		<div class="border-line absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-full border bg-white/85 p-0.5 text-[11px] font-semibold backdrop-blur">
			<button
				onclick={() => (mode = 'flat')}
				class="rounded-full px-2.5 py-1 transition-colors {mode === 'flat' ? 'bg-ink text-white' : 'text-faint hover:text-ink'}"
			>
				{tx.flatLabel}
			</button>
			<button
				onclick={() => (mode = 'globe')}
				class="rounded-full px-2.5 py-1 transition-colors {mode === 'globe' ? 'bg-ink text-white' : 'text-faint hover:text-ink'}"
			>
				{tx.globeLabel}
			</button>
		</div>

		{#if mode === 'flat'}
			<svg viewBox="0 0 {FLAT_W} {FLAT_H}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="map">
				<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
				<WorldMap />

				{#if flatArc}
					{#key selected?.code}
						<path d={flatArc} fill="none" stroke="#2e6fe0" stroke-width="2.5" stroke-linecap="round" class="arc" />
					{/key}
				{/if}

				{#each regions as r (r.code)}
					{@const x = fx(r.lon)}
					{@const y = fy(r.lat)}
					{@const on = selected?.code === r.code || hovered?.code === r.code}
					<g
						class="pin"
						role="button"
						tabindex="0"
						aria-label={tx.cities[r.code]}
						onclick={() => pick(r)}
						onkeydown={(e) => e.key === 'Enter' && pick(r)}
						onpointerenter={() => (hovered = r)}
						onpointerleave={() => hovered === r && (hovered = null)}
					>
						<circle cx={x} cy={y} r="11" fill="transparent" />
						<circle cx={x} cy={y} r={on ? 6.5 : 4.5} fill={selected?.code === r.code ? '#2e6fe0' : '#fff'} stroke="#2e6fe0" stroke-width="2.5" />
					</g>
				{/each}

				{#if active}
					{@const lp = flatLabel(active)}
					<g class="lbl" pointer-events="none">
						<text x={lp.lx} y={lp.nameY} text-anchor={lp.anchor} fill="#16212b" font-size="13" font-weight="600">{tx.cities[active.code]}</text>
						<text x={lp.lx} y={lp.codeY} text-anchor={lp.anchor} fill="#8a949d" font-size="10.5">{active.code}</text>
					</g>
				{/if}

				<circle cx={userFx} cy={userFy} r="12" fill="#dd9e36" opacity="0.25" class="pulse" />
				<circle cx={userFx} cy={userFy} r="6.5" fill="#16212b" />
				<text x={userFx} y={userFy + 26} text-anchor="middle" fill="#16212b" font-size="13" font-weight="700">{tx.users}</text>
			</svg>
		{:else}
			<svg
				viewBox="0 0 {SIZE} {SIZE}"
				class="globe h-full w-full"
				class:grabbing={dragging}
				preserveAspectRatio="xMidYMid meet"
				role="img"
				aria-label="globe"
				onpointerdown={down}
				onpointermove={move}
				onpointerup={up}
				onpointerleave={up}
			>
				<circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 8} fill="#bcd6ef" style="filter: drop-shadow(0 10px 24px rgba(22,40,60,0.14));" />
				<path d={gratPath} fill="none" stroke="#a9c8e8" stroke-width="0.5" opacity="0.7" />
				<path d={landPath} fill="#eaf2fc" stroke="#cdddf0" stroke-width="0.6" />

				{#if globeArc}
					<path d={globeArc} fill="none" stroke="#2e6fe0" stroke-width="2.5" stroke-linecap="round" />
				{/if}

				{#each regions as r (r.code)}
					{@const p = project(r.lon, r.lat)}
					{#if p}
						{@const on = selected?.code === r.code || hovered?.code === r.code}
						<g
							class="pin"
							role="button"
							tabindex="0"
							aria-label={tx.cities[r.code]}
							onclick={() => pick(r)}
							onkeydown={(e) => e.key === 'Enter' && pick(r)}
							onpointerenter={() => (hovered = r)}
							onpointerleave={() => hovered === r && (hovered = null)}
						>
							<circle cx={p[0]} cy={p[1]} r="11" fill="transparent" />
							<circle cx={p[0]} cy={p[1]} r={on ? 6.5 : 4} fill={selected?.code === r.code ? '#2e6fe0' : '#fff'} stroke="#2e6fe0" stroke-width="2.5" />
						</g>
					{/if}
				{/each}

				{#if active}
					{@const p = project(active.lon, active.lat)}
					{#if p}
						<g pointer-events="none">
							<text x={p[0]} y={p[1] - 12} text-anchor="middle" fill="#16212b" font-size="12" font-weight="600">{tx.cities[active.code]}</text>
							<text x={p[0]} y={p[1] + 22} text-anchor="middle" fill="#5e6b76" font-size="10">{active.code}</text>
						</g>
					{/if}
				{/if}

				{#if usersPt}
					<circle cx={usersPt[0]} cy={usersPt[1]} r="11" fill="#dd9e36" opacity="0.25" class="pulse" />
					<circle cx={usersPt[0]} cy={usersPt[1]} r="5.5" fill="#16212b" />
					<text x={usersPt[0]} y={usersPt[1] + 21} text-anchor="middle" fill="#16212b" font-size="11" font-weight="700">{tx.users}</text>
				{/if}
			</svg>
			<p class="text-faint pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px]">{tx.drag}</p>
		{/if}
	</div>

	<!-- Phone + readout -->
	<div class="flex shrink-0 flex-row items-center justify-center gap-4 md:w-[200px] md:flex-col md:justify-center">
		<Browser phase={browser} />
		<div class="border-line bg-card w-[150px] rounded-2xl border p-4 text-center md:w-full">
			{#if selected}
				{@const vk = verdictKey(selected.ms)}
				<p class="text-ink text-sm font-semibold">{tx.cities[selected.code]}</p>
				<p class="text-faint text-[11px]">{selected.code}</p>
				<p class="mt-2 text-3xl font-bold tabular-nums {toneText[tone[vk]]}">
					{Math.round(latency.current)}<span class="text-muted text-sm font-medium"> {tx.ms}</span>
				</p>
				<span class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold {toneBg[tone[vk]]}">
					{tx.verdicts[vk]}
				</span>
			{:else}
				<p class="text-faint text-sm">{tx.readoutPrompt}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.arc {
		animation: arc-in 0.45s ease both;
	}
	@keyframes arc-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.globe {
		cursor: grab;
		touch-action: none;
	}
	.globe.grabbing {
		cursor: grabbing;
	}
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:focus,
	.pin:focus-visible {
		outline: none;
	}
	.pin:hover circle[stroke] {
		stroke-width: 3.5;
	}
	.lbl {
		pointer-events: none;
	}
	.pulse {
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.25;
		}
		50% {
			transform: scale(1.7);
			opacity: 0.05;
		}
	}
</style>
