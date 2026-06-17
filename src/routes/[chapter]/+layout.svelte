<script lang="ts">
	import { lang, setLang } from '$lib/i18n';
	import LessonMenu from '$lib/components/LessonMenu.svelte';

	let { children } = $props();
</script>

<div
	class="flex h-dvh flex-col overflow-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, #eef4fc 0%, #f6f4ee 55%, #faf9f6 100%);"
>
	<header
		class="z-20 flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-8"
	>
		<div class="flex items-center gap-2.5">
			<LessonMenu />
			<a href="/" class="font-display text-lg font-semibold tracking-tight">Nimbus</a>
		</div>
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
		</div>
	</header>

	{@render children()}
</div>
