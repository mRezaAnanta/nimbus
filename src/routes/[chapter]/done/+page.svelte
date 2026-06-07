<script lang="ts">
	import { goto } from '$app/navigation';
	import { lang } from '$lib/i18n';
	import { getChapter } from '$lib/chapters';
	import Nim from '$lib/components/Nim.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const chapter = $derived(getChapter(data.chapterId)!);
	const s = $derived(chapter.summary[$lang]);

	function restart() {
		goto(`/${chapter.id}/${chapter.lessons[0].id}`);
	}
</script>

<svelte:head>
	<title>Nimbus: {s.title}</title>
</svelte:head>

<main class="flex min-h-0 flex-1 items-center justify-center p-6">
	<div class="max-w-md text-center">
		<div class="flex justify-center"><Nim mood="happy" size={92} /></div>
		<h1 class="font-display text-ink mt-4 text-4xl font-medium">{s.title}</h1>
		<p class="text-muted mt-2">{s.sub}</p>
		<ul class="border-line bg-card mx-auto mt-5 max-w-sm space-y-3 rounded-2xl border p-5 text-left">
			{#each s.items as item (item)}
				<li class="flex gap-3 text-sm"><span class="text-grass font-bold">✓</span><span class="text-muted">{@html item}</span></li>
			{/each}
		</ul>
		<p class="text-faint mx-auto mt-5 max-w-sm text-[13px] leading-relaxed">{@html s.nextNote}</p>
		<button
			onclick={restart}
			class="bg-ink mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-125"
		>
			{s.restart}
		</button>
	</div>
</main>
