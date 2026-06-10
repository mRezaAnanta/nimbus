<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import type { CloudText, LessonText } from '$lib/chapters/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as CloudText);

	let open = $state<'home' | 'cloud' | null>(null);
	let explored = $state({ home: false, cloud: false });
	let preview = $state<'idle' | 'loading' | 'loaded' | 'offline'>('idle');

	let timers: ReturnType<typeof setTimeout>[] = [];
	let loop: ReturnType<typeof setInterval> | undefined;
	function clearAll() {
		timers.forEach(clearTimeout);
		timers = [];
		if (loop) {
			clearInterval(loop);
			loop = undefined;
		}
	}

	function pick(which: 'home' | 'cloud') {
		const firstClick = !explored.home && !explored.cloud;
		open = which;
		explored = { ...explored, [which]: true };

		clearAll();
		preview = 'loading';
		if (which === 'cloud') {
			// cloud: loads quickly and stays online
			timers.push(setTimeout(() => (preview = 'loaded'), 650));
		} else {
			// on-premise: loads, then keeps flickering offline (power cuts)
			timers.push(
				setTimeout(() => {
					preview = 'loaded';
					loop = setInterval(() => {
						preview = preview === 'loaded' ? 'offline' : 'loaded';
					}, 1100);
				}, 650)
			);
		}

		if (explored.home && explored.cloud) {
			onstate?.('both');
			oncomplete?.();
		} else if (firstClick) {
			onstate?.(which);
		}
	}

	onDestroy(clearAll);
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-6">
	<!-- live preview above the two choices -->
	<div class="flex flex-col items-center gap-2">
		{#if open}
			<span
				class="rounded-full px-3 py-1 text-xs font-semibold {open === 'cloud'
					? 'bg-brand-soft text-brand'
					: 'bg-amber-soft text-amber'}"
			>
				{open === 'cloud' ? tx.cloudTerm : tx.onpremTerm}
			</span>
		{:else}
			<span class="text-faint text-xs font-semibold">&nbsp;</span>
		{/if}
		<Browser phase={preview} offlineText={tx.offline} />
	</div>

	<!-- the two choices -->
	<div class="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
		<!-- on-premise -->
		<button
			onclick={() => pick('home')}
			class="rounded-2xl border-2 p-5 text-left transition-all {open === 'home'
				? 'border-amber bg-amber-soft/40'
				: 'border-line bg-card hover:border-faint'}"
		>
			<div class="flex items-center gap-3">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M4 11 12 4l8 7" stroke="#16212b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M6 10v9h12v-9" stroke="#16212b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<div>
					<p class="text-ink font-semibold">{tx.homeTitle}</p>
					<p class="text-faint text-xs">{tx.homeSub}</p>
				</div>
			</div>
			{#if explored.home}
				<ul class="mt-4 space-y-2">
					{#each tx.homePoints as p (p)}
						<li class="text-muted flex gap-2 text-[13px] leading-snug">
							<span class="text-danger mt-px shrink-0">✕</span>{p}
						</li>
					{/each}
				</ul>
			{/if}
		</button>

		<!-- cloud -->
		<button
			onclick={() => pick('cloud')}
			class="rounded-2xl border-2 p-5 text-left transition-all {open === 'cloud'
				? 'border-brand bg-brand-soft/50'
				: 'border-line bg-card hover:border-faint'}"
		>
			<div class="flex items-center gap-3">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M7 18a4 4 0 0 1 .5-8 5 5 0 0 1 9.7 1.3A3.5 3.5 0 0 1 17 18H7Z"
						stroke="#2e6fe0"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</svg>
				<div>
					<p class="text-ink font-semibold">{tx.cloudTitle}</p>
					<p class="text-faint text-xs">{tx.cloudSub}</p>
				</div>
			</div>
			{#if explored.cloud}
				<ul class="mt-4 space-y-2">
					{#each tx.cloudPoints as p (p)}
						<li class="text-muted flex gap-2 text-[13px] leading-snug">
							<span class="text-grass mt-px shrink-0">✓</span>{p}
						</li>
					{/each}
				</ul>
			{/if}
		</button>
	</div>
</div>
