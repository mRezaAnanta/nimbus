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
	<div class="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-8 text-center">
		<div class="flex justify-center"><span style="view-transition-name: nim"><Nim mood="happy" size={92} /></span></div>
		<h1 class="font-display text-ink mt-4 text-4xl font-medium">{s.title}</h1>
		<p class="text-muted mt-2">{s.sub}</p>
		<ul class="border-line bg-card mx-auto mt-5 max-w-sm space-y-3 rounded-2xl border p-5 text-left">
			{#each s.items as item (item)}
				<li class="flex gap-3 text-sm"><span class="text-grass font-bold">✓</span><span class="text-muted">{@html item}</span></li>
			{/each}
		</ul>
		<p class="text-faint mx-auto mt-5 max-w-sm text-[13px] leading-relaxed">{@html s.nextNote}</p>
		{#if next}
			<div class="mt-6 flex flex-col items-center gap-3">
				<button
					onclick={goNext}
					class="bg-ink rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-125"
				>
					{next.unnumbered ? next.title[$lang] : `${$t.chapter} ${next.number}: ${next.title[$lang]}`}
				</button>
				<button onclick={restart} class="text-faint hover:text-ink text-[13px] transition-colors">{s.restart}</button>
			</div>
		{:else}
			<button
				onclick={restart}
				class="bg-ink mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-125"
			>
				{s.restart}
			</button>
		{/if}
	</div>
</main>
