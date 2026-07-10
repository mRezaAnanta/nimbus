<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tx,
		compareDone,
		nearTested,
		farTested,
		hintCompact = false,
		children
	}: {
		tx: { compare: { near: string; far: string; hint: string } };
		compareDone: boolean;
		nearTested: boolean;
		farTested: boolean;
		hintCompact?: boolean;
		children?: Snippet;
	} = $props();
</script>

{#snippet stepChip(label: string, done: boolean)}
	<span
		class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur transition-colors {done
			? 'border-transparent bg-grass-soft text-grass'
			: 'border-line bg-card text-faint'}"
	>
		{#if done}
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg>
		{:else}
			<span class="h-1.5 w-1.5 rounded-full border border-current opacity-60"></span>
		{/if}
		{label}
	</span>
{/snippet}

<div class="border-line bg-card w-[160px] rounded-2xl border p-4 text-center md:w-full">
	{#if !compareDone}
		<div class="flex items-center justify-center gap-1.5">
			{@render stepChip(tx.compare.near, nearTested)}
			{@render stepChip(tx.compare.far, farTested)}
		</div>
		<p class="text-faint mt-1.5 text-[11px] leading-snug {hintCompact ? 'mb-3' : ''}">{tx.compare.hint}</p>
	{/if}
	{@render children?.()}
</div>
