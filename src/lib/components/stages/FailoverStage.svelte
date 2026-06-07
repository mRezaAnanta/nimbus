<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import type { LessonText, FailoverText } from '$lib/chapters/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as FailoverText);

	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const fx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const fy = (lat: number) => ((84 - lat) / 140) * FLAT_H;

	const PRIMARY = { key: 'virginia', lon: -77.5, lat: 39 };
	const STANDBY = { key: 'singapore', lon: 103.8, lat: 1.35 };
	const pAt = { x: fx(PRIMARY.lon), y: fy(PRIMARY.lat) };
	const sAt = { x: fx(STANDBY.lon), y: fy(STANDBY.lat) };
	const droneTo = { x: (pAt.x / FLAT_W) * 100, y: (pAt.y / FLAT_H) * 100 };

	type Phase = 'normal' | 'down' | 'failing' | 'failed-over';
	let standby = $state(false);
	let phase = $state<Phase>('normal');
	let striking = $state(false);
	let strikeKey = $state(0);
	let fired = false;
	let t1: ReturnType<typeof setTimeout> | undefined;
	let t2: ReturnType<typeof setTimeout> | undefined;
	let tR: ReturnType<typeof setTimeout> | undefined;

	const primaryDown = $derived(phase !== 'normal');
	const browser = $derived<'loaded' | 'loading' | 'offline'>(
		phase === 'failing' ? 'loading' : phase === 'down' ? 'offline' : 'loaded'
	);

	function toggleStandby() {
		if (phase !== 'normal' || striking) return;
		standby = !standby;
	}
	function kill() {
		if (phase !== 'normal' || striking) return;
		strikeKey += 1;
		striking = true;
		t1 = setTimeout(() => {
			if (standby) {
				phase = 'failing';
				t2 = setTimeout(() => {
					phase = 'failed-over';
					onstate?.('failover');
					if (!fired) {
						fired = true;
						oncomplete?.();
					}
				}, 1200);
			} else {
				phase = 'down';
				onstate?.('spof');
			}
		}, 1000);
		tR = setTimeout(() => {
			phase = 'normal';
			striking = false;
		}, standby ? 4800 : 3200);
	}

	const standbyStatus = $derived(
		!standby
			? `+ ${tx.standbyLabel}`
			: phase === 'failed-over'
				? `${tx.standbyLabel}, ${tx.serving}`
				: phase === 'failing'
					? tx.failingOver
					: `${tx.standbyLabel}, ${tx.standbyState}`
	);
	const standbyColor = $derived(
		!standby ? '#a9c8e8' : phase === 'failed-over' ? '#2f9e44' : phase === 'failing' ? '#dd9e36' : '#8a949d'
	);

	onDestroy(() => {
		clearTimeout(t1);
		clearTimeout(t2);
		clearTimeout(tR);
	});
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<div class="border-line relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border" style="background:#f1f6fc;">
		<svg viewBox="0 0 {FLAT_W} {FLAT_H}" class="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="map">
			<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
			<WorldMap />

			<!-- standby region -->
			<g
				class="pin"
				role="button"
				tabindex="0"
				aria-label={tx.regions[STANDBY.key]}
				onclick={toggleStandby}
				onkeydown={(e) => e.key === 'Enter' && toggleStandby()}
			>
				<circle cx={sAt.x} cy={sAt.y} r="6.5" fill={standbyColor} stroke="#fff" stroke-width="2" opacity={standby ? 1 : 0.7} />
				<text x={sAt.x} y={sAt.y - 12} text-anchor="middle" fill="#16212b" font-size="12.5" font-weight="700">{tx.regions[STANDBY.key]}</text>
				<text x={sAt.x} y={sAt.y + 18} text-anchor="middle" fill="#5e6b76" font-size="10.5" font-weight="600">{standbyStatus}</text>
			</g>

			<!-- primary region -->
			<g>
				{#if !primaryDown}
					<circle cx={pAt.x} cy={pAt.y} r="13" fill="#2f9e44" opacity="0.18" class="pulse" />
				{/if}
				<circle cx={pAt.x} cy={pAt.y} r="6.5" fill={primaryDown ? '#e03131' : '#2f9e44'} stroke="#fff" stroke-width="2" />
				<text x={pAt.x} y={pAt.y - 12} text-anchor="middle" fill="#16212b" font-size="12.5" font-weight="700">{tx.regions[PRIMARY.key]}</text>
				<text x={pAt.x} y={pAt.y + 18} text-anchor="middle" fill="#5e6b76" font-size="10.5" font-weight="600">
					{tx.primaryLabel}, {primaryDown ? tx.statusDown : tx.serving}
				</text>
			</g>
		</svg>

		<!-- drone strike toward the primary region -->
		{#key strikeKey}
			{#if striking}
				<div class="drone text-danger pointer-events-none absolute" style="--tx:{droneTo.x}%; --ty:{droneTo.y}%" aria-hidden="true">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12 L21 5 L14 12 L21 19 Z" /></svg>
				</div>
			{/if}
		{/key}

		<!-- controls -->
		<div class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
			<p class="text-faint text-[11px]">{tx.addHint}</p>
			<button
				type="button"
				onclick={kill}
				disabled={phase !== 'normal' || striking}
				class="pointer-events-auto shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{tx.kill}
			</button>
		</div>
	</div>

	<!-- Phone + readout -->
	<div class="flex shrink-0 flex-row items-center justify-center gap-4 md:w-[200px] md:flex-col md:justify-center">
		<Browser phase={browser} />
		<div class="border-line bg-card w-[150px] rounded-2xl border p-4 text-center md:w-full">
			<p class="text-lg font-bold {phase === 'down' ? 'text-danger' : phase === 'failing' ? 'text-amber' : 'text-grass'}">
				{phase === 'down' ? tx.statusDown : phase === 'failing' ? tx.failingOver : tx.statusUp}
			</p>
		</div>
	</div>
</div>

<style>
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:focus,
	.pin:focus-visible {
		outline: none;
	}
	.pin:hover circle[stroke] {
		stroke-width: 3;
	}
	.pulse {
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.18;
		}
		50% {
			transform: scale(1.8);
			opacity: 0.04;
		}
	}
	.drone {
		left: -10%;
		top: -8%;
		animation: strike 1s ease-in forwards;
	}
	@keyframes strike {
		0% {
			left: -10%;
			top: -8%;
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		100% {
			left: var(--tx);
			top: var(--ty);
			opacity: 1;
		}
	}
</style>
