<script lang="ts">
	import type { Mood } from '$lib/chapters/types';
	let { mood = 'calm', size = 76 }: { mood?: Mood; size?: number } = $props();

	const sparkleEyes = $derived(mood === 'excited' || mood === 'idea');
	const openSmile = $derived(mood === 'excited' || mood === 'idea');
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 100 100"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	style="filter: drop-shadow(0 4px 8px rgba(22,40,60,.10));"
	role="img"
	aria-label="Nim, pemandu awan"
>
	<!-- lightbulb (a fresh idea) -->
	{#if mood === 'idea'}
		<line x1="50" y1="3" x2="50" y2="6.5" stroke="#dd9e36" stroke-width="1.5" stroke-linecap="round" />
		<line x1="38.5" y1="8" x2="41" y2="10.5" stroke="#dd9e36" stroke-width="1.5" stroke-linecap="round" />
		<line x1="61.5" y1="8" x2="59" y2="10.5" stroke="#dd9e36" stroke-width="1.5" stroke-linecap="round" />
		<circle cx="50" cy="17" r="8" fill="#ffe08a" stroke="#dd9e36" stroke-width="1.4" />
		<rect x="46.5" y="23" width="7" height="3.6" rx="1.2" fill="#c9881f" />
	{/if}

	<!-- cloud body -->
	<g>
		<ellipse cx="50" cy="66" rx="33" ry="20" fill="#fff" />
		<circle cx="33" cy="60" r="15" fill="#fff" />
		<circle cx="50" cy="50" r="20" fill="#fff" />
		<circle cx="67" cy="60" r="15" fill="#fff" />
	</g>

	<!-- hard hat -->
	<path d="M35 44a15 13 0 0 1 30 0Z" fill="#dd9e36" />
	<rect x="31" y="42" width="38" height="5" rx="2.5" fill="#dd9e36" />
	<rect x="47" y="30" width="6" height="8" rx="3" fill="#c9881f" />

	<!-- eyes -->
	{#if mood === 'thinking'}
		<circle cx="43" cy="55" r="2.4" fill="#16212b" />
		<circle cx="59" cy="55" r="2.4" fill="#16212b" />
		<path d="M39 50q4-3 8 0" stroke="#16212b" stroke-width="1.6" stroke-linecap="round" fill="none" />
	{:else if mood === 'surprised'}
		<circle cx="43" cy="56" r="3.7" fill="#16212b" />
		<circle cx="59" cy="56" r="3.7" fill="#16212b" />
		<circle cx="44.3" cy="54.6" r="1.1" fill="#fff" />
		<circle cx="60.3" cy="54.6" r="1.1" fill="#fff" />
	{:else if mood === 'worried'}
		<circle cx="43" cy="57" r="2.6" fill="#16212b" />
		<circle cx="59" cy="57" r="2.6" fill="#16212b" />
		<path d="M39 51l7 2.4" stroke="#16212b" stroke-width="1.6" stroke-linecap="round" />
		<path d="M63 51l-7 2.4" stroke="#16212b" stroke-width="1.6" stroke-linecap="round" />
	{:else if mood === 'sad'}
		<circle cx="43" cy="57.5" r="2.5" fill="#16212b" />
		<circle cx="59" cy="57.5" r="2.5" fill="#16212b" />
		<path d="M40 53.5l6 -1.5" stroke="#16212b" stroke-width="1.6" stroke-linecap="round" />
		<path d="M60 53.5l-6 -1.5" stroke="#16212b" stroke-width="1.6" stroke-linecap="round" />
	{:else if sparkleEyes}
		<path d="M43 51.5l1.3 2.7 2.7 1.3-2.7 1.3-1.3 2.7-1.3-2.7-2.7-1.3 2.7-1.3z" fill="#16212b" />
		<path d="M59 51.5l1.3 2.7 2.7 1.3-2.7 1.3-1.3 2.7-1.3-2.7-2.7-1.3 2.7-1.3z" fill="#16212b" />
	{:else if mood === 'wink'}
		<path d="M40 56.5q3 3 6 0" stroke="#16212b" stroke-width="1.8" stroke-linecap="round" fill="none" />
		<circle cx="59" cy="56" r="2.8" fill="#16212b" />
		<circle cx="60" cy="55" r="0.9" fill="#fff" />
	{:else}
		<circle cx="43" cy="56" r="2.8" fill="#16212b" />
		<circle cx="59" cy="56" r="2.8" fill="#16212b" />
		<circle cx="44" cy="55" r="0.9" fill="#fff" />
		<circle cx="60" cy="55" r="0.9" fill="#fff" />
	{/if}

	<!-- cheeks -->
	<circle cx="36" cy="62" r="3" fill="#ffb3a8" opacity="0.6" />
	<circle cx="64" cy="62" r="3" fill="#ffb3a8" opacity="0.6" />

	<!-- mouth -->
	{#if openSmile}
		<path d="M42 61q8 11 16 0z" fill="#16212b" />
	{:else if mood === 'happy' || mood === 'wink'}
		<path d="M43 62q7 8 14 0" stroke="#16212b" stroke-width="2.4" stroke-linecap="round" fill="none" />
	{:else if mood === 'surprised'}
		<ellipse cx="50" cy="64.5" rx="2.8" ry="3.4" fill="#16212b" />
	{:else if mood === 'worried'}
		<path d="M45 65q5 2 10 0" stroke="#16212b" stroke-width="2.2" stroke-linecap="round" fill="none" />
	{:else if mood === 'sad'}
		<path d="M44 65q6 4.5 12 0" stroke="#16212b" stroke-width="2.2" stroke-linecap="round" fill="none" />
	{:else if mood === 'thinking'}
		<circle cx="50" cy="64" r="2.3" fill="#16212b" />
	{:else}
		<path d="M45 63q5 4 10 0" stroke="#16212b" stroke-width="2.4" stroke-linecap="round" fill="none" />
	{/if}

	<!-- accessory -->
	{#if mood === 'worried'}
		<path d="M71 49q2.6 4 0 7q-2.6-3 0-7z" fill="#5aa9e6" />
	{:else if mood === 'sad'}
		<path d="M41 60q1.8 3 0 5q-1.8-2 0-5z" fill="#5aa9e6" />
	{:else if mood === 'excited'}
		<path d="M75 41l0.9 2.3 2.3 0.9-2.3 0.9-0.9 2.3-0.9-2.3-2.3-0.9 2.3-0.9z" fill="#dd9e36" />
		<path d="M24 45l0.8 2 2 0.8-2 0.8-0.8 2-0.8-2-2-0.8 2-0.8z" fill="#dd9e36" />
	{/if}
</svg>
