<script lang="ts">
	import { onDestroy } from 'svelte';
	import { geoInterpolate } from 'd3-geo';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import Globe from '../Globe.svelte';
	import type { GlobeView } from '../Globe.svelte';
	import type { LessonText, RegionText } from '$lib/chapters/types';

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

	let mode = $state<'flat' | 'globe'>('flat'); // desktop toggle only; small screens are always the globe

	// ---- shared selection state ----
	let selected = $state<Region | null>(null);
	let hovered = $state<Region | null>(null);
	const active = $derived(hovered ?? selected);
	let tried = $state<string[]>([]);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let fired = false;
	let loadTimer: ReturnType<typeof setTimeout> | undefined;
	const latency = new Tween(0, { duration: 650, easing: cubicOut });

	// To make the point land, the learner has to compare a genuinely near region AND a genuinely
	// far one (either order). Thresholds match Nim's near/far reactions: a nearby same-continent
	// region (São Paulo) vs an overseas one. The mid picks in between count as neither, so Nim's
	// "there is still a closer region" hint keeps nudging toward the real contrast.
	const NEAR_MAX = 60;
	const FAR_MIN = 200;
	const msByCode = new Map(regions.map((r) => [r.code, r.ms]));
	const nearTested = $derived(tried.some((c) => (msByCode.get(c) ?? 999) <= NEAR_MAX));
	const farTested = $derived(tried.some((c) => (msByCode.get(c) ?? 0) > FAR_MIN));
	const compareDone = $derived(nearTested && farTested);

	function pick(r: Region) {
		selected = r;
		latency.target = r.ms;
		if (!tried.includes(r.code)) tried = [...tried, r.code];
		if (loadTimer) clearTimeout(loadTimer);
		browser = 'loading';
		loadTimer = setTimeout(() => (browser = 'loaded'), Math.min(2000, 250 + r.ms * 5));
		onstate?.(r.ms <= 60 ? 'near' : r.ms <= 200 ? 'mid' : 'far');
		// unlock only once both a near and a far region have been compared
		const near = tried.some((c) => (msByCode.get(c) ?? 999) <= NEAR_MAX);
		const far = tried.some((c) => (msByCode.get(c) ?? 0) > FAR_MIN);
		if (near && far && !fired) {
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
	const toneHex: Record<string, string> = { grass: '#3a9c64', amber: '#dd9e36', danger: '#d3584a' };

	// ---- flat map (equirectangular, cropped 84N..56S to match WorldMap), desktop only ----
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

	// great-circle midpoint of the arc on the globe, where the latency tag sits (small screens)
	function globeTag(v: GlobeView): [number, number] | null {
		if (!selected) return null;
		const m = geoInterpolate([users.lon, users.lat], [selected.lon, selected.lat])(0.5);
		return v.project(m[0], m[1]) ?? v.project(selected.lon, selected.lat);
	}

	onDestroy(() => clearTimeout(loadTimer));
</script>

{#snippet latencyTag(px: number, py: number)}
	{@const vk = verdictKey(selected!.ms)}
	{@const c = toneHex[tone[vk]]}
	<g transform="translate({px}, {py})" pointer-events="none">
		<g class="ltag">
			<rect x="-45" y="-26" width="90" height="44" rx="13" fill="#fff" stroke={c} stroke-width="2" />
			<text x="0" y="-4" text-anchor="middle" font-weight="800" font-size="19" fill={c}
				>{Math.round(latency.current)}<tspan font-size="11" font-weight="600" fill="#5e6b76"> {tx.ms}</tspan></text
			>
			<text x="0" y="12" text-anchor="middle" font-size="10.5" font-weight="700" fill={c}>{tx.verdicts[vk]}</text>
		</g>
	</g>
{/snippet}

<!-- globe overlay: arc, pins, user (shared by the small-screen globe and the desktop globe toggle) -->
{#snippet globeBase(v: GlobeView)}
	{#if selected}
		{@const d = v.path({ type: 'LineString', coordinates: [[users.lon, users.lat], [selected.lon, selected.lat]] })}
		{#if d}<path {d} fill="none" stroke="#2e6fe0" stroke-width="2.5" stroke-linecap="round" />{/if}
	{/if}

	{#each regions as r (r.code)}
		{@const p = v.project(r.lon, r.lat)}
		{#if p}
			{@const on = selected?.code === r.code || hovered?.code === r.code}
			<g
				class="pin"
				role="button"
				tabindex="0"
				aria-label={tx.cities[r.code]}
				onclick={v.tap(() => pick(r))}
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
		{@const p = v.project(active.lon, active.lat)}
		{#if p}
			<g pointer-events="none">
				<text x={p[0]} y={p[1] - 12} text-anchor="middle" fill="#16212b" font-size="12" font-weight="600">{tx.cities[active.code]}</text>
				<text x={p[0]} y={p[1] + 22} text-anchor="middle" fill="#5e6b76" font-size="10">{active.code}</text>
			</g>
		{/if}
	{/if}

	{@const up = v.project(users.lon, users.lat)}
	{#if up}
		<circle cx={up[0]} cy={up[1]} r="11" fill="#dd9e36" opacity="0.25" class="pulse" />
		<circle cx={up[0]} cy={up[1]} r="5.5" fill="#16212b" />
		<text x={up[0]} y={up[1] + 21} text-anchor="middle" fill="#16212b" font-size="11" font-weight="700">{tx.users}</text>
	{/if}
{/snippet}

<!-- small screens have no readout box, so the latency rides the line instead -->
{#snippet globeWithTag(v: GlobeView)}
	{@render globeBase(v)}
	{#if selected}
		{@const m = globeTag(v)}
		{#if m}{@render latencyTag(m[0], m[1])}{/if}
	{/if}
{/snippet}

<!-- progress: the learner must compare a near and a far region before moving on -->
{#snippet stepChip(label: string, done: boolean)}
	<span
		class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur transition-colors {done
			? 'border-transparent bg-grass-soft text-grass'
			: 'border-line bg-white/85 text-faint'}"
	>
		{#if done}
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
		{:else}
			<span class="h-1.5 w-1.5 rounded-full border border-current opacity-60"></span>
		{/if}
		{label}
	</span>
{/snippet}

{#snippet compareChips()}
	<div class="flex items-center justify-center gap-1.5">
		{@render stepChip(tx.compare.near, nearTested)}
		{@render stepChip(tx.compare.far, farTested)}
	</div>
{/snippet}

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<!-- Map / Globe -->
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background: #f1f6fc;">
		<!-- small-screen progress: compare a near and a far region (desktop shows it in the box) -->
		{#if !compareDone}
			<div class="pointer-events-none absolute top-2 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 md:hidden">
				{@render compareChips()}
				{#if !selected}
					<span class="border-line text-muted rounded-full border bg-white/85 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur">{tx.compare.hint}</span>
				{/if}
			</div>
		{/if}

		<!-- small screens: globe only -->
		<div class="absolute inset-0 md:hidden">
			<Globe overlay={globeWithTag} />
			<p class="text-faint pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px]">{tx.drag}</p>
		</div>

		<!-- tablet and up: flat / globe toggle -->
		<div class="absolute inset-0 hidden md:block">
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
				<Globe overlay={globeBase} />
				<p class="text-faint pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px]">{tx.drag}</p>
			{/if}
		</div>
	</div>

	<!-- Phone + readout (desktop only; small screens use the globe with the latency on the line) -->
	<div class="hidden shrink-0 md:flex md:w-[200px] md:flex-col md:items-center md:justify-center md:gap-4">
		<Browser phase={browser} />
		<div class="border-line bg-card w-full rounded-2xl border p-4 text-center">
			{#if !compareDone}
				{@render compareChips()}
				<p class="text-faint mt-1.5 text-[11px] leading-snug {selected ? 'mb-3' : ''}">{tx.compare.hint}</p>
			{/if}
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
			{:else if compareDone}
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
	.ltag {
		filter: drop-shadow(0 5px 12px rgba(22, 40, 60, 0.18));
		animation: tag-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes tag-in {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
