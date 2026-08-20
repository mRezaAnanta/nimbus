<!--
	The journey from your own eyes, in 3D, narrated by Nim.

	It starts with the phone in your hand. The thumb comes down, and from that moment the
	camera FOLLOWS the request: a length behind it, to the router or the tower, down into
	the cable, along it, into the building at the far end, and up to the machine that
	answers. Then it flies home with the answer and the page lands on the screen in your
	hand.

	Two things this stage deliberately does NOT have.

	1. **No caption inside the picture.** It had one, and the lesson ended up with two
	   voices saying the same thing at the same time, Nim in her bubble and a line of text
	   over the canvas. Nim is the one who explains things in this course, so the picture
	   holds still and lets her.
	2. **No progress bar.** A bar that says how far along a 45 second animation is answers
	   a question nobody watching it was asking, and it sat across the bottom of every
	   shot.

	The pauses are what replaced them. The picture stops at the phone, at the first hop, in
	the cable, at the machine and back in the hand, and each stop is one of Nim's lines.
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import type { LessonText, RequestJourneyText } from '$lib/chapters/types';
	import {
		JOURNEY_SECONDS,
		LEG,
		frameAt,
		roadPosition,
		type JourneyScreen,
		type Mode
	} from '$lib/scene/legs';
	import type { JourneyWorld } from '$lib/scene/journey';
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

	let canvas = $state<HTMLCanvasElement | null>(null);
	let world = $state<JourneyWorld | null>(null);
	let failed = $state(false);

	let t = $state(0);
	let playing = $state(false);
	let played = $state(false);
	let mode = $state<Mode>('wifi');
	let picked = $state(false);
	let done = false;
	let raf = 0;
	let elapsed = 0;
	let spoken: string | null = null;

	const lastBeat = $derived(beat >= tx.intro.length - 1);
	const screen = $derived<JourneyScreen>({
		site: tx.screen.site,
		button: tx.screen.button,
		sending: tx.screen.sending,
		page: tx.screen.page
	});

	/* The stage narrates visually from the very first beat, so it is never dimmed. Nim
	   spends one beat on the tower, and the scene shows the tower while she talks about
	   it, until the reader picks a side themselves. */
	$effect(() => {
		onshow?.(true);
		if (!picked) mode = beat === 2 ? 'cell' : 'wifi';
	});

	// three.js is loaded only when this lesson is opened, not with the rest of the app.
	$effect(() => {
		if (!canvas) return;
		const el = canvas;
		let disposed = false;
		let instance: JourneyWorld | null = null;

		(async () => {
			try {
				const { JourneyWorld } = await import('$lib/scene/journey');
				if (disposed) return;
				instance = new JourneyWorld(el);
				world = instance;
			} catch (e) {
				console.error('[nimbus] the journey scene could not start', e);
				failed = true;
			}
		})();

		const ro = new ResizeObserver(() => instance?.resize());
		ro.observe(el);
		return () => {
			disposed = true;
			ro.disconnect();
			instance?.dispose();
			world = null;
		};
	});

	// Every change of position, of side, or of language goes straight through to the scene.
	$effect(() => {
		world?.applyState({ t, mode, screen });
	});

	/* It plays itself once the reader has arrived at the beat that invites it, and can be
	   played again from the button. Starting it earlier would run the whole journey while
	   Nim is still explaining what a router is. */
	$effect(() => {
		if (lastBeat && world && !playing && !played) play();
	});

	/** The stop at the first hop is a different place depending on how you are online. */
	function lineFor(token: string) {
		return token === 'atHop' ? (mode === 'cell' ? 'atHopCell' : 'atHopWifi') : token;
	}

	function play() {
		if (!browser) return;
		cancelAnimationFrame(raf);
		playing = true;
		elapsed = 0;
		spoken = null;
		let last = performance.now();

		const tick = () => {
			const now = performance.now();
			// Counted frame by frame rather than off the wall clock. Frames stop arriving
			// while the tab is in the background, and on a clock the journey would have run
			// itself to the end in a tab nobody was looking at.
			elapsed += Math.min(0.1, (now - last) / 1000);
			last = now;

			const frame = frameAt(elapsed);
			t = frame.t;
			// Each stop speaks once. Nim keeps the line on screen for the whole hold, which
			// is what makes the pause feel like an explanation rather than a stall.
			if (frame.token && frame.token !== spoken) {
				spoken = frame.token;
				onstate?.(lineFor(frame.token));
			}

			// Next unlocks the moment the answer is back in the hand, not when the last of
			// Nim's lines has finished. Holding the lesson shut for another four seconds
			// after the journey has visibly ended reads as a bug.
			if (t >= 1 && !done) {
				done = true;
				oncomplete?.();
			}
			if (elapsed >= JOURNEY_SECONDS) {
				t = 1;
				playing = false;
				played = true;
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	}

	function pick(m: Mode) {
		if (m === mode) return;
		mode = m;
		picked = true;
		// The two roads part at the very first hop, so switching halfway through would be a
		// request that left through the router and came back from the tower. It starts over.
		if (lastBeat) play();
	}

	// Guarded: this component is rendered on the server too, and there is no animation
	// frame to cancel there. Unguarded it took the whole page down with a 500.
	onDestroy(() => {
		if (browser) cancelAnimationFrame(raf);
	});

	/**
	 * The road as a list of stops, beside the picture.
	 *
	 * This is the diagram the lesson had before it was in 3D, and it is back because the
	 * 3D alone never says WHERE in the whole road a shot is taken. It sits down the left
	 * rather than across the middle, so it reads as a map next to the picture instead of
	 * competing with it.
	 */
	const stops = $derived([
		{ k: 'phone', label: tx.stations.phone },
		mode === 'cell'
			? { k: 'tower', label: tx.stations.tower }
			: { k: 'router', label: tx.stations.router },
		{ k: 'isp', label: tx.stations.isp },
		{ k: 'net', label: tx.stations.net },
		{ k: 'server', label: tx.stations.server }
	]);

	/**
	 * Which stop the request is at, counted off the same road position the scene uses.
	 *
	 * The bounds are inclusive on purpose. Every pause stops exactly ON a leg boundary, and
	 * with exclusive bounds each one lit the stop AFTER the one Nim was talking about, so
	 * the board said router while she was still explaining the phone.
	 */
	const at = $derived.by(() => {
		const w = roadPosition(t);
		if (w <= LEG.tap) return 0;
		if (w <= LEG.hop) return 1;
		if (w <= LEG.cable) return 2;
		// The sea crossing IS the global network, so it lights that stop rather than a
		// sixth one of its own.
		if (w < LEG.server) return 3;
		return 4;
	});
	const returning = $derived(t > LEG.answer);
</script>

{#snippet icon(key: string)}
	{#if key === 'phone'}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
	{:else if key === 'tower'}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M12 21V9m0 0 -5 12m5-12 5 12M9.4 16h5.2M8 6.5a6 6 0 0 1 8 0M5.8 4a9.4 9.4 0 0 1 12.4 0"
				stroke="currentColor"
				stroke-width="1.7"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if key === 'isp'}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect
				x="3.5"
				y="8.5"
				width="17"
				height="11"
				rx="2.5"
				stroke="currentColor"
				stroke-width="1.8"
			/>
			<path
				d="M8 12.5h8M8 16h5M12 8.5V4.5"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
			/>
		</svg>
	{:else if key === 'net'}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
			<path
				d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18"
				stroke="currentColor"
				stroke-width="1.4"
			/>
		</svg>
	{:else}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

<div class="stage">
	<!-- the road as a list, top to bottom, beside the picture -->
	<ol class="board" class:res={returning}>
		{#each stops as s, i (s.k)}
			{#if i > 0}
				<li class="link" class:radio={i === 1} class:on={at >= i} aria-hidden="true"></li>
			{/if}
			<li class="stop" class:on={at === i} class:past={at > i}>
				<span class="box">{@render icon(s.k)}</span>
				<span class="label">{s.label}</span>
			</li>
		{/each}
	</ol>

	<div class="frame">
		{#if failed}
			<!-- No WebGL, no scene. The lesson still has to teach, so the road is a list. -->
			<ol class="plain">
				<li>{tx.stations.phone}</li>
				<li>{mode === 'cell' ? tx.stations.tower : tx.stations.router}</li>
				<li>{tx.stations.isp}</li>
				<li>{tx.stations.net}</li>
				<li>{tx.stations.server}</li>
			</ol>
		{:else}
			<canvas bind:this={canvas}></canvas>
		{/if}

		<!-- how you are online, which is the only thing that changes the first hop -->
		<div class="modes">
			{#each [{ k: 'wifi', label: tx.modes.wifi }, { k: 'cell', label: tx.modes.cell }] as m (m.k)}
				<button
					type="button"
					class="mode"
					class:active={mode === m.k}
					onclick={() => pick(m.k as Mode)}
				>
					{m.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="act">
		<CallToActionButton waiting={!lastBeat} onclick={play} disabled={playing || !lastBeat}>
			{played ? tx.again : tx.watch}
		</CallToActionButton>
	</div>
</div>

<style>
	/* The picture, the board down its RIGHT, and the button under both. On the right
	   because Nim and her bubble live in the lower left of every lesson, so a board over
	   there spends half its height behind a cloud. */
	.stage {
		display: grid;
		height: 100%;
		width: min(94vw, 820px);
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 10px 14px;
	}
	.frame {
		grid-column: 1;
		grid-row: 1;
	}
	.board {
		grid-column: 2;
		grid-row: 1;
	}
	.act {
		grid-column: 1 / -1;
		justify-self: center;
	}

	.board {
		display: flex;
		width: 126px;
		/* As tall as the picture it stands beside: the links stretch to fill, so the road
		   spans the whole height rather than huddling in a corner of it. */
		height: 100%;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.stop {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.box {
		display: flex;
		width: 34px;
		height: 34px;
		flex: none;
		align-items: center;
		justify-content: center;
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-faint);
		transition: all 0.25s ease;
	}
	.label {
		font-size: 10.5px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--color-faint);
		transition: color 0.25s ease;
	}
	.stop.past .box {
		border-color: color-mix(in srgb, #2e6fe0 40%, var(--color-line));
		color: color-mix(in srgb, #2e6fe0 60%, var(--color-faint));
	}
	.stop.on .box {
		border-color: #2e6fe0;
		color: #2e6fe0;
		transform: scale(1.09);
		box-shadow: 0 6px 14px rgba(46, 111, 224, 0.22);
	}
	.stop.on .label {
		font-weight: 700;
		color: var(--color-ink);
	}
	/* On the way home the same board reads in green, which is the answer's colour. */
	.board.res .stop.on .box {
		border-color: #3a9c64;
		color: #3a9c64;
		box-shadow: 0 6px 14px rgba(58, 156, 100, 0.22);
	}
	.board.res .stop.past .box {
		border-color: color-mix(in srgb, #3a9c64 40%, var(--color-line));
		color: color-mix(in srgb, #3a9c64 60%, var(--color-faint));
	}

	/* The first link is amber because that hop is radio, every other one is cable. */
	.link {
		display: flex;
		width: 34px;
		flex: 1 1 auto;
		min-height: 12px;
		justify-content: center;
	}
	.link::before {
		content: '';
		width: 2px;
		height: 100%;
		border-radius: 1px;
		background: var(--color-line);
		transition: background 0.25s ease;
	}
	.link.on::before {
		background: #2e6fe0;
	}
	.link.radio::before {
		background: color-mix(in srgb, #dd9e36 40%, var(--color-line));
	}
	.link.radio.on::before {
		background: #dd9e36;
	}
	.board.res .link.on::before {
		background: #3a9c64;
	}
	.board.res .link.radio.on::before {
		background: #dd9e36;
	}
	.frame {
		position: relative;
		width: 100%;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		border-radius: 20px;
		border: 1px solid var(--color-line);
		background: linear-gradient(to bottom, #dbe6f0, #eef1f3);
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* Top right. The bottom left belongs to Nim and her bubble, and the middle belongs to
	   the picture, which now has nothing written over it at all. */
	.modes {
		position: absolute;
		top: 10px;
		right: 12px;
		display: flex;
		gap: 6px;
	}
	.mode {
		border-radius: 999px;
		border: 1px solid rgba(22, 40, 60, 0.12);
		background: rgba(255, 255, 255, 0.86);
		padding: 5px 13px;
		font-size: 11.5px;
		font-weight: 700;
		color: #5e6b76;
		backdrop-filter: blur(6px);
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}
	.mode.active {
		border-color: #2e6fe0;
		color: #2e6fe0;
	}

	.plain {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 13px;
		font-weight: 600;
		color: #16212b;
	}

	@media (min-width: 768px) {
		.mode {
			font-size: 12.5px;
		}
		.board {
			width: 148px;
		}
		.label {
			font-size: 11.5px;
		}
		.box {
			width: 40px;
			height: 40px;
			border-radius: 13px;
		}
		.link {
			width: 40px;
		}
	}
	/* On a phone there is no room for a column beside the picture, so the same road lies
	   across the top of it and drops its labels. */
	@media (max-width: 767px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto minmax(0, 1fr) auto;
		}
		.board {
			width: 100%;
			height: auto;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			grid-column: 1;
			grid-row: 1;
		}
		.frame {
			grid-column: 1;
			grid-row: 2;
		}
		.label {
			display: none;
		}
		.box {
			width: 30px;
			height: 30px;
			border-radius: 10px;
		}
		.link {
			width: auto;
			min-width: 14px;
			height: 30px;
			align-items: center;
		}
		.link::before {
			width: 100%;
			height: 2px;
		}
	}
	:global(.dark) .frame {
		background: linear-gradient(to bottom, #1b2533, #121a24);
		border-color: #2c3746;
	}
	:global(.dark) .mode {
		background: rgba(27, 37, 51, 0.86);
		border-color: #2c3746;
		color: #97a3ae;
	}
	:global(.dark) .mode.active {
		border-color: #2e6fe0;
		color: #8ab4f8;
	}
</style>
