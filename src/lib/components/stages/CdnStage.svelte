<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { geoDistance } from 'd3-geo';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CdnText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as CdnText);

	type Spot = { code: string; lon: number; lat: number };

	// nimbus.com lives in one place, Virginia, just like the story so far
	const ORIGIN: Spot = { code: 'origin', lon: -77.5, lat: 39.0 };

	// the CDN network, one dot per city. Real providers run hundreds of these.
	const EDGES: Spot[] = [
		{ code: 'seattle', lon: -122.33, lat: 47.61 },
		{ code: 'losangeles', lon: -118.24, lat: 34.05 },
		{ code: 'dallas', lon: -96.8, lat: 32.78 },
		{ code: 'miami', lon: -80.19, lat: 25.76 },
		{ code: 'newyork', lon: -74.0, lat: 40.71 },
		{ code: 'toronto', lon: -79.38, lat: 43.65 },
		{ code: 'mexicocity', lon: -99.13, lat: 19.43 },
		{ code: 'bogota', lon: -74.07, lat: 4.71 },
		{ code: 'lima', lon: -77.04, lat: -12.04 },
		{ code: 'saopaulo', lon: -46.63, lat: -23.55 },
		{ code: 'buenosaires', lon: -58.38, lat: -34.6 },
		{ code: 'santiago', lon: -70.67, lat: -33.45 },
		{ code: 'london', lon: -0.13, lat: 51.5 },
		{ code: 'paris', lon: 2.35, lat: 48.86 },
		{ code: 'frankfurt', lon: 8.68, lat: 50.11 },
		{ code: 'madrid', lon: -3.7, lat: 40.42 },
		{ code: 'milan', lon: 9.19, lat: 45.46 },
		{ code: 'stockholm', lon: 18.07, lat: 59.33 },
		{ code: 'warsaw', lon: 21.01, lat: 52.23 },
		{ code: 'johannesburg', lon: 28.05, lat: -26.2 },
		{ code: 'lagos', lon: 3.38, lat: 6.52 },
		{ code: 'nairobi', lon: 36.82, lat: -1.29 },
		{ code: 'dubai', lon: 55.27, lat: 25.2 },
		{ code: 'mumbai', lon: 72.88, lat: 19.08 },
		{ code: 'singapore', lon: 103.85, lat: 1.29 },
		{ code: 'jakarta', lon: 106.85, lat: -6.2 },
		{ code: 'bangkok', lon: 100.5, lat: 13.76 },
		{ code: 'hongkong', lon: 114.17, lat: 22.32 },
		{ code: 'tokyo', lon: 139.69, lat: 35.69 },
		{ code: 'seoul', lon: 126.98, lat: 37.57 },
		{ code: 'sydney', lon: 151.21, lat: -33.87 },
		{ code: 'auckland', lon: 174.76, lat: -36.85 }
	];

	// clickable visitors, people in cities WITHOUT their own CDN point, so the
	// delivery line from the nearest green point is always visible. Jayapura is
	// pinned to Jakarta because real traffic follows the domestic backbone.
	type Visitor = Spot & { prefer?: string };
	const VISITORS: Visitor[] = [
		{ code: 'surabaya', lon: 112.75, lat: -7.25 },
		{ code: 'jayapura', lon: 140.7, lat: -2.53, prefer: 'jakarta' },
		{ code: 'brisbane', lon: 153.03, lat: -27.47 },
		{ code: 'manchester', lon: -2.24, lat: 53.48 },
		{ code: 'riodejaneiro', lon: -43.17, lat: -22.9 },
		{ code: 'boston', lon: -71.06, lat: 42.36 }
	];

	// rough real-world round trip, distance does the talking
	function tripMs(a: Spot, b: Spot) {
		const km = geoDistance([a.lon, a.lat], [b.lon, b.lat]) * 6371;
		return Math.round(14 + km * 0.0165);
	}
	function nearestEdge(v: Visitor) {
		if (v.prefer) return EDGES.find((e) => e.code === v.prefer) ?? EDGES[0];
		return EDGES.reduce((best, e) => (tripMs(v, e) < tripMs(v, best) ? e : best));
	}

	let cdnOn = $state(false);
	let selected = $state<Visitor | null>(null);
	let served = $state<{ kind: 'origin' } | { kind: 'edge'; edge: Spot } | null>(null);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let done = false;
	let ms = $state<number | null>(null);
	const latency = new Tween(0, { duration: 650, easing: cubicOut });
	let loadTimer: ReturnType<typeof setTimeout> | undefined;

	function pick(v: Visitor) {
		selected = v;
		browser = 'loading';
		if (!cdnOn) {
			ms = tripMs(v, ORIGIN);
			served = { kind: 'origin' };
			onstate?.('origin');
		} else {
			const edge = nearestEdge(v);
			ms = tripMs(v, edge);
			served = { kind: 'edge', edge };
			onstate?.('cached');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		}
		latency.target = ms;
		if (loadTimer) clearTimeout(loadTimer);
		loadTimer = setTimeout(() => (browser = 'loaded'), Math.min(1800, 250 + ms * 3));
	}

	function toggle() {
		cdnOn = !cdnOn;
		selected = null;
		served = null;
		ms = null;
		browser = 'idle';
		latency.target = 0;
		if (cdnOn) onstate?.('enabled');
	}

	type VKey = 'fast' | 'ok' | 'slow';
	const verdict = $derived<VKey | null>(ms === null ? null : ms <= 60 ? 'fast' : ms <= 170 ? 'ok' : 'slow');
	const verdictText = $derived(
		verdict === 'fast' ? tx.verdictFast : verdict === 'ok' ? tx.verdictOk : tx.verdictSlow
	);
	const toneText: Record<VKey, string> = { fast: 'text-grass', ok: 'text-amber', slow: 'text-danger' };
	const toneBg: Record<VKey, string> = {
		fast: 'bg-grass-soft text-grass',
		ok: 'bg-amber-soft text-amber',
		slow: 'bg-danger-soft text-danger'
	};

	// ---- flat map projection (same crop as WorldMap, like the Region lesson) ----
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	function fx(lon: number) {
		return ((lon + 180) / 360) * FLAT_W;
	}
	function fy(lat: number) {
		return ((84 - lat) / 140) * FLAT_H;
	}
	function arc(a: Spot, b: Spot) {
		const x1 = fx(a.lon);
		const y1 = fy(a.lat);
		const x2 = fx(b.lon);
		const y2 = fy(b.lat);
		const lift = Math.max(16, Math.abs(x2 - x1) * 0.22);
		return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
	}
	// the sender draws the line, origin or the nearest green point, flowing toward the visitor
	const mainArc = $derived(
		!selected || !served ? '' : served.kind === 'origin' ? arc(ORIGIN, selected) : arc(served.edge, selected)
	);
	const activeEdgeCode = $derived(served?.kind === 'edge' ? served.edge.code : null);
	const ox = fx(ORIGIN.lon);
	const oy = fy(ORIGIN.lat);
