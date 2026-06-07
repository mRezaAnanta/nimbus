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

	type RId = 'jkt' | 'sg' | 'tyo' | 'fra' | 'iad' | 'sao';
	type LabelPos = 'below' | 'left' | 'right';
	// lon/lat drive the globe; fx/fy + labelPos are the hand-tuned flat-map layout.
	type Region = { id: RId; code: string; lon: number; lat: number; ms: number; fx: number; fy: number; labelPos: LabelPos };

	const users = { lon: -58.4, lat: -34.6, fx: 316, fy: 312 }; // Buenos Aires, Argentina
	const regions: Region[] = [
		{ id: 'sao', code: 'sa-east-1', lon: -46.6, lat: -23.5, ms: 24, fx: 356, fy: 287, labelPos: 'right' },
		{ id: 'iad', code: 'us-east-1', lon: -77.5, lat: 39.0, ms: 120, fx: 273, fy: 120, labelPos: 'below' },
		{ id: 'fra', code: 'eu-central-1', lon: 8.68, lat: 50.1, ms: 220, fx: 503, fy: 90, labelPos: 'below' },
		{ id: 'tyo', code: 'ap-northeast-1', lon: 139.7, lat: 35.7, ms: 290, fx: 852, fy: 129, labelPos: 'below' },
		{ id: 'sg', code: 'ap-southeast-1', lon: 103.8, lat: 1.35, ms: 340, fx: 757, fy: 216, labelPos: 'left' },
		{ id: 'jkt', code: 'ap-southeast-3', lon: 106.85, lat: -6.2, ms: 350, fx: 778, fy: 246, labelPos: 'right' }
	];

	let mode = $state<'flat' | 'globe'>('flat');

	// ---- shared selection state ----
	let selected = $state<Region | null>(null);
	let tried = $state<string[]>([]);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let fired = false;
	let loadTimer: ReturnType<typeof setTimeout> | undefined;
	const latency = new Tween(0, { duration: 650, easing: cubicOut });

	function pick(r: Region) {
		if (suppressClick) return;
		selected = r;
		latency.target = r.ms;
		if (!tried.includes(r.id)) tried = [...tried, r.id];
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

	// ---- flat map ----
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	function arcFlat(r: Region) {
		const cx = (users.fx + r.fx) / 2;
		const cy = Math.min(users.fy, r.fy) - 70;
		return `M ${users.fx} ${users.fy} Q ${cx} ${cy} ${r.fx} ${r.fy}`;
	}
	const flatArc = $derived(selected ? arcFlat(selected) : '');

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
					{#key selected?.id}
						<path d={flatArc} fill="none" stroke="#2e6fe0" stroke-width="2.5" stroke-linecap="round" class="arc" />
					{/key}
				{/if}

				{#each regions as r (r.id)}
					<g
						class="pin"
						role="button"
						tabindex="0"
						aria-label={tx.cities[r.id]}
						onclick={() => pick(r)}
						onkeydown={(e) => e.key === 'Enter' && pick(r)}
					>
						<circle cx={r.fx} cy={r.fy} r="14" fill="transparent" />
						<circle cx={r.fx} cy={r.fy} r="7" fill={selected?.id === r.id ? '#2e6fe0' : '#fff'} stroke="#2e6fe0" stroke-width="2.5" />
						{#if r.labelPos === 'left'}
							<text x={r.fx - 13} y={r.fy - 1} text-anchor="end" fill="#16212b" font-size="13" font-weight="600">{tx.cities[r.id]}</text>
							<text x={r.fx - 13} y={r.fy + 13} text-anchor="end" fill="#8a949d" font-size="10.5">{r.code}</text>
						{:else if r.labelPos === 'right'}
							<text x={r.fx + 13} y={r.fy - 1} text-anchor="start" fill="#16212b" font-size="13" font-weight="600">{tx.cities[r.id]}</text>
							<text x={r.fx + 13} y={r.fy + 13} text-anchor="start" fill="#8a949d" font-size="10.5">{r.code}</text>
						{:else}
							<text x={r.fx} y={r.fy + 23} text-anchor="middle" fill="#16212b" font-size="13" font-weight="600">{tx.cities[r.id]}</text>
							<text x={r.fx} y={r.fy + 37} text-anchor="middle" fill="#8a949d" font-size="10.5">{r.code}</text>
						{/if}
					</g>
				{/each}

				<circle cx={users.fx} cy={users.fy} r="12" fill="#dd9e36" opacity="0.25" class="pulse" />
				<circle cx={users.fx} cy={users.fy} r="6.5" fill="#16212b" />
				<text x={users.fx} y={users.fy + 26} text-anchor="middle" fill="#16212b" font-size="13" font-weight="700">{tx.users}</text>
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

				{#each regions as r (r.id)}
					{@const p = project(r.lon, r.lat)}
					{#if p}
						<g
							class="pin"
							role="button"
							tabindex="0"
							aria-label={tx.cities[r.id]}
							onclick={() => pick(r)}
							onkeydown={(e) => e.key === 'Enter' && pick(r)}
						>
							<circle cx={p[0]} cy={p[1]} r="13" fill="transparent" />
							<circle cx={p[0]} cy={p[1]} r="6.5" fill={selected?.id === r.id ? '#2e6fe0' : '#fff'} stroke="#2e6fe0" stroke-width="2.5" />
							<text x={p[0]} y={p[1] + 18} text-anchor="middle" fill="#16212b" font-size="11" font-weight="600">{tx.cities[r.id]}</text>
							<text x={p[0]} y={p[1] + 30} text-anchor="middle" fill="#5e6b76" font-size="9">{r.code}</text>
						</g>
					{/if}
				{/each}

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
				<p class="text-ink text-sm font-semibold">{tx.cities[selected.id]}</p>
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
