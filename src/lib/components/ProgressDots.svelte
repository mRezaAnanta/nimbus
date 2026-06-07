<script lang="ts">
	let { total, current }: { total: number; current: number } = $props();
</script>

<div class="flex items-center gap-2" aria-label="Kemajuan pelajaran">
	{#each Array(total) as _, i (i)}
		<span
			class="block h-1.5 rounded-full transition-all duration-300"
			class:bg-brand={i <= current}
			class:bg-line={i > current}
			style="width: {i === current ? '28px' : '10px'}"
		></span>
	{/each}
</div>
