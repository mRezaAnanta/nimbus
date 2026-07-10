<script lang="ts">
	let {
		slots = 3,
		active = false
	}: {
		slots?: number;
		active?: boolean;
	} = $props();
</script>

<div class="server">
	{#each Array(slots) as _, i (i)}
		<div class="slot">
			<span class="dot" class:active></span>
		</div>
	{/each}
</div>

<style>
	.server {
		display: flex;
		width: 86px;
		flex-direction: column;
		gap: 8px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
	}
	:global(.dark) .server {
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}
	.slot {
		display: flex;
		height: 16px;
		align-items: center;
		border-radius: 4px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 0 6px;
	}
	.dot {
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background: var(--color-muted);
		transition: background 0.3s ease;
	}
	.dot.active {
		background: var(--color-grass);
	}
</style>
