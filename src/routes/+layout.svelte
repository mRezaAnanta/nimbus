<script lang="ts">
	import './layout.css';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';

	// Umami analytics: only load on the deployed site, never during `bun run dev`.
	const UMAMI_SRC = 'https://cloud.umami.is/script.js';
	const UMAMI_ID = 'ae207109-bfc9-4c97-b582-93e0a9b3d4f8';

	onMount(() => {
		if (dev) return;
		const s = document.createElement('script');
		s.defer = true;
		s.src = UMAMI_SRC;
		s.setAttribute('data-website-id', UMAMI_ID);
		document.head.appendChild(s);
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
