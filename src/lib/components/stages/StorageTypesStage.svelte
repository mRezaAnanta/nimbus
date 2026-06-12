<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { StorageTypesText } from '$lib/chapters/resilience/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as StorageTypesText);

	// each use case belongs to exactly one storage type
	type Bin = 'object' | 'block' | 'file';
	const ANSWER: Record<string, Bin> = {
		photos: 'object',
		backups: 'object',
		dbDisk: 'block',
		osDisk: 'block',
		shared: 'file'
	};
	const ORDER = ['photos', 'dbDisk', 'shared', 'backups', 'osDisk'];

	// where each case has been placed (null = still in the tray)
	let placed = $state<Record<string, Bin | null>>({
		photos: null,
		backups: null,
		dbDisk: null,
		osDisk: null,
		shared: null
	});
	let selected = $state<string | null>(null);
	let wrongBin = $state<Bin | null>(null);
	let wrongKey = $state<string | null>(null);
	let fired = false;

	const tray = $derived(ORDER.filter((k) => placed[k] === null));
	const allDone = $derived(ORDER.every((k) => placed[k] === ANSWER[k]));

	const bins: { id: Bin; title: () => string; sub: () => string }[] = [
		{ id: 'object', title: () => tx.objectTitle, sub: () => tx.objectSub },
		{ id: 'block', title: () => tx.blockTitle, sub: () => tx.blockSub },
		{ id: 'file', title: () => tx.fileTitle, sub: () => tx.fileSub }
	];

	function pick(key: string) {
		selected = selected === key ? null : key;
		wrongBin = null;
		wrongKey = null;
	}

	function drop(bin: Bin) {
		if (!selected) return;
		const key = selected;
		if (ANSWER[key] === bin) {
			placed[key] = bin;
			selected = null;
			wrongBin = null;
			wrongKey = null;
			onstate?.('correct');
			if (allDone && !fired) {
				fired = true;
				oncomplete?.();
			}
		} else {
			wrongBin = bin;
			wrongKey = key;
			onstate?.('wrong');
		}
	}

	function inBin(bin: Bin) {
		return ORDER.filter((k) => placed[k] === bin);
	}
</script>

<div class="flex h-full w-full flex-col gap-4">
	<!-- tray of use cases -->
	<div class="border-line bg-card flex min-h-[64px] flex-wrap items-center justify-center gap-2 rounded-2xl border p-3">
		{#if tray.length === 0}
			<span class="text-grass text-sm font-semibold">{tx.done}</span>
		{:else}
			{#each tray as key (key)}
				<button
					type="button"
					onclick={() => pick(key)}
					class="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all {selected === key
						? 'border-brand bg-brand-soft text-brand'
						: wrongKey === key
							? 'border-danger bg-danger-soft text-danger'
							: 'border-line bg-paper text-ink hover:border-brand'}"
				>
					{tx.cases[key]}
				</button>
			{/each}
		{/if}
	</div>

	<p class="text-faint text-center text-[11px]">{tx.prompt}</p>

	<!-- three storage bins -->
	<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-3">
		{#each bins as b (b.id)}
			<button
				type="button"
				onclick={() => drop(b.id)}
				disabled={!selected}
				class="flex flex-col rounded-2xl border-2 p-3 text-left transition-all {wrongBin === b.id
					? 'border-danger bg-danger-soft'
					: selected
						? 'border-brand bg-brand-soft cursor-pointer'
						: 'border-line bg-card cursor-default'}"
			>
				<span class="text-ink text-sm font-bold">{b.title()}</span>
				<span class="text-muted mt-0.5 text-[11px] leading-snug">{b.sub()}</span>
				<div class="mt-2 flex flex-1 flex-wrap content-start gap-1.5">
					{#each inBin(b.id) as key (key)}
						<span class="bg-grass-soft text-grass rounded-full px-2 py-1 text-[11px] font-semibold">
							{tx.cases[key]}
						</span>
					{/each}
				</div>
			</button>
		{/each}
	</div>
</div>
