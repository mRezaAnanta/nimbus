<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CdnText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as CdnText);

	let cdnOn = $state(false);
	let busy = $state(false);
	let phase = $state<'idle' | 'flying'>('idle');
	let ms = $state<number | null>(null);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let timers: ReturnType<typeof setTimeout>[] = [];
	let seenCached = false;

	// far origin trip is slow; a nearby edge cache answers fast
	const FAR_MS = 320;
	const NEAR_MS = 18;
	const travelMs = $derived(cdnOn ? 700 : 1500);

	function send() {
		if (busy) return;
		busy = true;
		ms = null;
		phase = 'flying';
		browser = 'loading';
		timers.push(
			setTimeout(() => {
				phase = 'idle';
				browser = 'loaded';
				busy = false;
				if (cdnOn) {
					ms = NEAR_MS;
					onstate?.('cached');
					if (!seenCached) {
						seenCached = true;
						oncomplete?.();
					}
				} else {
					ms = FAR_MS;
					onstate?.('origin');
				}
			}, travelMs)
		);
	}

	function toggle() {
		if (busy) return;
		cdnOn = !cdnOn;
		ms = null;
		browser = 'idle';
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-6 pb-[8vh]">
	<div class="flex w-full max-w-2xl items-center justify-between gap-2">
		<!-- the user, far away -->
		<div class="flex shrink-0 flex-col items-center gap-2">
			<Browser phase={browser} />
			<span class="text-xs font-semibold text-muted">{tx.userLabel}</span>
		</div>

		<!-- the network path: edge sits near the user, origin sits far -->
		<div class="relative flex flex-1 flex-col items-center">
			<div class="relative h-0.5 w-full self-center bg-line">
				<!-- edge cache node near the user -->
				<div class="node edge" class:active={cdnOn}>
					<span class="node-dot"></span>
					<span class="node-label" style="color:{cdnOn ? '#3a9c64' : '#8a949d'}"
						>{tx.edgeLabel}</span
					>
				</div>
				<!-- the request packet -->
				{#if phase === 'flying' || ms !== null}
					<div
						class="packet"
						class:near={cdnOn}
						style="background:{cdnOn ? '#3a9c64' : '#2e6fe0'}"
					></div>
				{/if}
			</div>
			<span class="mt-3 text-[11px] text-faint">{cdnOn ? tx.nearNote : tx.farNote}</span>
		</div>

		<!-- origin server, far away -->
		<div class="flex shrink-0 flex-col items-center gap-2">
			<div class="origin"><span class="origin-dot"></span></div>
			<span class="text-xs font-semibold text-muted">{tx.originLabel}</span>
		</div>
	</div>

	<!-- latency readout -->
	<div
		class="flex w-full max-w-xs items-center justify-between rounded-2xl border border-line bg-card px-5 py-3"
	>
		<span class="text-xs font-semibold text-faint">{cdnOn ? tx.on : tx.off}</span>
		<span
			class="font-display text-2xl font-bold {ms === null
				? 'text-faint'
				: ms > 100
					? 'text-amber'
					: 'text-grass'}"
		>
			{ms === null ? '...' : `${ms} ${tx.ms}`}
		</span>
	</div>

	<div class="flex items-center gap-2">
		<button
			type="button"
			onclick={send}
			disabled={busy}
			class="rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-all enabled:hover:brightness-125 disabled:opacity-50"
		>
			{tx.send}
		</button>
		<button
			type="button"
			onclick={toggle}
			disabled={busy}
			class="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all enabled:hover:brightness-110 disabled:opacity-50 {cdnOn
				? 'bg-grass text-white'
				: 'border border-line text-ink'}"
		>
			{cdnOn ? tx.cdnOff : tx.cdnOn}
		</button>
	</div>
</div>

<style>
	.origin {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
		border-radius: 12px;
		border: 2px solid #2e6fe0;
		background: #eaf1fc;
	}
	.origin-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #2e6fe0;
	}
	.node {
		position: absolute;
		top: 50%;
		left: 16%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		opacity: 0.5;
		transition: opacity 0.3s ease;
	}
	.node.active {
		opacity: 1;
	}
	.node-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid #fff;
		background: #3a9c64;
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.2);
	}
	.node:not(.active) .node-dot {
		background: #cfd6dd;
	}
	.node-label {
		position: absolute;
		top: 14px;
		font-size: 9px;
		font-weight: 700;
		white-space: nowrap;
	}
	.packet {
		position: absolute;
		top: 50%;
		left: 0;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.25);
		animation: far-trip 1.5s ease forwards;
	}
	.packet.near {
		animation: near-trip 0.7s ease forwards;
	}
	@keyframes far-trip {
		0% {
			left: 0;
		}
		50% {
			left: 100%;
		}
		100% {
			left: 0;
		}
	}
	@keyframes near-trip {
		0% {
			left: 0;
		}
		50% {
			left: 16%;
		}
		100% {
			left: 0;
		}
	}
</style>
