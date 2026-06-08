<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

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
