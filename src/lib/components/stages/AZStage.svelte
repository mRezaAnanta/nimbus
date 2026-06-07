<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import type { LessonText, AZText } from '$lib/chapters/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as AZText);

	const zones = ['A', 'B', 'C'];
	let servers = $state(new Set(['A'])); // start: one server, in a single AZ
	let downZone = $state<string | null>(null);
	let storming = $state(false);
	let browser = $state<'loaded' | 'offline'>('loaded');
	let fired = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const siteDown = $derived(browser === 'offline');

	function toggle(z: string) {
		if (storming) return;
		const s = new Set(servers);
		if (s.has(z)) s.delete(z);
		else s.add(z);
		servers = s;
	}

	function trigger() {
		if (storming) return;
		const withServer = zones.filter((z) => servers.has(z));
		if (withServer.length === 0) return;
		const victim = withServer[0];
		downZone = victim;
		storming = true;
		const survives = withServer.some((z) => z !== victim);
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
		clearTimeout(timer);
		timer = setTimeout(() => {
			downZone = null;
			storming = false;
			browser = 'loaded';
		}, 2600);
	}

	onDestroy(() => clearTimeout(timer));
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<!-- Region containing its Availability Zones -->
	<div class="border-line bg-card flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border p-4">
		<p class="text-faint text-[11px] font-semibold tracking-widest uppercase">{tx.regionLabel}</p>

		<div class="mt-3 grid flex-1 grid-cols-3 gap-3">
			{#each zones as z (z)}
				{@const has = servers.has(z)}
				{@const isDown = downZone === z}
				<button
					type="button"
					onclick={() => toggle(z)}
					disabled={storming}
					class="relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all select-none disabled:cursor-not-allowed {isDown
						? 'border-line bg-danger-soft text-danger'
						: has
							? 'border-line bg-grass-soft text-grass'
							: 'border-line text-faint hover:text-ink'}"
				>
					<span class="text-[11px] font-semibold tracking-wide uppercase">{tx.zonePrefix} {z}</span>

					{#if isDown}
						<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M13 2 L4 14 h7 l-2 8 11-13 h-7 z" fill="currentColor" stroke="none" />
						</svg>
						<span class="text-[11px] font-semibold">{tx.outage}</span>
					{:else if has}
						<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
							<rect x="3.5" y="5" width="17" height="6" rx="1.6" />
							<rect x="3.5" y="13" width="17" height="6" rx="1.6" />
							<circle cx="7" cy="8" r="1" fill="currentColor" stroke="none" />
							<circle cx="7" cy="16" r="1" fill="currentColor" stroke="none" />
						</svg>
						<span class="text-[11px] font-semibold">{tx.serverLabel}</span>
					{:else}
						<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" class="opacity-60">
							<path d="M12 6 v12 M6 12 h12" />
						</svg>
						<span class="text-[11px]">{tx.serverLabel}</span>
					{/if}
				</button>
			{/each}
		</div>

		<div class="mt-3 flex items-center justify-between gap-3">
			<p class="text-faint text-[11px]">{tx.place}</p>
			<button
				type="button"
				onclick={trigger}
				disabled={storming || servers.size === 0}
				class="shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{tx.trigger}
			</button>
		</div>
	</div>

	<!-- Phone + readout -->
	<div class="flex shrink-0 flex-row items-center justify-center gap-4 md:w-[200px] md:flex-col md:justify-center">
		<Browser phase={browser} />
		<div class="border-line bg-card w-[150px] rounded-2xl border p-4 text-center md:w-full">
			<p class="text-lg font-bold {siteDown ? 'text-danger' : 'text-grass'}">
				{siteDown ? tx.statusDown : tx.statusUp}
			</p>
			<p class="text-faint mt-1 text-[11px]">{tx.activeZones}: {servers.size}/3</p>
		</div>
	</div>
</div>
