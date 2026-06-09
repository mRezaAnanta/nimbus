<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { ScalingText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ScalingText);

	type Mode = 'idle' | 'vertical' | 'horizontal';
	let mode = $state<Mode>('idle');
	// vertical: one box grows in size up to a hard ceiling
	let boxSize = $state(1); // 1..4 (4 = maxed out)
	const VMAX = 4;
	// horizontal: add identical boxes side by side
	let boxes = $state(1);
	const tried = new SvelteSet<Mode>();
	let done = false;

	const atCeiling = $derived(mode === 'vertical' && boxSize >= VMAX);

	function tryVertical() {
		mode = 'vertical';
		boxes = 1;
		if (boxSize < VMAX) {
			boxSize += 1;
		}
		if (boxSize >= VMAX) {
			onstate?.('ceiling');
		} else {
			onstate?.('vertical');
		}
		register('vertical');
	}

	function tryHorizontal() {
		mode = 'horizontal';
		boxSize = 1;
		if (boxes < 5) boxes += 1;
		onstate?.('horizontal');
		register('horizontal');
	}

	function register(m: Mode) {
		tried.add(m);
		if (tried.has('vertical') && tried.has('horizontal') && !done) {
			done = true;
			oncomplete?.();
		}
	}

	function reset() {
		mode = 'idle';
		boxSize = 1;
		boxes = 1;
	}

	// CPU/RAM meter for the single vertical box
	const vCpu = $derived(Math.round((boxSize / VMAX) * 100));
</script>

<div class="flex h-full w-full flex-col gap-4">
	<!-- the workload keeps rising; pick how to handle it -->
	<div class="flex items-center justify-center gap-2">
		<span class="text-[11px] font-semibold tracking-wide text-faint uppercase"
			>{tx.workloadLabel}</span
		>
		<div class="h-1.5 w-32 overflow-hidden rounded-full bg-line">
			<div class="h-full w-3/4 rounded-full bg-amber"></div>
		</div>
	</div>

	<!-- two clearly labelled approaches side by side -->
	<div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
		<!-- vertical -->
		<div class="approach" class:active={mode === 'vertical'} style="--accent:#2e6fe0">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-bold text-ink">{tx.verticalLabel}</h3>
				<span class="text-[10px] text-faint">↑ {tx.cpuLabel}</span>
			</div>
			<div class="approach-stage">
				<div
					class="vbox"
					class:maxed={atCeiling}
					style="width:{34 + boxSize * 16}px; height:{34 + boxSize * 16}px"
				>
					<span class="text-[10px] font-bold" style="color:{atCeiling ? '#d3584a' : '#2e6fe0'}"
						>{vCpu}%</span
					>
				</div>
				{#if atCeiling}
					<div class="ceiling-line"></div>
					<span class="absolute top-1 right-2 text-[10px] font-bold text-danger">{tx.maxedOut}</span
					>
				{/if}
			</div>
			<p class="text-[11px] leading-snug text-muted">{tx.tradeoffVertical}</p>
		</div>

		<!-- horizontal -->
		<div class="approach" class:active={mode === 'horizontal'} style="--accent:#3a9c64">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-bold text-ink">{tx.horizontalLabel}</h3>
				<span class="text-[10px] text-faint">→ {tx.addNote}</span>
			</div>
			<div class="approach-stage flex-wrap gap-1.5">
				{#each Array(boxes), i (i)}
					<div class="hbox"><span class="hdot"></span></div>
				{/each}
			</div>
			<p class="text-[11px] leading-snug text-muted">{tx.tradeoffHorizontal}</p>
		</div>
	</div>

	<!-- controls -->
	<div class="flex flex-wrap items-center justify-center gap-2">
		<button
			type="button"
			onclick={tryVertical}
			class="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
		>
			{tx.verticalBtn}
		</button>
		<button
			type="button"
			onclick={tryHorizontal}
			class="rounded-full bg-grass px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
		>
			{tx.horizontalBtn}
		</button>
		<button
			type="button"
			onclick={reset}
			class="rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-all hover:brightness-110"
		>
			{tx.reset}
		</button>
	</div>
</div>

<style>
	.approach {
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 14px;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}
	.approach.active {
		border-color: var(--accent);
		box-shadow: 0 8px 22px color-mix(in srgb, var(--accent) 18%, transparent);
	}
	.approach-stage {
		position: relative;
		display: flex;
		flex: 1;
		min-height: 120px;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: #f7f6f2;
		padding: 12px;
	}
	.vbox {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		border: 2px solid #2e6fe0;
		background: #eaf1fc;
		transition:
			width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
			height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
			border-color 0.3s ease,
			background 0.3s ease;
	}
	.vbox.maxed {
		border-color: #d3584a;
		background: #fbe9e6;
	}
	.ceiling-line {
		position: absolute;
		top: 8px;
		left: 10px;
		right: 10px;
		height: 2px;
		background: #d3584a;
		opacity: 0.55;
	}
	.hbox {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 8px;
		border: 2px solid #3a9c64;
		background: #e7f3ec;
		animation: pop 0.3s ease;
	}
	.hdot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3a9c64;
	}
	@keyframes pop {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
