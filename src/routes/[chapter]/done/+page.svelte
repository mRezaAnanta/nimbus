<script lang="ts">
	import { goto } from '$app/navigation';
	import { lang, t } from '$lib/i18n';
	import { getChapter, getNextChapter } from '$lib/chapters';
	import Nim from '$lib/components/Nim.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const chapter = $derived(getChapter(data.chapterId)!);
	const s = $derived(chapter.summary[$lang]);
	const next = $derived(getNextChapter(data.chapterId));

	function restart() {
		goto(`/${chapter.id}/${chapter.lessons[0].id}`);
	}
	function goNext() {
		if (next) goto(`/${next.id}/${next.lessons[0].id}`);
	}
</script>

<svelte:head>
	<title>Nimbus: {s.title}</title>
</svelte:head>

<main class="flex min-h-0 flex-1 flex-col overflow-y-auto">
	<div class="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-5 text-center md:px-6 md:py-8">
		<div class="flex justify-center">
			<span style="view-transition-name: nim"><Nim mood="happy" size={68} /></span>
		</div>
		<h1 class="font-display text-ink mt-2.5 text-2xl font-medium md:mt-4 md:text-4xl">{s.title}</h1>
		<p class="text-muted mt-1 text-sm md:mt-2 md:text-base">{s.sub}</p>
		<ul class="border-line bg-card mx-auto mt-3.5 max-w-sm space-y-2 rounded-2xl border p-4 text-left md:mt-5 md:space-y-3 md:p-5">
			{#each s.items as item (item)}
				<li class="flex gap-2.5 text-[12.5px] leading-snug md:text-sm">
					<span class="text-grass mt-px font-bold">✓</span><span class="text-muted">{@html item}</span>
				</li>
			{/each}
		</ul>
		<p class="text-faint mx-auto mt-3.5 max-w-sm text-[12px] leading-relaxed md:mt-5 md:text-[13px]">{@html s.nextNote}</p>
		{#if next}
			<div class="mt-4 flex flex-col items-center gap-2 md:mt-6 md:gap-3">
				<button
					onclick={goNext}
					class="bg-ink rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:brightness-125 md:py-3 md:text-sm"
				>
					{next.unnumbered ? next.title[$lang] : `${$t.chapter} ${next.number}: ${next.title[$lang]}`}
				</button>
				<button onclick={restart} class="text-faint hover:text-ink text-xs transition-colors md:text-[13px]">{s.restart}</button>
			</div>
		{:else}
			<button
				onclick={restart}
				class="bg-ink mt-4 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:brightness-125 md:mt-6 md:py-3 md:text-sm"
			>
				{s.restart}
			</button>
		{/if}
	</div>
</main>
