<script lang="ts">
	import { page } from '$app/state';
	import { lang, setLang } from '$lib/i18n';
	import { getChapter } from '$lib/chapters';
	import ProgressDots from '$lib/components/ProgressDots.svelte';

	let { children } = $props();

	const chapter = $derived(getChapter(page.params.chapter));
	const total = $derived(chapter ? chapter.lessons.length : 0);
	const index = $derived(chapter ? chapter.lessons.findIndex((l) => l.id === page.params.lesson) : -1);
	const current = $derived(index >= 0 ? index : total - 1);
</script>

<div
	class="flex min-h-dvh flex-col overflow-x-hidden md:h-dvh md:overflow-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, #eef4fc 0%, #f6f4ee 55%, #faf9f6 100%);"
>
	<header class="z-20 flex shrink-0 items-center justify-between px-5 pt-4 md:px-8">
		<a href="/" class="font-display text-lg font-semibold tracking-tight">Nimbus</a>
		<div class="flex items-center gap-3">
			<div class="border-line flex items-center gap-0.5 rounded-full border bg-white/70 p-0.5 text-[11px] font-bold backdrop-blur">
				<button
					onclick={() => setLang('id')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'id' ? 'bg-ink text-white' : 'text-faint hover:text-ink'}"
				>
					ID
				</button>
				<button
					onclick={() => setLang('en')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'en' ? 'bg-ink text-white' : 'text-faint hover:text-ink'}"
				>
					EN
				</button>
			</div>
			{#if total > 0}
				<ProgressDots {total} {current} />
			{/if}
		</div>
	</header>

	{@render children()}
</div>
