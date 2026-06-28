<script lang="ts">
	import { onDestroy } from 'svelte';
	import { geoInterpolate, geoDistance } from 'd3-geo';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import Globe from '../Globe.svelte';
	import type { GlobeView } from '../Globe.svelte';
	import ProviderLogo from '../ProviderLogo.svelte';
	import type { LessonText, RegionText } from '$lib/chapters/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as RegionText);

	const users = { lon: -58.4, lat: -34.6 }; // Buenos Aires, Argentina

	// Each provider has its own real regions, with its own naming (AWS uses codes like
	// ap-southeast-1, Azure uses names like Southeast Asia, GCP uses asia-southeast1). Latency
	// is estimated from real distance to Argentina, so the globe genuinely differs per provider.
	type ProviderId = 'aws' | 'azure' | 'gcp';
	type Region = { code: string; city: string; lon: number; lat: number; ms: number };
	type Base = Omit<Region, 'ms'>;

	const PROVIDERS: { id: ProviderId; short: string; color: string; regions: Base[] }[] = [
		{
			id: 'aws',
			short: 'AWS',
			color: '#ff9900',
			regions: [
				{ code: 'sa-east-1', city: 'São Paulo', lon: -46.63, lat: -23.55 },
				{ code: 'us-east-1', city: 'N. Virginia', lon: -77.5, lat: 39.0 },
				{ code: 'us-east-2', city: 'Ohio', lon: -82.99, lat: 39.96 },
				{ code: 'us-west-1', city: 'N. California', lon: -121.96, lat: 37.35 },
				{ code: 'us-west-2', city: 'Oregon', lon: -122.0, lat: 45.5 },
				{ code: 'ca-central-1', city: 'Montreal', lon: -73.6, lat: 45.5 },
				{ code: 'ca-west-1', city: 'Calgary', lon: -114.07, lat: 51.05 },
				{ code: 'mx-central-1', city: 'Querétaro', lon: -100.39, lat: 20.59 },
				{ code: 'eu-west-1', city: 'Ireland', lon: -6.26, lat: 53.35 },
				{ code: 'eu-west-2', city: 'London', lon: -0.12, lat: 51.5 },
				{ code: 'eu-west-3', city: 'Paris', lon: 2.35, lat: 48.85 },
				{ code: 'eu-central-1', city: 'Frankfurt', lon: 8.68, lat: 50.1 },
				{ code: 'eu-central-2', city: 'Zurich', lon: 8.54, lat: 47.37 },
				{ code: 'eu-south-1', city: 'Milan', lon: 9.19, lat: 45.46 },
				{ code: 'eu-south-2', city: 'Spain', lon: -0.88, lat: 41.65 },
				{ code: 'eu-north-1', city: 'Stockholm', lon: 18.07, lat: 59.33 },
				{ code: 'af-south-1', city: 'Cape Town', lon: 18.42, lat: -33.93 },
				{ code: 'il-central-1', city: 'Tel Aviv', lon: 34.78, lat: 32.07 },
				{ code: 'me-south-1', city: 'Bahrain', lon: 50.58, lat: 26.07 },
				{ code: 'me-central-1', city: 'UAE', lon: 55.27, lat: 25.2 },
				{ code: 'ap-south-1', city: 'Mumbai', lon: 72.88, lat: 19.08 },
				{ code: 'ap-south-2', city: 'Hyderabad', lon: 78.49, lat: 17.39 },
				{ code: 'ap-east-1', city: 'Hong Kong', lon: 114.16, lat: 22.32 },
				{ code: 'ap-northeast-1', city: 'Tokyo', lon: 139.7, lat: 35.7 },
				{ code: 'ap-northeast-2', city: 'Seoul', lon: 126.98, lat: 37.57 },
				{ code: 'ap-northeast-3', city: 'Osaka', lon: 135.5, lat: 34.69 },
				{ code: 'ap-southeast-1', city: 'Singapore', lon: 103.8, lat: 1.35 },
				{ code: 'ap-southeast-2', city: 'Sydney', lon: 151.21, lat: -33.87 },
				{ code: 'ap-southeast-3', city: 'Jakarta', lon: 106.85, lat: -6.2 },
				{ code: 'ap-southeast-4', city: 'Melbourne', lon: 144.96, lat: -37.81 },
				{ code: 'ap-southeast-5', city: 'Malaysia', lon: 101.69, lat: 3.14 },
				{ code: 'ap-southeast-7', city: 'Thailand', lon: 100.5, lat: 13.75 }
			]
		},
		{
			id: 'azure',
			short: 'Azure',
			color: '#0078d4',
			regions: [
				{ code: 'Brazil South', city: 'São Paulo', lon: -46.63, lat: -23.55 },
				{ code: 'East US', city: 'Virginia', lon: -79.42, lat: 37.37 },
				{ code: 'East US 2', city: 'Virginia', lon: -78.39, lat: 36.85 },
				{ code: 'Central US', city: 'Iowa', lon: -93.6, lat: 41.59 },
				{ code: 'South Central US', city: 'Texas', lon: -98.5, lat: 29.42 },
				{ code: 'North Central US', city: 'Illinois', lon: -87.62, lat: 41.88 },
				{ code: 'West US', city: 'California', lon: -122.42, lat: 37.78 },
				{ code: 'West US 2', city: 'Washington', lon: -119.85, lat: 47.23 },
				{ code: 'West US 3', city: 'Arizona', lon: -112.07, lat: 33.45 },
				{ code: 'Canada Central', city: 'Toronto', lon: -79.38, lat: 43.65 },
				{ code: 'Mexico Central', city: 'Querétaro', lon: -100.39, lat: 20.59 },
				{ code: 'North Europe', city: 'Ireland', lon: -6.26, lat: 53.35 },
				{ code: 'West Europe', city: 'Netherlands', lon: 4.9, lat: 52.37 },
				{ code: 'UK South', city: 'London', lon: -0.12, lat: 51.5 },
				{ code: 'France Central', city: 'Paris', lon: 2.78, lat: 46.36 },
				{ code: 'Germany West Central', city: 'Frankfurt', lon: 8.68, lat: 50.1 },
				{ code: 'Switzerland North', city: 'Zurich', lon: 8.54, lat: 47.37 },
				{ code: 'Sweden Central', city: 'Gävle', lon: 16.8, lat: 60.67 },
				{ code: 'Norway East', city: 'Oslo', lon: 10.75, lat: 59.91 },
				{ code: 'Italy North', city: 'Milan', lon: 9.19, lat: 45.46 },
				{ code: 'Poland Central', city: 'Warsaw', lon: 21.01, lat: 52.23 },
				{ code: 'UAE North', city: 'Dubai', lon: 55.27, lat: 25.2 },
				{ code: 'Qatar Central', city: 'Doha', lon: 51.53, lat: 25.29 },
				{ code: 'Israel Central', city: 'Tel Aviv', lon: 34.78, lat: 32.07 },
				{ code: 'South Africa North', city: 'Johannesburg', lon: 28.05, lat: -26.2 },
				{ code: 'Central India', city: 'Pune', lon: 73.86, lat: 18.52 },
				{ code: 'Southeast Asia', city: 'Singapore', lon: 103.8, lat: 1.35 },
				{ code: 'East Asia', city: 'Hong Kong', lon: 114.16, lat: 22.32 },
				{ code: 'Japan East', city: 'Tokyo', lon: 139.7, lat: 35.7 },
				{ code: 'Japan West', city: 'Osaka', lon: 135.5, lat: 34.69 },
				{ code: 'Korea Central', city: 'Seoul', lon: 126.98, lat: 37.57 },
				{ code: 'Australia East', city: 'Sydney', lon: 151.21, lat: -33.87 },
				{ code: 'Australia Southeast', city: 'Melbourne', lon: 144.96, lat: -37.81 }
			]
		},
		{
			id: 'gcp',
			short: 'Google',
			color: '#1a73e8',
			regions: [
				{ code: 'southamerica-east1', city: 'São Paulo', lon: -46.63, lat: -23.55 },
				{ code: 'southamerica-west1', city: 'Santiago', lon: -70.67, lat: -33.45 },
				{ code: 'us-east1', city: 'S. Carolina', lon: -79.99, lat: 33.2 },
				{ code: 'us-east4', city: 'N. Virginia', lon: -77.5, lat: 38.94 },
				{ code: 'us-east5', city: 'Columbus', lon: -82.99, lat: 39.96 },
				{ code: 'us-central1', city: 'Iowa', lon: -93.6, lat: 41.26 },
				{ code: 'us-south1', city: 'Dallas', lon: -96.8, lat: 32.78 },
				{ code: 'us-west1', city: 'Oregon', lon: -121.2, lat: 45.6 },
				{ code: 'us-west2', city: 'Los Angeles', lon: -118.24, lat: 34.05 },
				{ code: 'us-west3', city: 'Salt Lake City', lon: -111.89, lat: 40.76 },
				{ code: 'us-west4', city: 'Las Vegas', lon: -115.14, lat: 36.17 },
				{ code: 'northamerica-northeast1', city: 'Montreal', lon: -73.6, lat: 45.5 },
				{ code: 'northamerica-northeast2', city: 'Toronto', lon: -79.38, lat: 43.65 },
				{ code: 'northamerica-south1', city: 'Querétaro', lon: -100.39, lat: 20.59 },
				{ code: 'europe-west1', city: 'Belgium', lon: 3.8, lat: 50.85 },
				{ code: 'europe-west2', city: 'London', lon: -0.12, lat: 51.5 },
				{ code: 'europe-west3', city: 'Frankfurt', lon: 8.68, lat: 50.1 },
				{ code: 'europe-west4', city: 'Netherlands', lon: 6.83, lat: 53.44 },
				{ code: 'europe-west6', city: 'Zurich', lon: 8.54, lat: 47.37 },
				{ code: 'europe-west8', city: 'Milan', lon: 9.19, lat: 45.46 },
				{ code: 'europe-west9', city: 'Paris', lon: 2.35, lat: 48.85 },
				{ code: 'europe-north1', city: 'Finland', lon: 27.18, lat: 60.57 },
				{ code: 'europe-southwest1', city: 'Madrid', lon: -3.7, lat: 40.42 },
				{ code: 'europe-central2', city: 'Warsaw', lon: 21.01, lat: 52.23 },
				{ code: 'me-west1', city: 'Tel Aviv', lon: 34.78, lat: 32.07 },
				{ code: 'me-central1', city: 'Doha', lon: 51.53, lat: 25.29 },
				{ code: 'africa-south1', city: 'Johannesburg', lon: 28.05, lat: -26.2 },
				{ code: 'asia-south1', city: 'Mumbai', lon: 72.88, lat: 19.08 },
				{ code: 'asia-south2', city: 'Delhi', lon: 77.21, lat: 28.61 },
				{ code: 'asia-southeast1', city: 'Singapore', lon: 103.8, lat: 1.35 },
				{ code: 'asia-southeast2', city: 'Jakarta', lon: 106.85, lat: -6.2 },
				{ code: 'asia-east1', city: 'Taiwan', lon: 121.0, lat: 24.07 },
				{ code: 'asia-east2', city: 'Hong Kong', lon: 114.16, lat: 22.32 },
				{ code: 'asia-northeast1', city: 'Tokyo', lon: 139.7, lat: 35.7 },
				{ code: 'asia-northeast2', city: 'Osaka', lon: 135.5, lat: 34.69 },
				{ code: 'asia-northeast3', city: 'Seoul', lon: 126.98, lat: 37.57 },
				{ code: 'australia-southeast1', city: 'Sydney', lon: 151.21, lat: -33.87 },
				{ code: 'australia-southeast2', city: 'Melbourne', lon: 144.96, lat: -37.81 }
			]
		}
	];

	function msOf(c: { lon: number; lat: number }): number {
		const km = geoDistance([users.lon, users.lat], [c.lon, c.lat]) * 6371;
		return Math.round(10 + km * 0.018);
	}

	let provider = $state<ProviderId | null>(null);
	const activeRegions = $derived.by<Region[]>(() => {
		const p = PROVIDERS.find((x) => x.id === provider);
		if (!p) return [];
		return p.regions.map((r) => ({ ...r, ms: msOf(r) }));
	});

	let mode = $state<'flat' | 'globe'>('flat'); // desktop toggle only; small screens are always the globe

	// ---- selection state ----
	let selected = $state<Region | null>(null);
	let hovered = $state<Region | null>(null);
	const active = $derived(hovered ?? selected);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let loadTimer: ReturnType<typeof setTimeout> | undefined;
	const latency = new Tween(0, { duration: 650, easing: cubicOut });

	// Completion needs a genuinely near region (São Paulo) AND a genuinely far one, in any order.
	// The flags persist across provider switches, so comparing across providers counts too.
	let nearTested = $state(false);
	let farTested = $state(false);
	const compareDone = $derived(nearTested && farTested);
	let fired = false;

	function setProvider(id: ProviderId) {
		provider = id;
		selected = null;
		hovered = null;
		latency.target = 0;
		browser = 'idle';
		if (loadTimer) clearTimeout(loadTimer);
	}

	function pick(r: Region) {
		selected = r;
		latency.target = r.ms;
		if (loadTimer) clearTimeout(loadTimer);
		browser = 'loading';
		loadTimer = setTimeout(() => (browser = 'loaded'), Math.min(2000, 250 + r.ms * 5));
		onstate?.(r.ms <= 60 ? 'near' : r.ms <= 200 ? 'mid' : 'far');
		if (r.ms <= 60) nearTested = true;
		if (r.ms > 200) farTested = true;
		if (nearTested && farTested && !fired) {
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

{#snippet globeBase(v: GlobeView)}
	{#if selected}
		{@const d = v.path({ type: 'LineString', coordinates: [[users.lon, users.lat], [selected.lon, selected.lat]] })}
		{#if d}<path {d} fill="none" stroke="#2e6fe0" stroke-width="2.5" stroke-linecap="round" />{/if}
	{/if}

	{#each activeRegions as r (r.code)}
		{@const p = v.project(r.lon, r.lat)}
		{#if p}
			{@const on = selected?.code === r.code || hovered?.code === r.code}
			<g
				class="pin"
				role="button"
				tabindex="0"
				aria-label={r.city}
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
				<text x={p[0]} y={p[1] - 13} text-anchor="middle" fill="#16212b" font-size="12" font-weight="700">{active.city}</text>
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

{#snippet globeWithTag(v: GlobeView)}
	{@render globeBase(v)}
	{#if selected}
		{@const m = globeTag(v)}
		{#if m}{@render latencyTag(m[0], m[1])}{/if}
	{/if}
{/snippet}

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

<div class="flex h-full w-full flex-col gap-2.5">
	<!-- provider picker: the globe changes with the choice -->
	<div class="flex shrink-0 items-center justify-center gap-2">
		{#each PROVIDERS as p (p.id)}
			<button
				type="button"
				onclick={() => setProvider(p.id)}
				class="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12.5px] font-semibold transition-all {provider === p.id
					? ''
					: 'border-line bg-card text-faint hover:text-ink'}"
				style={provider === p.id ? `border-color:${p.color};color:${p.color};background:${p.color}14` : ''}
			>
				<ProviderLogo id={p.id} size={20} />
				<span>{p.short}</span>
			</button>
		{/each}
	</div>

	<div class="flex min-h-0 w-full flex-1 flex-col gap-4 md:flex-row">
		<!-- Map / Globe -->
		<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background: #f1f6fc;">
			{#if !provider}
				<div class="text-muted absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm font-medium">
					{tx.pickProvider}
				</div>
			{/if}

			<!-- small-screen progress + hint, over the globe -->
			{#if provider && !compareDone}
				<div class="pointer-events-none absolute top-2 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 md:hidden">
					{@render compareChips()}
					{#if !selected}
						<span class="border-line text-muted max-w-[15rem] rounded-2xl border bg-white/85 px-3 py-1 text-center text-[10px] font-medium leading-snug backdrop-blur">{tx.compare.hint}</span>
					{/if}
				</div>
			{/if}

			<!-- small screens: globe only -->
			<div class="absolute inset-0 md:hidden">
				<Globe overlay={globeWithTag} />
				{#if provider}
					<p class="text-faint pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px]">{tx.drag}</p>
				{/if}
			</div>

			<!-- tablet and up: flat / globe toggle -->
			<div class="absolute inset-0 hidden md:block">
				<div class="border-line absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-full border bg-white/85 p-0.5 text-[11px] font-semibold backdrop-blur">
					<button
						onclick={() => (mode = 'flat')}
						class="rounded-full px-2.5 py-1 transition-colors {mode === 'flat' ? 'text-white' : 'text-faint hover:text-ink'}"
						style={mode === 'flat' ? 'background: var(--toggle-active);' : ''}
					>
						{tx.flatLabel}
					</button>
					<button
						onclick={() => (mode = 'globe')}
						class="rounded-full px-2.5 py-1 transition-colors {mode === 'globe' ? 'text-white' : 'text-faint hover:text-ink'}"
						style={mode === 'globe' ? 'background: var(--toggle-active);' : ''}
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

						{#each activeRegions as r (r.code)}
							{@const x = fx(r.lon)}
							{@const y = fy(r.lat)}
							{@const on = selected?.code === r.code || hovered?.code === r.code}
							<g
								class="pin"
								role="button"
								tabindex="0"
								aria-label={r.city}
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
								<text x={lp.lx} y={lp.nameY} text-anchor={lp.anchor} fill="#16212b" font-size="13" font-weight="700">{active.city}</text>
								<text x={lp.lx} y={lp.codeY} text-anchor={lp.anchor} fill="#8a949d" font-size="10.5">{active.code}</text>
							</g>
						{/if}

						{#if provider}
							<circle cx={userFx} cy={userFy} r="12" fill="#dd9e36" opacity="0.25" class="pulse" />
							<circle cx={userFx} cy={userFy} r="6.5" fill="#16212b" />
							<text x={userFx} y={userFy + 26} text-anchor="middle" fill="#16212b" font-size="13" font-weight="700">{tx.users}</text>
						{/if}
					</svg>
				{:else}
					<Globe overlay={globeBase} />
					{#if provider}
						<p class="text-faint pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px]">{tx.drag}</p>
					{/if}
				{/if}
			</div>
		</div>

		<!-- Phone + readout (desktop only; small screens read the latency off the line) -->
		<div class="hidden shrink-0 md:flex md:w-[200px] md:flex-col md:items-center md:justify-center md:gap-4">
			<Browser phase={browser} />
			<div class="border-line bg-card w-full rounded-2xl border p-4 text-center">
				{#if !compareDone}
					{@render compareChips()}
					<p class="text-faint mt-1.5 text-[11px] leading-snug {selected ? 'mb-3' : ''}">{tx.compare.hint}</p>
				{/if}
				{#if selected}
					{@const vk = verdictKey(selected.ms)}
					<p class="text-ink text-sm font-semibold">{selected.city}</p>
					<p class="text-faint text-[11px]">{selected.code}</p>
					<p class="mt-2 text-3xl font-bold tabular-nums {toneText[tone[vk]]}">
						{Math.round(latency.current)}<span class="text-muted text-sm font-medium"> {tx.ms}</span>
					</p>
					<span class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold {toneBg[tone[vk]]}">
						{tx.verdicts[vk]}
					</span>
				{:else if compareDone}
					<p class="text-faint text-sm">{provider ? tx.readoutPrompt : tx.pickProvider}</p>
				{/if}
			</div>
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
