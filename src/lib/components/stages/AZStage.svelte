<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import type { LessonText, AZText } from '$lib/chapters/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as AZText);

	// equirectangular, cropped 84N..56S to match WorldMap
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const fx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const fy = (lat: number) => ((84 - lat) / 140) * FLAT_H;

	type RegionKey = 'virginia' | 'singapore';
	// Real AZ counts: us-east-1 has 6 zones, ap-southeast-1 has 3.
	const REGIONS: Record<RegionKey, { code: string; lon: number; lat: number; letters: string[] }> = {
		virginia: { code: 'us-east-1', lon: -77.5, lat: 39, letters: ['a', 'b', 'c', 'd', 'e', 'f'] },
		singapore: { code: 'ap-southeast-1', lon: 103.8, lat: 1.35, letters: ['a', 'b', 'c'] }
	};
	const pins = (Object.keys(REGIONS) as RegionKey[]).map((k) => ({ key: k, x: fx(REGIONS[k].lon), y: fy(REGIONS[k].lat) }));

	let region = $state<RegionKey | null>(null);
	let originRegion = $state<RegionKey>('virginia');
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
	const origin = $derived({
		x: (fx(REGIONS[originRegion].lon) / FLAT_W) * 100,
		y: (fy(REGIONS[originRegion].lat) / FLAT_H) * 100
	});
	const countHere = $derived(cfg ? cfg.letters.filter((l) => servers.has(cfg.code + l)).length : 0);
	const siteDown = $derived(browser === 'offline');

	function enterRegion(k: RegionKey) {
		originRegion = k;
		region = k;
		downAz = null;
		striking = false;
		browser = 'loaded';
		const c = REGIONS[k];
		if (!c.letters.some((l) => servers.has(c.code + l))) {
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
		const withServer = cfg.letters.map((l) => cfg.code + l).filter((id) => servers.has(id));
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

{#snippet serverIcon()}
	<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
		<rect x="3.5" y="5" width="17" height="6" rx="1.6" />
		<rect x="3.5" y="13" width="17" height="6" rx="1.6" />
		<circle cx="7" cy="8" r="1" fill="currentColor" stroke="none" />
		<circle cx="7" cy="16" r="1" fill="currentColor" stroke="none" />
	</svg>
{/snippet}
{#snippet stormIcon()}
	<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M13 2 L4 14 h7 l-2 8 11-13 h-7 z" />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background:#f1f6fc;">
		<!-- world layer -->
		<div
			class="absolute inset-0 transition-all duration-500 ease-out"
			style="transform-origin:{origin.x}% {origin.y}%; transform:scale({inRegion ? 3 : 1}); opacity:{inRegion ? 0 : 1}; {inRegion ? 'pointer-events:none;' : ''}"
		>
			<svg viewBox="0 0 {FLAT_W} {FLAT_H}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="map">
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

		<!-- region detail layer -->
		<div
			class="absolute inset-0 flex flex-col p-4 transition-all duration-500 ease-out"
			style="background:#f1f6fc; opacity:{inRegion ? 1 : 0}; transform:scale({inRegion ? 1 : 0.92}); {inRegion ? '' : 'pointer-events:none;'}"
		>
			{#if cfg && region}
				<div class="flex shrink-0 items-center justify-between">
					<button
						type="button"
						onclick={back}
						class="text-faint hover:text-ink flex items-center gap-1 text-[12px] font-medium transition-colors"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6 L9 12 L15 18" /></svg>
						{tx.back}
					</button>
					<span class="text-ink text-[13px] font-semibold">{cfg.code} ({tx.regions[region]})</span>
				</div>

				<div class="mt-3 grid flex-1 auto-rows-fr grid-cols-3 gap-2.5">
					{#each cfg.letters as l (l)}
						{@const azId = cfg.code + l}
						{@const has = servers.has(azId)}
						{@const isDown = downAz === azId}
						<button
							type="button"
							onclick={() => toggleServer(azId)}
							disabled={striking}
							class="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line p-2 text-center transition-all select-none disabled:cursor-not-allowed {isDown
								? 'bg-danger-soft text-danger az-hit'
								: has
									? 'bg-grass-soft text-grass'
									: 'text-faint hover:text-ink'}"
						>
							<span class="text-[11px] font-semibold">{cfg.code}{l}</span>
							{#if isDown}
								{@render stormIcon()}<span class="text-[10px] font-semibold">{tx.statusDown}</span>
							{:else if has}
								{@render serverIcon()}<span class="text-[10px] font-semibold">{tx.serverLabel}</span>
							{:else}
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" class="opacity-60"><path d="M12 6 v12 M6 12 h12" /></svg>
								<span class="text-[10px]">{tx.serverLabel}</span>
							{/if}
						</button>
					{/each}
				</div>

				<div class="mt-3 flex shrink-0 items-center justify-between gap-3">
					<p class="text-faint text-[11px]">{tx.place}</p>
					<button
						type="button"
						onclick={trigger}
						disabled={striking || countHere === 0}
						class="shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{tx.trigger}
					</button>
				</div>

				{#key strikeKey}
					{#if striking}
						<div class="drone text-danger pointer-events-none absolute" aria-hidden="true">
							<svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12 L21 5 L14 12 L21 19 Z" /></svg>
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
				<p class="text-faint mt-1 text-[11px]">{tx.activeZones}: {countHere}/{cfg.letters.length}</p>
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
		stroke-width: 3;
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
			top: 14%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			left: 106%;
			top: 52%;
			opacity: 0.85;
		}
	}
	.az-hit {
		animation: az-hit 0.4s ease-out;
	}
	@keyframes az-hit {
		0% {
			transform: scale(1.06);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
