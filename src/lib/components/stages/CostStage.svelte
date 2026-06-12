<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { CostText } from '$lib/chapters/compute/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as CostText);

	let offDone = $state(false);
	let resizeDone = $state(false);
	const fixed = new SvelteSet<string>();
	let done = false;
	const bill = new Tween(90, { duration: 700, easing: cubicOut });

	function turnOff() {
		if (offDone) return;
		offDone = true;
		bill.target = bill.target - 30;
		onstate?.('off');
		finish('off');
	}
	function resize() {
		if (resizeDone) return;
		resizeDone = true;
		bill.target = bill.target - 25;
		onstate?.('resize');
		finish('resize');
	}
	function finish(k: string) {
		fixed.add(k);
		if (fixed.size === 2 && !done) {
			done = true;
			oncomplete?.();
		}
	}
	const note = $derived(
		offDone && resizeDone ? tx.noteDone : resizeDone ? tx.noteResize : offDone ? tx.noteOff : tx.noteIdle
	);
	const saved = $derived(90 - Math.round(bill.current));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<!-- the bill, big and honest -->
	<div class="bill">
		<span class="blabel">{tx.billLabel}</span>
		<span class="bnum">${Math.round(bill.current)}<em>{tx.perMonth}</em></span>
		{#if saved > 0}
			{#key saved}<span class="saved">{tx.savedTag.replace('{n}', String(saved))}</span>{/key}
		{/if}
	</div>

	<!-- the three machines behind it -->
	<div class="rows">
		<div class="row" class:dead={offDone}>
			<div class="mini" style="--c:{offDone ? '#cfd6dd' : '#d3584a'}">
				{#if offDone}<span class="x">×</span>{:else}<span class="md"></span><span class="md"></span>{/if}
			</div>
			<div class="info">
				<b>{tx.idleName}</b>
				<span>{offDone ? tx.offTag : tx.idleSub}</span>
			</div>
			<span class="price" class:strike={offDone}>$30</span>
			{#if !offDone}
				<button type="button" class="fix" onclick={turnOff}>{tx.turnOff}</button>
			{:else}
				<span class="okx">✓</span>
			{/if}
		</div>
		<div class="row">
			<div class="mini big" class:shrunk={resizeDone} style="--c:{resizeDone ? '#3a9c64' : '#dd9e36'}">
				<span class="md"></span><span class="md"></span>
			</div>
			<div class="info">
				<b>{tx.bigName}</b>
				<span>{resizeDone ? tx.resizedTag : tx.bigSub}</span>
			</div>
			<span class="price">{resizeDone ? '$15' : '$40'}</span>
			{#if !resizeDone}
				<button type="button" class="fix" onclick={resize}>{tx.downsize}</button>
			{:else}
				<span class="okx">✓</span>
			{/if}
		</div>
		<div class="row">
			<div class="mini" style="--c:#3a9c64"><span class="md"></span><span class="md"></span></div>
			<div class="info">
				<b>{tx.rightName}</b>
				<span>{tx.rightSub}</span>
			</div>
			<span class="price">$20</span>
			<span class="okx">✓</span>
		</div>
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.bill {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 12px 30px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.07);
	}
	.blabel {
		font-size: 9.5px;
		font-weight: 800;
		color: #8a949d;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.bnum {
		font-size: 30px;
		font-weight: 800;
		color: #16212b;
		font-variant-numeric: tabular-nums;
		line-height: 1.05;
	}
	.bnum em {
		font-style: normal;
		font-size: 10px;
		font-weight: 600;
		color: #8a949d;
		margin-left: 4px;
	}
	.saved {
		position: absolute;
		top: -9px;
		right: -10px;
		border-radius: 999px;
		background: #3a9c64;
		color: #fff;
		font-size: 9.5px;
		font-weight: 800;
		padding: 3px 9px;
		animation: popin 0.3s ease;
		box-shadow: 0 4px 10px rgba(58, 156, 100, 0.3);
	}
	@keyframes popin {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.rows {
		display: flex;
		flex-direction: column;
		gap: 7px;
		width: min(94vw, 350px);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 14px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 9px 11px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.05);
		transition: opacity 0.3s ease;
	}
	.row.dead {
		opacity: 0.65;
	}
	.mini {
		display: flex;
		flex: none;
		width: 34px;
		height: 30px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		border-radius: 8px;
		border: 1.5px solid var(--c);
		background: color-mix(in srgb, var(--c) 9%, #fff);
		transition: all 0.4s ease;
	}
	.mini.big {
		width: 46px;
		height: 40px;
	}
	.mini.big.shrunk {
		width: 34px;
		height: 30px;
	}
	.md {
		width: 60%;
		height: 3px;
		border-radius: 2px;
		background: var(--c);
		opacity: 0.7;
	}
	.x {
		font-size: 15px;
		font-weight: 800;
		color: #b9c0c7;
		line-height: 1;
	}
	.info {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		line-height: 1.2;
	}
	.info b {
		font-size: 11px;
		font-weight: 800;
		color: #16212b;
	}
	.info span {
		font-size: 8.5px;
		color: #8a949d;
	}
	.price {
		font-size: 12px;
		font-weight: 800;
		color: #16212b;
		font-variant-numeric: tabular-nums;
	}
	.price.strike {
		text-decoration: line-through;
		color: #b9c0c7;
	}
	.fix {
		border-radius: 999px;
		background: #16212b;
		color: #fff;
		font-size: 10.5px;
		font-weight: 700;
		padding: 6px 12px;
		animation: pulse 1.8s ease-in-out infinite;
		transition: filter 0.2s ease;
	}
	.fix:hover {
		filter: brightness(1.18);
	}
	.okx {
		width: 18px;
		text-align: center;
		color: #3a9c64;
		font-size: 12px;
		font-weight: 800;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.16);
		}
	}
	.note {
		min-height: 1.3em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	@media (prefers-reduced-motion: reduce) {
		.fix,
		.saved {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.bill {
			padding: 14px 40px;
		}
		.bnum {
			font-size: 38px;
		}
		.bnum em {
			font-size: 12px;
		}
		.rows {
			width: 430px;
			gap: 9px;
		}
		.row {
			padding: 11px 14px;
		}
		.info b {
			font-size: 13.5px;
		}
		.info span {
			font-size: 10.5px;
		}
		.price {
			font-size: 14px;
		}
		.fix {
			font-size: 12px;
			padding: 7px 15px;
		}
		.note {
			font-size: 14px;
		}
	}
</style>
