<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText, RequestJourneyText } from '$lib/chapters/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate,
		beat = 0,
		onshow
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as RequestJourneyText);

	const KEYS = ['phone', 'router', 'isp', 'net', 'server'] as const;

	// while Nim narrates, the stations being talked about light up along with her
	const FOCUS: string[][] = [
		['phone'],
		['phone', 'router'],
		['router', 'isp', 'net'],
		['server'],
		['phone', 'router', 'isp', 'net', 'server']
	];
	const lastBeat = $derived(beat >= tx.intro.length - 1);
	const focused = $derived(FOCUS[Math.min(beat, FOCUS.length - 1)]);
	// the stage narrates visually from the very first beat, so never dim it.
	// The page resets `shown` on every beat change, so re-ask each time.
	$effect(() => {
		void beat;
		onshow?.(true);
	});

	// seq counts steps: 0..4 is the request going out, 5..8 is the answer coming home
	let seq = $state(-1);
	let running = $state(false);
	let ranOnce = $state(false);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const returning = $derived(seq > 4);
	const pos = $derived(seq < 0 ? 0 : seq <= 4 ? seq : 8 - seq);
	const activeKey = $derived(seq < 0 ? null : KEYS[pos]);
	const note = $derived(
		seq < 0 ? (lastBeat ? tx.idleNote : ' ') : returning ? tx.notes.back : tx.notes[KEYS[pos]]
	);

	function run() {
		if (running) return;
		running = true;
		seq = 0;
		const STEP = 850;
		for (let i = 1; i <= 8; i++) {
			timers.push(
				setTimeout(() => {
					seq = i;
					if (i === 4) onstate?.('arrived');
					if (i === 8) {
						running = false;
						ranOnce = true;
						onstate?.('back');
						if (!done) {
							done = true;
							oncomplete?.();
						}
					}
				}, i * STEP)
			);
		}
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet icon(key: string)}
	{#if key === 'phone'}
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect
				x="7"
				y="2.5"
				width="10"
				height="19"
				rx="2.5"
				stroke="currentColor"
				stroke-width="1.8"
			/>
			<circle cx="12" cy="18" r="1.1" fill="currentColor" />
		</svg>
	{:else if key === 'router'}
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="3" y="13" width="18" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
			<circle cx="7.5" cy="16.5" r="1" fill="currentColor" />
			<circle cx="11.5" cy="16.5" r="1" fill="currentColor" />
			<path
				d="M17 13V7m0 0 2.5 2.5M17 7l-2.5 2.5"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if key === 'isp'}
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M12 21V9m0 0 -5 12m5-12 5 12M8 6.5a6 6 0 0 1 8 0M5.8 4a9.4 9.4 0 0 1 12.4 0"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if key === 'net'}
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
			<path
				d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18"
				stroke="currentColor"
				stroke-width="1.4"
			/>
		</svg>
	{:else}
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="4" y="4" width="16" height="6.5" rx="2" stroke="currentColor" stroke-width="1.8" />
			<rect
				x="4"
				y="13.5"
				width="16"
				height="6.5"
				rx="2"
				stroke="currentColor"
				stroke-width="1.8"
			/>
			<circle cx="8" cy="7.2" r="1" fill="currentColor" />
			<circle cx="8" cy="16.7" r="1" fill="currentColor" />
		</svg>
	{/if}
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-6">
	<!-- the road, five stations and one traveling packet -->
	<div class="road">
		<div class="rail"></div>
		<div
			class="rail glow"
			style="width:calc(86% * {pos / 4}); background:{returning ? '#3a9c64' : '#2e6fe0'}"
		></div>
		{#if seq >= 0}
			<div class="packet" class:res={returning} style="left:calc(7% + 86% * {pos / 4})">
				<span class="ptag">{returning ? tx.responseTag : tx.requestTag}</span>
				<span class="pdot"></span>
			</div>
		{/if}
		<div class="stations">
			{#each KEYS as k, i (k)}
				{@const on = activeKey === k || (seq < 0 && !lastBeat && focused.includes(k))}
				<div
					class="station"
					class:on
					style="--c:{on ? (returning ? '#3a9c64' : '#2e6fe0') : '#8a949d'}"
				>
					<div class="box" class:visited={seq >= 0 && (returning ? true : i <= pos)}>
						{@render icon(k)}
					</div>
					<span class="slabel">{tx.stations[k]}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- what is happening right now -->
	<p class="note" class:res={returning}>{note}</p>

	<CallToActionButton waiting={!lastBeat} onclick={run} disabled={running || !lastBeat}>
		{ranOnce ? tx.again : tx.openSite}
	</CallToActionButton>
</div>

<style>
	.road {
		position: relative;
		width: min(92vw, 380px);
		padding-top: 14px;
	}
	.rail {
		position: absolute;
		top: 36px;
		left: 7%;
		right: 7%;
		height: 3px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.rail.glow {
		right: auto;
		max-width: 86%;
		transition:
			width 0.8s linear,
			background 0.3s ease;
		opacity: 0.5;
	}
	.packet {
		position: absolute;
		top: 36px;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		pointer-events: none;
		z-index: 3;
		transition: left 0.8s linear;
	}
	.pdot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid #fff;
		background: #2e6fe0;
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.25);
	}
	.packet.res .pdot {
		background: #3a9c64;
	}
	.ptag {
		border-radius: 999px;
		background: #2e6fe0;
		color: #fff;
		font-size: 10px;
		font-weight: 700;
		padding: 2px 9px;
		white-space: nowrap;
		box-shadow: 0 4px 10px rgba(46, 111, 224, 0.3);
	}
	.packet.res .ptag {
		background: #3a9c64;
		box-shadow: 0 4px 10px rgba(58, 156, 100, 0.3);
	}
	.stations {
		position: relative;
		display: flex;
		justify-content: space-between;
		z-index: 2;
	}
	.station {
		display: flex;
		width: 14%;
		min-width: 52px;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 46px;
		height: 46px;
		border-radius: 14px;
		border: 2px solid #e8e2d8;
		background: #fff;
		color: var(--color-faint);
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.06);
		transition: all 0.3s ease;
	}
	.station.on .box {
		border-color: var(--c);
		color: var(--c);
		transform: scale(1.12);
		box-shadow: 0 8px 18px color-mix(in srgb, var(--c) 25%, transparent);
	}
	.slabel {
		font-size: 9px;
		font-weight: 600;
		color: var(--color-faint);
		text-align: center;
		line-height: 1.15;
		transition: color 0.3s ease;
	}
	.station.on .slabel {
		color: var(--color-ink);
		font-weight: 700;
	}
	.note {
		min-height: 1.5em;
		max-width: 320px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: #2e6fe0;
		transition: color 0.3s ease;
	}
	.note.res {
		color: #2f7d54;
	}
	@media (min-width: 768px) {
		.road {
			width: 560px;
		}
		.box {
			width: 60px;
			height: 60px;
		}
		.box :global(svg) {
			width: 27px;
			height: 27px;
		}
		.slabel {
			font-size: 11.5px;
		}
		.note {
			font-size: 14.5px;
			max-width: 460px;
		}
		.ptag {
			font-size: 11.5px;
			padding: 3px 11px;
		}
		.rail,
		.packet {
			top: 44px;
		}
	}
	:global(.dark) .pdot {
		border-color: #1b2533;
	}
	:global(.dark) .box {
		border-color: #2c3746;
		background: #1b2533;
	}
</style>
