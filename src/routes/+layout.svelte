<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onNavigate } from '$app/navigation';
	import { theme } from '$lib/theme';

	let { children } = $props();

	// Keep the dark class in sync with the store after Svelte hydrates.
	// The initial class is already set before paint by the inline script in app.html.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const dark = $theme === 'dark';
		document.documentElement.classList.toggle('dark', dark);
		// Mobile browser chrome follows the theme, otherwise it stays cream in dark mode.
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', dark ? '#121A24' : '#FAF9F6');
	});

	// Cross-route view transitions, so a shared element like Nim glides between pages
	// instead of disappearing and reappearing.
	onNavigate((navigation) => {
		if (typeof document === 'undefined' || !document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
