<script lang="ts">
	import { onDestroy } from 'svelte';
	import { geoEquirectangular, geoPath } from 'd3-geo';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	import regionShapesData from '$lib/data/region-shapes.json';
	import type { LessonText, AZText } from '$lib/chapters/types';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const SHAPES = regionShapesData as any as Record<string, any>;

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as AZText);

	// equirectangular, cropped 84N..56S to match WorldMap (for the world view pins)
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const wx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const wy = (lat: number) => ((84 - lat) / 140) * FLAT_H;

	type Az = { l: string; lon: number; lat: number };
	type RegionKey = 'virginia' | 'singapore';
	// Real AZ counts: us-east-1 has 6, ap-southeast-1 has 3. The points are illustrative, spread
	// across the region for clarity (real AZs sit much closer together).
	const REGIONS: Record<RegionKey, { code: string; lon: number; lat: number; azs: Az[] }> = {
		virginia: {
			code: 'us-east-1',
			lon: -77.5,
			lat: 39,
			azs: [
				{ l: 'a', lon: -77.43, lat: 37.54 },
				{ l: 'b', lon: -79.94, lat: 37.27 },
				{ l: 'c', lon: -78.48, lat: 38.03 },
				{ l: 'd', lon: -77.09, lat: 38.88 },
				{ l: 'e', lon: -75.98, lat: 36.85 },
				{ l: 'f', lon: -82.55, lat: 36.7 }
			]
		},
		singapore: {
			code: 'ap-southeast-1',
			lon: 103.8,
			lat: 1.35,
			azs: [
				{ l: 'a', lon: 103.7, lat: 1.33 },
				{ l: 'b', lon: 103.84, lat: 1.36 },
				{ l: 'c', lon: 103.98, lat: 1.35 }
			]
		}
	};
	const pins = (Object.keys(REGIONS) as RegionKey[]).map((k) => ({ key: k, x: wx(REGIONS[k].lon), y: wy(REGIONS[k].lat) }));

	const RW = 600;
	const RH = 360;

	let region = $state<RegionKey | null>(null);
	let servers = $state(new Set<string>());
	let downAz = $state<string | null>(null);
	let striking = $state(false);
	let strikeKey = $state(0);
	let browser = $state<'loaded' | 'offline'>('loaded');
	let fired = false;
	let t1: ReturnType<typeof setTimeout> | undefined;
	let t2: ReturnType<typeof setTimeout> | undefined;

	const inRegion = $derived(region !== null);
	const cfg = $derived(region ? REGIONS[region] : null);
	const siteDown = $derived(browser === 'offline');
	const countHere = $derived(cfg ? cfg.azs.filter((a) => servers.has(cfg.code + a.l)).length : 0);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function geomBounds(g: any): [[number, number], [number, number]] {
		let minX = 180;
		let minY = 90;
		let maxX = -180;
		let maxY = -90;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const scan = (ring: any) => {
			for (const [x, y] of ring) {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			}
		};
		if (g.type === 'Polygon') g.coordinates.forEach(scan);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		else g.coordinates.forEach((p: any) => p.forEach(scan));
		return [
			[minX, minY],
			[maxX, maxY]
		];
	}

	// Close-up of just this region, fitted so a small country (Singapore) zooms in more than a
	// large state. Scale/center are set manually to avoid d3 fitSize spherical-winding issues.
	const detail = $derived.by(() => {
		if (!region) return null;
		const shape = SHAPES[region];
		const b = geomBounds(shape);
		const lonSpan = Math.max(((b[1][0] - b[0][0]) * Math.PI) / 180, 1e-4);
		const latSpan = Math.max(((b[1][1] - b[0][1]) * Math.PI) / 180, 1e-4);
		const scale = Math.min(RW / lonSpan, RH / latSpan) * 0.86;
		const proj = geoEquirectangular()
			.scale(scale)
			.center([(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2])
			.translate([RW / 2, RH / 2]);
		return { proj, path: geoPath(proj)(shape) ?? '' };
	});

	function enterRegion(k: RegionKey) {
		region = k;
		downAz = null;
		striking = false;
		browser = 'loaded';
		const c = REGIONS[k];
		if (!c.azs.some((a) => servers.has(c.code + a.l))) {
			const s = new Set(servers);
			s.add(c.code + 'a');
			servers = s;
		}
	}
	function back() {
		if (striking) return;
		region = null;
	}
	function toggleServer(id: string) {
		if (striking) return;
		const s = new Set(servers);
		if (s.has(id)) s.delete(id);
		else s.add(id);
		servers = s;
	}
	function trigger() {
		if (striking || !cfg) return;
		const withServer = cfg.azs.map((a) => cfg.code + a.l).filter((id) => servers.has(id));
		if (withServer.length === 0) return;
		const victim = withServer[0];
		strikeKey += 1;
		striking = true;
		t1 = setTimeout(() => {
			downAz = victim;
			const survives = withServer.some((id) => id !== victim);
			browser = survives ? 'loaded' : 'offline';
			if (survives) {
				onstate?.('survived');
				if (!fired) {
					fired = true;
					oncomplete?.();
				}
			} else {
				onstate?.('down');
			}
		}, 720);
		t2 = setTimeout(() => {
			downAz = null;
			striking = false;
			browser = 'loaded';
		}, 2900);
	}

	onDestroy(() => {
		clearTimeout(t1);
		clearTimeout(t2);
	});
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background:#f1f6fc;">
		<!-- world view -->
		<div
			class="absolute inset-0 transition-all duration-500 ease-out"
			style="opacity:{inRegion ? 0 : 1}; transform:scale({inRegion ? 1.4 : 1}); {inRegion ? 'pointer-events:none;' : ''}"
		>
			<svg viewBox="0 0 {FLAT_W} {FLAT_H}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="world map">
				<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
				<WorldMap />
				{#each pins as p (p.key)}
					<g
						class="pin"
						role="button"
						tabindex="0"
						aria-label={tx.regions[p.key]}
						onclick={() => enterRegion(p.key)}
						onkeydown={(e) => e.key === 'Enter' && enterRegion(p.key)}
					>
						<circle cx={p.x} cy={p.y} r="13" fill="#2e6fe0" opacity="0.18" class="pulse" />
						<circle cx={p.x} cy={p.y} r="6.5" fill="#2e6fe0" stroke="#fff" stroke-width="2" />
						<text x={p.x} y={p.y - 12} text-anchor="middle" fill="#16212b" font-size="13" font-weight="700">{tx.regions[p.key]}</text>
					</g>
				{/each}
			</svg>
			<p class="text-faint pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px]">{tx.worldHint}</p>
		</div>

		<!-- region close-up -->
		<div
			class="absolute inset-0 transition-all duration-500 ease-out"
			style="opacity:{inRegion ? 1 : 0}; transform:scale({inRegion ? 1 : 0.96}); {inRegion ? '' : 'pointer-events:none;'}"
		>
			{#if cfg && region && detail}
				<svg viewBox="0 0 {RW} {RH}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={tx.regions[region]}>
					<rect width={RW} height={RH} fill="#eaf2fc" />
					<path d={detail.path} fill="#cdddef" stroke="#4d82c9" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" />
					{#each cfg.azs as a (a.l)}
						{@const azId = cfg.code + a.l}
						{@const p = detail.proj([a.lon, a.lat])}
						{@const has = servers.has(azId)}
						{@const isDown = downAz === azId}
						{#if p}
							<g
								class="pin"
								role="button"
								tabindex="0"
								aria-label={azId}
								onclick={() => toggleServer(azId)}
								onkeydown={(e) => e.key === 'Enter' && toggleServer(azId)}
							>
								<circle cx={p[0]} cy={p[1]} r="13" fill="transparent" />
								<circle
									cx={p[0]}
									cy={p[1]}
									r={isDown ? 8.5 : 7}
									fill={isDown ? '#e03131' : has ? '#2f9e44' : '#fff'}
									stroke={isDown ? '#e03131' : has ? '#2f9e44' : '#8a949d'}
									stroke-width="2.2"
								/>
								<text x={p[0]} y={p[1] - 12} text-anchor="middle" fill="#16212b" font-size="11" font-weight="600">{azId}</text>
								{#if isDown}
									<text x={p[0]} y={p[1] + 20} text-anchor="middle" fill="#e03131" font-size="10" font-weight="700">{tx.statusDown}</text>
								{/if}
							</g>
						{/if}
					{/each}
				</svg>

				<!-- top bar -->
				<div class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
					<button
						type="button"
						onclick={back}
						class="text-faint hover:text-ink pointer-events-auto flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[12px] font-medium backdrop-blur transition-colors"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6 L9 12 L15 18" /></svg>
						{tx.back}
					</button>
					<span class="text-ink rounded-full bg-white/80 px-2.5 py-1 text-[13px] font-semibold backdrop-blur">{cfg.code} ({tx.regions[region]})</span>
				</div>

				<!-- bottom bar -->
				<div class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
					<p class="text-faint text-[11px]">{tx.place}</p>
					<button
						type="button"
						onclick={trigger}
						disabled={striking || countHere === 0}
						class="pointer-events-auto shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{tx.trigger}
					</button>
				</div>

				<!-- drone strike -->
				{#key strikeKey}
					{#if striking}
						<div class="drone text-danger pointer-events-none absolute" aria-hidden="true">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12 L21 5 L14 12 L21 19 Z" /></svg>
						</div>
					{/if}
				{/key}
			{/if}
		</div>
	</div>

	<!-- Phone + readout -->
	<div class="flex shrink-0 flex-row items-center justify-center gap-4 md:w-[200px] md:flex-col md:justify-center">
		<Browser phase={browser} />
		<div class="border-line bg-card w-[150px] rounded-2xl border p-4 text-center md:w-full">
			{#if inRegion && cfg}
				<p class="text-lg font-bold {siteDown ? 'text-danger' : 'text-grass'}">{siteDown ? tx.statusDown : tx.statusUp}</p>
				<p class="text-faint mt-1 text-[11px]">{tx.activeZones}: {countHere}/{cfg.azs.length}</p>
			{:else}
				<p class="text-faint text-sm">{tx.worldHint}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:focus,
	.pin:focus-visible {
		outline: none;
	}
	.pin:hover circle[stroke] {
		stroke-width: 3.2;
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
			opacity: 0.18;
		}
		50% {
			transform: scale(1.8);
			opacity: 0.04;
		}
	}
	.drone {
		animation: drone-fly 1.2s ease-in forwards;
	}
	@keyframes drone-fly {
		0% {
			left: -12%;
			top: 10%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			left: 104%;
			top: 60%;
			opacity: 0.85;
		}
	}
</style>
