<script lang="ts">
	import { onDestroy } from 'svelte';
	import { geoEquirectangular, geoPath } from 'd3-geo';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	import landData from '$lib/data/land-110m.json';
	import type { LessonText, AZText } from '$lib/chapters/types';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const land = landData as any;

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
	// Real AZ counts: us-east-1 has 6, ap-southeast-1 has 3. Points are illustrative, placed
	// within the region's area (not exact data center coordinates).
	const REGIONS: Record<
		RegionKey,
		{ code: string; lon: number; lat: number; bbox: [[number, number], [number, number]]; azs: Az[] }
	> = {
		virginia: {
			code: 'us-east-1',
			lon: -77.5,
			lat: 39,
			bbox: [
				[-90, 31],
				[-68, 44]
			],
			azs: [
				{ l: 'a', lon: -77.4, lat: 38.9 },
				{ l: 'b', lon: -81.5, lat: 36.0 },
				{ l: 'c', lon: -73.6, lat: 40.8 },
				{ l: 'd', lon: -84.0, lat: 39.6 },
				{ l: 'e', lon: -72.6, lat: 41.6 },
				{ l: 'f', lon: -83.0, lat: 35.2 }
			]
		},
		singapore: {
			code: 'ap-southeast-1',
			lon: 103.8,
			lat: 1.35,
			bbox: [
				[100, -2.5],
				[106.5, 4.5]
			],
			azs: [
				{ l: 'a', lon: 103.6, lat: 1.45 },
				{ l: 'b', lon: 104.1, lat: 1.15 },
				{ l: 'c', lon: 103.5, lat: 0.95 }
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

	// Close-up of just this region's land. Scale/center are set manually (fitSize on a spherical
	// bbox polygon can flip to the whole globe), so only this area fills the panel.
	const detail = $derived.by(() => {
		if (!cfg) return null;
		const b = cfg.bbox;
		const lonSpan = ((b[1][0] - b[0][0]) * Math.PI) / 180;
		const latSpan = ((b[1][1] - b[0][1]) * Math.PI) / 180;
		const scale = Math.min(RW / lonSpan, RH / latSpan) * 0.92;
		const proj = geoEquirectangular()
			.scale(scale)
			.center([(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2])
			.translate([RW / 2, RH / 2]);
		return { proj, path: geoPath(proj)(land) ?? '' };
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
					<path d={detail.path} fill="#cdddef" stroke="#b6cce6" stroke-width="0.6" />
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
