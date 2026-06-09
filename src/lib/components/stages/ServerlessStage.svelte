<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ServerlessText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate,
		beat
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
	} = $props();
	const tx = $derived(text as ServerlessText);

	// Only run once the learner reaches the interactive beat (the stage un-dims there).
	const LAST_BEAT = 3;
	const active = $derived((beat ?? 0) >= LAST_BEAT);

	// Left: an always on server. Its idle cost keeps ticking even with no traffic.
	// Right: serverless. Cost moves only on an actual call, then returns to zero.
	let alwaysCost = $state(0);
	let fnCost = $state(0);
	let running = $state(false);
	let invocations = $state(0);
	let warnedIdle = false;
	let fired = false;

	let busy = $state(false);
	const timers: ReturnType<typeof setTimeout>[] = [];

	// The always on server bills continuously, traffic or not (only once interactive).
	const tick = setInterval(() => {
		if (!active) return;
		alwaysCost += 1;
		if (!warnedIdle && alwaysCost >= 4) {
			warnedIdle = true;
			onstate?.('idle');
		}
	}, 700);

	function invoke() {
		if (busy || !active) return;
		busy = true;
		running = true;
		// the function spins up, does its work (one unit of cost), then drops to zero
		timers.push(
			setTimeout(() => {
				fnCost += 1;
				invocations += 1;
				running = false;
				busy = false;
				onstate?.('invoke');
				if (invocations >= 3 && !fired) {
					fired = true;
					oncomplete?.();
				}
			}, 750)
		);
	}

	onDestroy(() => {
		clearInterval(tick);
		timers.forEach(clearTimeout);
	});
</script>

<div class="flex h-full w-full items-start justify-center">
	<div class="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
		<!-- always on server -->
		<div class="border-amber/40 bg-amber-soft/30 rounded-2xl border p-4">
			<p class="text-ink text-sm font-semibold">{tx.alwaysOnTitle}</p>
			<p class="text-faint mb-3 text-[11px]">{tx.alwaysOnSub}</p>

			<div class="mb-3 flex items-center justify-center py-2">
				<div class="srv on">
					<span class="dot live"></span>
					<span class="dot live"></span>
					<span class="dot live"></span>
				</div>
			</div>

			<div class="bg-amber-soft text-amber mb-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold">
				{tx.idleLabel}
			</div>
			<div class="flex items-baseline justify-between">
				<span class="text-faint text-[11px] font-semibold">{tx.costLabel}</span>
				<span class="text-amber font-display text-2xl font-medium tabular-nums">${alwaysCost}</span>
			</div>
			<p class="text-faint mt-1 text-[10px]">{tx.tickHint}</p>
		</div>

		<!-- serverless -->
		<div class="border-brand/40 bg-brand-soft/40 rounded-2xl border p-4">
			<p class="text-ink text-sm font-semibold">{tx.serverlessTitle}</p>
			<p class="text-faint mb-3 text-[11px]">{tx.serverlessSub}</p>

			<div class="mb-3 flex items-center justify-center py-2">
				<div class="fn" class:awake={running}>
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
							fill={running ? '#2e6fe0' : 'none'}
							stroke={running ? '#2e6fe0' : '#a9b4bf'}
							stroke-width="1.6"
							stroke-linejoin="round"
						/>
					</svg>
					<span class="text-faint mt-1 text-[10px] font-semibold">{tx.functionLabel}</span>
				</div>
			</div>

			<div
				class="mb-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold {running
					? 'bg-brand-soft text-brand'
					: 'bg-grass-soft text-grass'}"
			>
				{running ? tx.runningLabel : tx.zeroLabel}
			</div>
			<div class="flex items-baseline justify-between">
				<span class="text-faint text-[11px] font-semibold">{tx.costLabel}</span>
				<span class="text-brand font-display text-2xl font-medium tabular-nums">${fnCost}</span>
			</div>
			<p class="text-faint mt-1 text-[10px]">{tx.invokeHint}</p>

			<button
				type="button"
				onclick={invoke}
				disabled={busy}
				class="bg-ink mt-3 w-full rounded-full px-4 py-2 text-xs font-semibold text-white transition-all enabled:hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{tx.sendRequest}
			</button>
		</div>
	</div>
</div>

<style>
	.srv {
		display: flex;
		width: 64px;
		flex-direction: column;
		gap: 6px;
		border-radius: 10px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 9px;
	}
	.dot {
		height: 7px;
		border-radius: 3px;
		background: #ece6dc;
	}
	.dot.live {
		background: #dd9e36;
		animation: blink 1.4s ease-in-out infinite;
	}
	.dot.live:nth-child(2) {
		animation-delay: 0.25s;
	}
	.dot.live:nth-child(3) {
		animation-delay: 0.5s;
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
	.fn {
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0.6;
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}
	.fn.awake {
		opacity: 1;
		transform: scale(1.12);
	}
</style>
