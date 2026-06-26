<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onNavigate } from '$app/navigation';
	import { theme } from '$lib/theme.svelte';

	let { children } = $props();

	// Restore persisted theme from localStorage on first client render
	$effect(() => {
		if (typeof document === 'undefined') return;
		try {
			const stored = localStorage.getItem('nimbus-theme') as string | null;
			if (stored === 'light' || stored === 'dark') theme.set(stored);
		} catch {
			// localStorage unavailable
		}
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		document.documentElement.classList.toggle('dark', $theme === 'dark');
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
