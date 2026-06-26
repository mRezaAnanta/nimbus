<script lang="ts">
	import { lang, setLang } from '$lib/i18n';
	import { theme } from '$lib/theme.svelte';
	import LessonMenu from '$lib/components/LessonMenu.svelte';

	let { children } = $props();
</script>

<div
	class="flex h-dvh flex-col overflow-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, var(--bg-grad-1) 0%, var(--bg-grad-2) 55%, var(--bg-grad-3) 100%);"
>
	<header
		class="z-20 flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-8"
	>
		<div class="flex items-center gap-2.5">
			<LessonMenu />
			<a href="/" class="font-display text-lg font-semibold tracking-tight">Nimbus</a>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={() => theme.toggle()}
				class="flex h-7 w-7 items-center justify-center rounded-full text-faint transition-colors hover:text-ink"
				aria-label="Toggle theme"
			>
				{#if $theme === 'light'}
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
					>
				{:else}
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="12" cy="12" r="5" /><path
							d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
						/></svg
					>
				{/if}
			</button>
			<div
				class="flex items-center gap-0.5 rounded-full border border-line p-0.5 text-[11px] font-bold backdrop-blur"
				style="background: var(--header-bg);"
			>
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
