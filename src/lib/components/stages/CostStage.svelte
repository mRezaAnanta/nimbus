<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { CostText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as CostText);

	// Each box: a size (1..4) drives both its cost and how much headroom it has.
	// `load` is the real demand. usage% = load / capacity, so an oversized box reads low.
	// Cost per size step, in dollars per month.
	const STEP_COST = 60;

	type Box = { key: 'idle' | 'big' | 'right'; label: string; sub: string; size: number; load: number; on: boolean; canOff: boolean };

	let boxes = $state<Box[]>([
		{ key: 'idle', label: '', sub: '', size: 3, load: 0, on: true, canOff: true }, // idle test server
		{ key: 'big', label: '', sub: '', size: 4, load: 1, on: true, canOff: false }, // oversized web server
		{ key: 'right', label: '', sub: '', size: 2, load: 1.6, on: true, canOff: false } // already right sized
	]);

	let wastefulFired = false;
	let done = false;

	const costOf = (b: Box) => (b.on ? b.size * STEP_COST : 0);
	const bill = $derived(boxes.reduce((s, b) => s + costOf(b), 0));
	const startBill = 3 * STEP_COST + 4 * STEP_COST + 2 * STEP_COST; // 540

	// usage = load / capacity, capped. A turned-off or zero-load box reads 0.
	const usagePct = (b: Box) => (!b.on || b.size === 0 ? 0 : Math.min(Math.round((b.load / b.size) * 100), 100));

	// Right sizing is reached when nothing idle is left running and nothing is oversized,
	// yet nothing is starved (no box under provisioned).
	function evaluate() {
		const idle = boxes.find((b) => b.key === 'idle')!;
		const anyStarved = boxes.some((b) => b.on && usagePct(b) > 92);
		const trimmedEnough = bill <= 240 && !idle.on; // turned idle off and shrank the big one
		if (trimmedEnough && !anyStarved && !done) {
			done = true;
			onstate?.('rightsized');
			oncomplete?.();
		}
	}

	function toggle(b: Box) {
		if (!b.canOff) return;
		b.on = !b.on;
		evaluate();
	}
	function downsize(b: Box) {
		if (b.size > 1) b.size -= 1;
		evaluate();
	}

	// Fire the "wasteful" hint once on first paint so the starting state is explained.
	$effect(() => {
		if (!wastefulFired) {
			wastefulFired = true;
			onstate?.('wasteful');
		}
	});

	const fillLabel = (b: Box) => {
		if (!b.on) return tx.idleSub;
		if (b.key === 'right') return tx.rightSub;
		return b.key === 'idle' ? tx.idleSub : tx.bigSub;
	};
	const localLabel = (b: Box) => (b.key === 'idle' ? tx.idleLabel : b.key === 'big' ? tx.bigLabel : tx.rightLabel);

	const usageTone = (b: Box) => {
		const u = usagePct(b);
		if (!b.on) return '#8a949d';
		if (u > 92) return '#d3584a';
		if (u < 45) return '#dd9e36';
		return '#3a9c64';
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4 md:flex-row md:items-stretch">
	<!-- Resources -->
	<div class="flex w-full max-w-md flex-col gap-3">
		{#each boxes as b (b.key)}
			<div class="border-line bg-card rounded-2xl border p-4 {b.on ? '' : 'opacity-55'}">
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<p class="text-ink text-sm font-bold">{localLabel(b)}</p>
						<p class="text-faint text-[11px]">{fillLabel(b)}</p>
					</div>
					<span class="text-muted shrink-0 text-sm font-bold tabular-nums">${costOf(b)}</span>
				</div>

				<!-- capacity vs usage -->
				<div class="mt-3 flex items-center gap-2">
					<div class="relative h-2.5 flex-1 overflow-hidden rounded-full bg-line">
						{#each [0, 1, 2, 3] as s (s)}
							<div
								class="absolute top-0 h-2.5 border-r border-white/70"
								style="left:{(s / 4) * 100}%; width:{(1 / 4) * 100}%; background:{s < b.size && b.on
									? '#cfd9e6'
									: 'transparent'};"
							></div>
						{/each}
						<div
							class="relative h-2.5 rounded-full transition-[width] duration-500 ease-out"
							style="width:{b.on ? (b.load / 4) * 100 : 0}%; background:{usageTone(b)};"
						></div>
					</div>
					<span class="text-[11px] font-semibold tabular-nums" style="color:{usageTone(b)};">
						{b.on ? tx.usageLabel.replace('{n}', String(usagePct(b))) : tx.idleSub}
					</span>
				</div>

				{#if b.on && usagePct(b) > 92}
					<p class="text-danger mt-2 text-[11px] font-semibold">{tx.tooSmall}</p>
				{/if}

				<!-- controls -->
				<div class="mt-3 flex gap-2">
					{#if b.canOff}
						<button
							type="button"
							onclick={() => toggle(b)}
							class="rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:bg-paper"
						>
							{tx.turnOff}
						</button>
					{/if}
					{#if b.on}
						<button
							type="button"
							onclick={() => downsize(b)}
							disabled={b.size <= 1}
							class="rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
						>
							{tx.downsize}
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<!-- Bill meter -->
	<div class="flex shrink-0 flex-col items-center justify-center md:w-[180px]">
		<div class="border-line bg-card flex w-[200px] flex-col items-center rounded-2xl border p-5 text-center md:w-full">
			<span class="text-faint text-[11px] font-semibold tracking-widest uppercase">{tx.billLabel}</span>
			<span
				class="font-display mt-2 text-4xl font-medium tabular-nums transition-colors {bill <= 240
					? 'text-grass'
					: bill < startBill
						? 'text-amber'
						: 'text-ink'}"
			>
				${bill}
			</span>
			<span class="text-muted mt-1 text-xs">{tx.perMonth}</span>
			<!-- meter -->
			<div class="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-line">
				<div
					class="h-2.5 rounded-full transition-[width] duration-500 ease-out"
					style="width:{(bill / startBill) * 100}%; background:{bill <= 240 ? '#3a9c64' : bill < startBill ? '#dd9e36' : '#d3584a'};"
				></div>
			</div>
			<p class="text-faint mt-4 text-[11px] leading-snug">{tx.hint}</p>
		</div>
	</div>
</div>
