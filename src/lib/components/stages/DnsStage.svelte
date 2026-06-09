<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DnsText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as DnsText);

	const names = $derived(Object.keys(tx.domains));

	type Phase = 'idle' | 'resolving' | 'resolved' | 'connecting' | 'connected';
	let selected = $state<string | null>(null);
	let phase = $state<Phase>('idle');
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const ip = $derived(selected ? tx.domains[selected] : '');
	const browserPhase = $derived<'idle' | 'loading' | 'loaded'>(
		phase === 'connecting' ? 'loading' : phase === 'connected' ? 'loaded' : 'idle'
	);

	function pick(name: string) {
		if (phase === 'resolving' || phase === 'connecting') return;
		selected = name;
		phase = 'idle';
	}

	function resolve() {
		if (!selected || phase !== 'idle') return;
		phase = 'resolving';
		timers.push(
			setTimeout(() => {
				phase = 'resolved';
				onstate?.('resolved');
			}, 1100)
		);
	}

	function connect() {
		if (phase !== 'resolved') return;
		phase = 'connecting';
		timers.push(
			setTimeout(() => {
				phase = 'connected';
				onstate?.('connected');
				if (!done) {
					done = true;
					oncomplete?.();
				}
			}, 1100)
		);
	}

	function reset() {
		phase = 'idle';
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-5 pb-[10vh]">
	<!-- domain chips -->
	<div class="flex flex-wrap items-center justify-center gap-2">
		<span class="text-faint mr-1 text-xs font-semibold">{tx.prompt}:</span>
		{#each names as name (name)}
			<button
				type="button"
				onclick={() => pick(name)}
				class="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all {selected === name
					? 'border-brand bg-brand-soft text-brand'
					: 'border-line bg-card text-muted hover:border-brand'}"
			>
				{name}
			</button>
		{/each}
	</div>

	<!-- the pipeline: name -> resolver -> ip -> browser -->
	<div class="flex w-full max-w-2xl flex-col items-center gap-4 md:flex-row md:items-stretch md:justify-center">
		<!-- name card -->
		<div class="border-line bg-card flex w-[170px] flex-col items-center justify-center gap-1 rounded-2xl border p-4">
			<span class="text-faint text-[10px] font-semibold tracking-widest uppercase">name</span>
			<span class="text-ink font-display text-base font-medium">{selected ?? '...'}</span>
		</div>

		<!-- resolver -->
		<div
			class="flex w-[190px] flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-colors {phase ===
				'resolving'
				? 'border-brand bg-brand-soft'
				: phase === 'resolved' || phase === 'connecting' || phase === 'connected'
					? 'border-grass bg-grass-soft'
					: 'border-line bg-card'}"
		>
			<span class="text-faint text-[10px] font-semibold tracking-widest uppercase">{tx.resolverTitle}</span>
			{#if phase === 'idle'}
				<span class="text-faint text-xs">{tx.resolving} ...</span>
			{:else if phase === 'resolving'}
				<span class="text-brand flex items-center gap-2 text-xs font-semibold">
					<span class="dot"></span>{tx.resolving} {selected}
				</span>
			{:else}
				<span class="text-faint text-[10px]">{tx.ipLabel}</span>
				<span class="text-grass font-display text-lg font-semibold tabular-nums">{ip}</span>
			{/if}
		</div>

		<!-- browser -->
		<div class="flex shrink-0 scale-90 flex-col items-center md:scale-100">
			<Browser phase={browserPhase} />
		</div>
	</div>

	<!-- actions -->
	<div class="flex items-center gap-3">
		{#if phase === 'connected'}
			<span class="text-grass text-sm font-semibold">✓ {tx.connected}</span>
			<button
				type="button"
				onclick={reset}
				class="border-line text-muted hover:border-brand rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
			>
				{tx.again}
			</button>
		{:else}
			<button
				type="button"
				onclick={resolve}
				disabled={!selected || phase !== 'idle'}
				class="bg-ink rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all enabled:hover:brightness-125 disabled:opacity-40"
			>
				{tx.resolveLabel}
			</button>
			<button
				type="button"
				onclick={connect}
				disabled={phase !== 'resolved'}
				class="bg-brand rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all enabled:hover:brightness-110 disabled:opacity-40"
			>
				{tx.connectLabel}
			</button>
		{/if}
	</div>
</div>

<style>
	.dot {
		display: inline-block;
		height: 8px;
		width: 8px;
		border-radius: 50%;
		background: #2e6fe0;
		animation: blink 0.8s ease-in-out infinite;
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 1;
		}
	}
</style>
