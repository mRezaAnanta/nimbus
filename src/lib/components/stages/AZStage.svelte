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

	let {
		text,
		oncomplete,
		onstate,
		beat = 0,
		onlock,
		onshow
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
		onlock?: (v: boolean) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as AZText);

	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const wx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const wy = (lat: number) => ((84 - lat) / 140) * FLAT_H;

	type Az = { l: string; lon: number; lat: number };
	type RegionKey = 'virginia' | 'singapore';
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

	// Intro strike target (UAE / Bahrain area) and scattered news popup positions.
	const meX = wx(52);
	const meY = wy(25);
	const meL = (meX / FLAT_W) * 100;
	const meT = (meY / FLAT_H) * 100;
	const NEWS_POS = [
		{ l: 4, t: 9 },
		{ l: 34, t: 5 },
		{ l: 60, t: 12 },
		{ l: 8, t: 46 },
		{ l: 42, t: 52 }
	];

	let region = $state<RegionKey | null>(null);
	let servers = $state(new Set<string>());
	let downAz = $state<string | null>(null);
	let striking = $state(false);
	let strikeKey = $state(0);
	let browser = $state<'loaded' | 'offline'>('loaded');
	let fired = false;
	let t1: ReturnType<typeof setTimeout> | undefined;
	let t2: ReturnType<typeof setTimeout> | undefined;

	// intro sequence (beat 0)
	let introStrike = $state(false);
	let introBoom = $state(false);
	let showNews = $state(false);
	let introPlayed = false;
	let it1: ReturnType<typeof setTimeout> | undefined;
	let it2: ReturnType<typeof setTimeout> | undefined;
	let it3: ReturnType<typeof setTimeout> | undefined;
	let it4: ReturnType<typeof setTimeout> | undefined;

	const introMode = $derived(beat === 0 && region === null);
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

	$effect(() => {
		if (beat === 0) {
			onshow?.(true);
			if (!introPlayed) {
				introPlayed = true;
				playIntro();
			}
		} else {
			onshow?.(false);
			onlock?.(false);
		}
	});

	function playIntro() {
		onlock?.(true);
		introStrike = true;
		it1 = setTimeout(() => {
			introStrike = false; // missile reaches the target and is gone
			introBoom = true; // explosion bursts
		}, 1100);
		it2 = setTimeout(() => (introBoom = false), 1850); // explosion fades out and disappears
		it3 = setTimeout(() => (showNews = true), 1400);
		it4 = setTimeout(() => onlock?.(false), 5600);
	}

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
		onstate?.(k);
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
		clearTimeout(it1);
		clearTimeout(it2);
		clearTimeout(it3);
		clearTimeout(it4);
	});
</script>

