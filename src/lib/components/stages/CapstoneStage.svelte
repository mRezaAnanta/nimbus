<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CapstoneText } from '$lib/chapters/capstone/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CapstoneText);

	let added = $state<Record<string, boolean>>({});
	let testing = $state(false);
	let step = $state(-1); // which stress step is flashing
	let tested = $state(false);
	let fired = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const count = $derived(Object.values(added).filter(Boolean).length);
	const allAdded = $derived(count === tx.caps.length);
	const ratio = $derived(count / tx.caps.length);

	function add(key: string) {
		if (added[key] || testing || tested) return;
		added = { ...added, [key]: true };
		onstate?.(key);
	}

	function runTest() {
		if (!allAdded || testing || tested) return;
		testing = true;
		tx.testSteps.forEach((_, i) => {
			timers.push(setTimeout(() => (step = i), 500 + i * 650));
		});
		timers.push(
			setTimeout(
				() => {
					testing = false;
					step = -1;
					tested = true;
					onstate?.('tested');
					if (!fired) {
						fired = true;
						oncomplete?.();
					}
				},
				700 + tx.testSteps.length * 650
			)
		);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<!-- The app, growing from fragile to resilient -->
	<div class="border-line bg-card relative flex min-h-[180px] flex-1 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-5">
		<div
			class="flex flex-col items-center gap-2 rounded-2xl border px-7 py-5 transition-all duration-500 {tested
				? 'border-grass bg-grass-soft'
				: allAdded
					? 'border-brand bg-brand-soft'
					: 'border-line bg-paper'}"
		>
			<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
				<rect x="6" y="13" width="28" height="20" rx="3" fill={tested ? '#3a9c64' : allAdded ? '#2e6fe0' : '#8a949d'} />
				<rect x="11" y="8" width="18" height="8" rx="2" fill={tested ? '#2f8553' : allAdded ? '#255fc4' : '#74808a'} />
				<circle cx="20" cy="23" r="3.5" fill="#fff" />
			</svg>
			<span class="text-ink text-sm font-bold">{tx.appName}</span>
			<span class="text-[11px] font-semibold {tested ? 'text-grass' : 'text-faint'}">
				{tested || allAdded ? tx.appReady : tx.appWeak}
			</span>
		</div>

		{#if testing}
			<div class="mt-1 flex flex-wrap items-center justify-center gap-1.5">
				{#each tx.testSteps as s, i (s)}
					<span
						class="rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 {step >= i
							? i === tx.testSteps.length - 1
								? 'bg-grass-soft text-grass'
								: 'bg-amber-soft text-amber'
							: 'bg-line text-faint opacity-40'}"
					>
						{s}
					</span>
				{/each}
			</div>
		{/if}

		{#if tested}
			<div class="pop mt-1 flex items-center gap-2">
				<span class="relative flex h-2.5 w-2.5">
					<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass opacity-60"></span>
					<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-grass"></span>
				</span>
				<span class="text-grass text-lg font-bold tracking-wide">{tx.online}</span>
			</div>
		{/if}
	</div>

	<!-- The capability checklist -->
	<div class="flex shrink-0 flex-col gap-2.5 md:w-[300px]">
		<div class="flex items-center justify-between">
			<span class="text-faint text-[11px] font-semibold tracking-wide uppercase">{tx.readiness}</span>
			<span class="text-muted text-[11px] font-bold">{count}/{tx.caps.length}</span>
		</div>
		<div class="bg-line h-1.5 w-full overflow-hidden rounded-full">
			<div
				class="h-full rounded-full transition-all duration-500 {tested ? 'bg-grass' : 'bg-brand'}"
				style="width:{ratio * 100}%"
			></div>
		</div>

		<div class="flex flex-col gap-1.5">
			{#each tx.caps as cap (cap.key)}
				<button
					type="button"
					onclick={() => add(cap.key)}
					disabled={added[cap.key] || testing || tested}
					class="flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all {added[cap.key]
						? 'border-grass bg-grass-soft'
						: 'border-line bg-card hover:border-brand hover:bg-brand-soft'} disabled:cursor-default"
				>
					<span
						class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold {added[cap.key]
							? 'bg-grass text-white'
							: 'border-line text-faint border'}"
					>
						{#if added[cap.key]}✓{/if}
					</span>
					<span class="min-w-0">
						<span class="text-ink block text-[12.5px] font-semibold leading-tight">{cap.name}</span>
						<span class="text-faint block text-[10.5px] leading-tight">{cap.recall}</span>
					</span>
				</button>
			{/each}
		</div>

		{#if !tested}
			<button
				type="button"
				onclick={runTest}
				disabled={!allAdded || testing}
				class="bg-ink mt-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all enabled:hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{testing ? `${tx.testing}...` : tx.runTest}
			</button>
		{:else}
			<p class="text-grass mt-1 text-center text-sm font-bold">✓ {tx.appReady}</p>
		{/if}
		{#if !allAdded && !testing}
			<p class="text-faint text-center text-[11px]">{tx.addHint}</p>
		{/if}
	</div>
</div>

<style>
	.pop {
		animation: pop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