</script>

<div class="flex h-full w-full flex-col gap-3 md:flex-row md:gap-4">
	<!-- World map, origin + CDN points + clickable visitors -->
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background: #f1f6fc;">
		<!-- network status -->
		<div class="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-full border border-line bg-white/85 px-2.5 py-1 text-[10.5px] font-bold backdrop-blur {cdnOn ? 'text-grass' : 'text-faint'}">
			<span class="inline-block h-2 w-2 rounded-full {cdnOn ? 'bg-grass' : 'bg-[#cfd6dd]'}"></span>
			{cdnOn ? tx.statusOn.replace('{n}', String(EDGES.length)) : tx.statusOff}
		</div>

		<svg viewBox="0 0 {FLAT_W} {FLAT_H}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="map">
			<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
			<WorldMap />

			<!-- the network at a glance: every person wired to their nearest green point -->
			{#if cdnOn}
				{#each VISITORS as v (v.code)}
					<path d={arc(nearestEdge(v), v)} fill="none" stroke="#3a9c64" stroke-width="1.3" stroke-dasharray="4 5" stroke-linecap="round" opacity="0.32" />
				{/each}
			{/if}

			<!-- the delivery: drawn from the sender, flowing toward the visitor -->
			{#if mainArc}
				{#key `${selected?.code}-${cdnOn}-${activeEdgeCode}`}
					<path d={mainArc} fill="none" stroke={served?.kind === 'edge' ? '#3a9c64' : '#2e6fe0'} stroke-width="2.5" stroke-dasharray="7 6" stroke-linecap="round" class="arcflow" />
				{/key}
			{/if}

			<!-- CDN points, the whole network appears at once -->
			{#if cdnOn}
				{#each EDGES as e, i (e.code)}
					{@const x = fx(e.lon)}
					{@const y = fy(e.lat)}
					<g class="edge" style="animation-delay:{i * 28}ms">
						{#if activeEdgeCode === e.code}
							<circle cx={x} cy={y} r="9.5" fill="none" stroke="#3a9c64" stroke-width="2" opacity="0.55" />
						{/if}
						<circle cx={x} cy={y} r="3.6" fill="#3a9c64" stroke="#fff" stroke-width="1.4" />
					</g>
				{/each}
			{/if}

			<!-- the origin server -->
			<g pointer-events="none">
				<rect x={ox - 7} y={oy - 7} width="14" height="14" rx="4" fill="#2e6fe0" stroke="#fff" stroke-width="1.6" />
				<rect x={ox - 3.5} y={oy - 3} width="7" height="1.8" rx="0.9" fill="#fff" />
				<rect x={ox - 3.5} y={oy + 0.8} width="7" height="1.8" rx="0.9" fill="#fff" />
				<text x={ox} y={oy + 24} text-anchor="middle" fill="#2e6fe0" font-size="11.5" font-weight="700">{tx.originLabel}</text>
			</g>

			<!-- the visitors, people you can click -->
			{#each VISITORS as v (v.code)}
				{@const x = fx(v.lon)}
				{@const y = fy(v.lat)}
				{@const on = selected?.code === v.code}
				<g
					class="pin"
					role="button"
					tabindex="0"
					aria-label={tx.cities[v.code]}
					onclick={() => pick(v)}
					onkeydown={(e) => e.key === 'Enter' && pick(v)}
				>
					<circle cx={x} cy={y} r="20" fill="transparent" />
					{#if !on}
						<circle cx={x} cy={y} r="10" fill="#dd9e36" opacity="0.3" class="breathe" />
					{/if}
					<g transform="translate({x - 8}, {y - 9}) scale(0.7)" pointer-events="none">
						<circle cx="12" cy="8" r="4" fill={on ? '#2e6fe0' : '#16212b'} />
						<path d="M4 21a8 8 0 0 1 16 0Z" fill={on ? '#2e6fe0' : '#16212b'} />
					</g>
					<text
						{x}
						y={y + 21}
						text-anchor="middle"
						fill={on ? '#16212b' : '#5e6b76'}
						font-size={on ? 11.5 : 10}
						font-weight={on ? 700 : 600}>{tx.cities[v.code]}</text
					>
				</g>
			{/each}
		</svg>

		<!-- legend -->
		<div class="pointer-events-none absolute bottom-2 left-2 z-10 flex items-center gap-3 rounded-full border border-line bg-white/85 px-3 py-1 text-[9.5px] font-semibold text-muted backdrop-blur">
			<span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#16212b] bg-white"></span>{tx.visitorsLabel}</span>
			<span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-[3px] bg-brand"></span>{tx.originLabel}</span>
			{#if cdnOn}
				<span class="flex items-center gap-1"><span class="inline-block h-2 w-2 rounded-full bg-grass"></span>{tx.edgeLabel}</span>
			{/if}
		</div>
	</div>

	<!-- phone, readout, and the CDN switch -->
	<div class="flex shrink-0 flex-col items-center justify-center gap-3 md:w-[210px]">
		<div class="flex flex-row items-center gap-4 md:flex-col md:gap-3">
			<Browser phase={browser} />
			<div class="border-line bg-card w-[170px] rounded-2xl border p-4 text-center md:w-full">
				{#if selected && served && ms !== null && verdict}
					<p class="text-ink text-sm font-semibold">{tx.cities[selected.code]}</p>
					<p class="text-faint text-[10.5px] leading-snug">
						{served.kind === 'origin'
							? tx.servedOrigin
							: tx.servedEdge.replace('{city}', tx.cities[served.edge.code])}
					</p>
					<p class="mt-2 text-3xl font-bold tabular-nums {toneText[verdict]}">
						{Math.round(latency.current)}<span class="text-muted text-sm font-medium"> {tx.ms}</span>
					</p>
					<span class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold {toneBg[verdict]}">
						{verdictText}
					</span>
					{#if served.kind === 'edge'}
						<p class="text-grass mt-1.5 text-[10px] font-semibold">{tx.hitChip}</p>
					{/if}
				{:else}
					<p class="text-faint text-sm">{tx.readoutPrompt}</p>
				{/if}
			</div>
		</div>
		<button
			type="button"
			onclick={toggle}
			class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:brightness-110 {cdnOn
				? 'border border-line bg-white text-ink'
				: 'bg-ink text-white cta'}"
		>
			{cdnOn ? tx.cdnOff : tx.cdnOn}
		</button>
	</div>
</div>

<style>
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:hover text {
		fill: #16212b;
	}
	.breathe {
		transform-box: fill-box;
		transform-origin: center;
		animation: breathe 2s ease-in-out infinite;
	}
	@keyframes breathe {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.6);
			opacity: 0.08;
		}
	}
	.edge {
		transform-box: fill-box;
		transform-origin: center;
		animation: popin 0.4s ease backwards;
	}
	@keyframes popin {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.arcflow {
		animation:
			arcin 0.45s ease both,
			flowdash 0.8s linear infinite;
	}
	@keyframes arcin {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes flowdash {
		to {
			stroke-dashoffset: -13;
		}
	}
	.cta {
		animation: invite 2s ease-in-out infinite;
	}
	@keyframes invite {
		0%,
		100% {
			box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		}
		50% {
			box-shadow:
				0 8px 20px rgba(22, 40, 60, 0.16),
				0 0 0 6px rgba(22, 40, 60, 0.08);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.breathe,
		.edge,
		.arcflow,
		.cta {
			animation-duration: 0.01s;
		}
	}
</style>
