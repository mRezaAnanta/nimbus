<script lang="ts">
	type Mood = 'calm' | 'happy' | 'thinking';
	let { mood = 'calm', size = 76 }: { mood?: Mood; size?: number } = $props();
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
	<!-- cloud body (white circles, no internal strokes) -->
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
		<path d="M39 50q4-3 8 0" stroke="#16212b" stroke-width="1.6" stroke-linecap="round" />
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
	{#if mood === 'happy'}
		<path d="M43 62q7 8 14 0" stroke="#16212b" stroke-width="2.4" stroke-linecap="round" />
	{:else if mood === 'thinking'}
		<circle cx="50" cy="64" r="2.3" fill="#16212b" />
	{:else}
		<path d="M45 63q5 4 10 0" stroke="#16212b" stroke-width="2.4" stroke-linecap="round" />
	{/if}
</svg>