{#snippet serverIcon()}
	<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
		<rect x="3.5" y="5" width="17" height="6" rx="1.6" />
		<rect x="3.5" y="13" width="17" height="6" rx="1.6" />
		<circle cx="7" cy="8" r="1" fill="currentColor" stroke="none" />
		<circle cx="7" cy="16" r="1" fill="currentColor" stroke="none" />
	</svg>
{/snippet}

{#snippet missile()}
	<svg width="34" height="34" viewBox="0 0 40 40" style="transform: rotate(40deg)" aria-hidden="true">
		<path d="M12 14 L5 8 L13 16 Z" fill="#7c8a99" />
		<path d="M12 26 L5 32 L13 24 Z" fill="#7c8a99" />
		<rect x="10" y="16" width="16" height="8" rx="4" fill="#3a4654" />
		<path d="M26 16 L36 20 L26 24 Z" fill="#e03131" />
		<circle cx="15" cy="20" r="1.5" fill="#aebccb" />
	</svg>
{/snippet}

{#snippet boom()}
	<svg viewBox="0 0 100 100" width="96" height="96" aria-hidden="true">
		<g stroke="#ff7a1a" stroke-width="7" stroke-linecap="round">
			<line x1="66" y1="50" x2="96" y2="50" />
			<line x1="61" y1="61" x2="83" y2="83" />
			<line x1="50" y1="66" x2="50" y2="96" />
			<line x1="39" y1="61" x2="17" y2="83" />
			<line x1="34" y1="50" x2="4" y2="50" />
			<line x1="39" y1="39" x2="17" y2="17" />
			<line x1="50" y1="34" x2="50" y2="4" />
			<line x1="61" y1="39" x2="83" y2="17" />
		</g>
		<circle cx="50" cy="50" r="22" fill="#ff9e2c" />
		<circle cx="50" cy="50" r="12" fill="#ffe08a" />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background:#f1f6fc;">
		<!-- world view (intro strike or region pins) -->
		<div
			class="absolute inset-0 transition-all duration-500 ease-out"
			style="opacity:{inRegion ? 0 : 1}; transform:scale({inRegion ? 1.4 : 1}); {inRegion ? 'pointer-events:none;' : ''}"
		>
			<svg viewBox="0 0 {FLAT_W} {FLAT_H}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="world map">
				<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
				<WorldMap />

				{#if introMode}
					<rect x={meX - 7} y={meY - 7} width="14" height="14" rx="2.5" fill="#16212b" />
					<text x={meX} y={meY - 13} text-anchor="middle" fill="#16212b" font-size="12" font-weight="700">{tx.strikeLabel}</text>
				{:else}
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
				{/if}
			</svg>

			{#if introMode}
				{#if introStrike}
					<div class="drone-intro pointer-events-none absolute" style="--tx:{meL}%; --ty:{meT}%">
						{@render missile()}
					</div>
				{/if}
				{#if introBoom}
					<div class="kaboom pointer-events-none absolute" style="left:{meL}%; top:{meT}%">
						{@render boom()}
					</div>
				{/if}
				{#if showNews}
					<div class="pointer-events-none absolute inset-0">
						{#each tx.news as n, i (n.url)}
							<a
								class="newscard absolute"
								href={n.url}
								target="_blank"
								rel="noopener noreferrer"
								style="left:{NEWS_POS[i % NEWS_POS.length].l}%; top:{NEWS_POS[i % NEWS_POS.length].t}%; animation-delay:{i * 0.45 + 0.1}s"
							>
								<p class="src">{n.src}</p>
								<p class="head">{n.head}</p>
							</a>
						{/each}
					</div>
				{/if}
			{:else}
				<p class="text-faint pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px]">{tx.worldHint}</p>
			{/if}
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
					<text
						x={RW / 2}
						y={RH * 0.5}
						text-anchor="middle"
						dominant-baseline="middle"
						fill="#42587a"
						opacity="0.2"
						font-size="46"
						font-weight="800"
						letter-spacing="3"
					>
						{tx.regions[region].toUpperCase()}
					</text>
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

				{#key strikeKey}
					{#if striking}
						<div class="drone pointer-events-none absolute">
							{@render missile()}
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
	.drone-intro {
		left: -10%;
		top: -10%;
		animation: drone-strike 1.1s ease-in forwards;
	}
	@keyframes drone-strike {
		0% {
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			left: var(--tx);
			top: var(--ty);
			opacity: 1;
		}
	}
	.kaboom {
		transform: translate(-50%, -50%);
	}
	.kaboom :global(svg) {
		display: block;
		transform-origin: center;
		animation: kaboom 0.7s ease-out forwards;
	}
	@keyframes kaboom {
		0% {
			transform: scale(0.3);
			opacity: 1;
		}
		60% {
			opacity: 0.95;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}
	.newscard {
		display: block;
		width: 196px;
		max-width: 46%;
		padding: 9px 11px;
		border-radius: 12px;
		background: #ffffff;
		border: 1px solid #e7ecf2;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.16);
		text-decoration: none;
		pointer-events: auto;
		opacity: 0;
		transform: translateY(10px) scale(0.96);
		animation: news-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
		transition:
			box-shadow 0.15s,
			transform 0.15s;
	}
	.newscard:hover {
		box-shadow: 0 14px 30px rgba(22, 40, 60, 0.22);
	}
	@keyframes news-pop {
		to {
			opacity: 1;
			transform: none;
		}
	}
	.src {
		font-size: 10px;
		font-weight: 700;
		color: #2e6fe0;
	}
	.head {
		margin-top: 2px;
		font-size: 11.5px;
		font-weight: 600;
		line-height: 1.25;
		color: #16212b;
	}
</style>
