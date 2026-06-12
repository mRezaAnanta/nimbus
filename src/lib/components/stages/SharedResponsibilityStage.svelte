<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { SharedResponsibilityText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as SharedResponsibilityText);

	type Bucket = 'provider' | 'you';
	// each item belongs to exactly one side
	const ANSWER: Record<string, Bucket> = {
		datacenter: 'provider',
		hardware: 'provider',
		hypervisor: 'provider',
		network: 'provider',
		iam: 'you',
		passwords: 'you',
		appPatch: 'you',
		dataConfig: 'you'
	};
	// interleaved so the answer is not an obvious top/bottom split
	const ORDER = [
		'datacenter',
		'iam',
		'hypervisor',
		'passwords',
		'network',
		'appPatch',
		'hardware',
		'dataConfig'
	];

	let placed = $state<Record<string, Bucket | null>>({
		datacenter: null,
		hardware: null,
		hypervisor: null,
		network: null,
		iam: null,
		passwords: null,
		appPatch: null,
		dataConfig: null
	});
	let selected = $state<string | null>(null);
	let wrongBucket = $state<Bucket | null>(null);
	let wrongKey = $state<string | null>(null);
	let fired = false;

	const tray = $derived(ORDER.filter((k) => placed[k] === null));
	const allDone = $derived(ORDER.every((k) => placed[k] === ANSWER[k]));

	const buckets: { id: Bucket; title: () => string; sub: () => string }[] = [
		{ id: 'provider', title: () => tx.providerLabel, sub: () => tx.providerSub },
		{ id: 'you', title: () => tx.youLabel, sub: () => tx.youSub }
	];

	function pick(key: string) {
		selected = selected === key ? null : key;
		wrongBucket = null;
		wrongKey = null;
	}

	function drop(bucket: Bucket) {
		if (!selected) return;
		const key = selected;
		if (ANSWER[key] === bucket) {
			placed[key] = bucket;
			selected = null;
			wrongBucket = null;
			wrongKey = null;
			onstate?.('correct');
			if (allDone && !fired) {
				fired = true;
				oncomplete?.();
			}
		} else {
			wrongBucket = bucket;
			wrongKey = key;
			onstate?.('wrong');
		}
	}

	function inBucket(bucket: Bucket) {
		return ORDER.filter((k) => placed[k] === bucket);
	}
</script>

<div class="mx-auto flex h-full w-full max-w-2xl flex-col gap-4">
	<!-- tray of items -->
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
					{tx.items[key]}
				</button>
			{/each}
		{/if}
	</div>

	<p class="text-faint text-center text-[11px]">{tx.prompt}</p>

	<!-- two buckets -->
	<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
		{#each buckets as b (b.id)}
			<button
				type="button"
				onclick={() => drop(b.id)}
				disabled={!selected}
				class="flex flex-col rounded-2xl border-2 p-3 text-left transition-all {wrongBucket === b.id
					? 'border-danger bg-danger-soft'
					: selected
						? 'border-brand bg-brand-soft cursor-pointer'
						: 'border-line bg-card cursor-default'}"
			>
				<div class="flex items-center gap-2">
					<span
						class="grid h-7 w-7 place-items-center rounded-full {b.id === 'provider'
							? 'bg-brand-soft text-brand'
							: 'bg-grass-soft text-grass'}"
					>
						{#if b.id === 'provider'}
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M6 19h12a3 3 0 0 0 .4-5.97A5 5 0 0 0 9 9.2 4 4 0 0 0 6 19Z" fill="currentColor" />
							</svg>
						{:else}
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle cx="12" cy="8" r="4" fill="currentColor" />
								<path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
							</svg>
						{/if}
					</span>
					<div>
						<span class="text-ink block text-sm font-bold">{b.title()}</span>
						<span class="text-muted block text-[11px] leading-snug">{b.sub()}</span>
					</div>
				</div>
				<div class="mt-2 flex flex-1 flex-wrap content-start gap-1.5">
					{#each inBucket(b.id) as key (key)}
						<span class="bg-grass-soft text-grass rounded-full px-2 py-1 text-[11px] font-semibold">
							{tx.items[key]}
						</span>
					{/each}
				</div>
			</button>
		{/each}
	</div>
</div>
