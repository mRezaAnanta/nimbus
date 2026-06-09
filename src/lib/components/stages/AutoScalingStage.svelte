<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { AutoScalingText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as AutoScalingText);

	// A simple 24 hour demand curve: quiet at night, busy at midday.
	// Index 0..23 maps to a fraction 0..1 of peak demand.
	const CURVE = [
		0.1, 0.08, 0.06, 0.05, 0.06, 0.1, 0.2, 0.38, 0.58, 0.72, 0.85, 0.94, 1.0, 0.96, 0.88, 0.78,
		0.66, 0.6, 0.55, 0.48, 0.4, 0.3, 0.2, 0.14
	];
	const MIN_SERVERS = 2;
	const MAX_SERVERS = 6;

	let hour = $state(0);
	let playing = $state(false);
	let ran = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;
	let peak = false;
	let trough = false;
	let done = false;

	// servers follow the curve automatically between MIN and MAX
	const demand = $derived(CURVE[hour]);
	const servers = $derived(MIN_SERVERS + Math.round(demand * (MAX_SERVERS - MIN_SERVERS)));
	// cost tracks the running servers
	const cost = $derived(servers);
	const isNight = $derived(hour < 6 || hour >= 22);
	const hourLabel = $derived(`${String(hour).padStart(2, '0')}:00`);

	const W = 320;
	const H = 96;
	const points = $derived(CURVE.map((v, i) => `${(i / 23) * W},${H - 8 - v * (H - 18)}`).join(' '));
	const cursorX = $derived((hour / 23) * W);
	const cursorY = $derived(H - 8 - demand * (H - 18));

	function play() {
		if (playing) return;
		playing = true;
		hour = 0;
		peak = false;
		trough = false;
		timer = setInterval(() => {
			hour = (hour + 1) % 24;
			if (!peak && servers >= MAX_SERVERS) {
				peak = true;
				onstate?.('scaled-up');
			}
			if (peak && !trough && hour >= 22) {
				trough = true;
				onstate?.('scaled-down');
			}
			if (hour === 23) {
				// a full cycle completed
				clearInterval(timer);
				playing = false;
				ran = true;
				if (peak && !done) {
					done = true;
					oncomplete?.();
				}
			}
		}, 230);
	}

	onDestroy(() => clearInterval(timer));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-5 pb-[10vh]">
	<!-- 24h traffic curve with a moving cursor -->
	<div class="w-full max-w-md rounded-2xl border border-line bg-card p-4">
		<div class="mb-2 flex items-center justify-between text-[11px] font-semibold text-faint">
			<span>{tx.trafficLabel}</span>
			<span class="font-mono {isNight ? 'text-brand' : 'text-amber'}">
				{hourLabel} ({isNight ? tx.night : tx.midday})
			</span>
		</div>
		<svg viewBox="0 0 {W} {H}" class="h-24 w-full" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<linearGradient id="asfill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#2e6fe0" stop-opacity="0.16" />
					<stop offset="100%" stop-color="#2e6fe0" stop-opacity="0" />
				</linearGradient>
			</defs>
			<polygon points="0,{H} {points} {W},{H}" fill="url(#asfill)" />
			<polyline {points} fill="none" stroke="#2e6fe0" stroke-width="2" />
			<line
				x1={cursorX}
				y1="0"
				x2={cursorX}
				y2={H}
				stroke="#dd9e36"
				stroke-width="1.5"
				opacity="0.6"
			/>
			<circle cx={cursorX} cy={cursorY} r="4" fill="#dd9e36" stroke="#fff" stroke-width="1.5" />
		</svg>
	</div>

	<!-- servers follow the curve; cost tracks alongside -->
	<div class="flex w-full max-w-md items-stretch gap-3">
		<div class="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-line bg-card p-3">
			<span class="text-[10px] font-semibold tracking-wide text-faint uppercase"
				>{tx.serversLabel.replace('{n}', String(servers))}</span
			>
			<div class="flex min-h-[34px] flex-wrap items-center justify-center gap-1.5">
				{#each Array(servers), i (i)}
					<div class="srv"><span class="srv-dot"></span></div>
				{/each}
			</div>
		</div>
		<div
			class="flex w-24 flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-card p-3"
		>
			<span class="text-[10px] font-semibold tracking-wide text-faint uppercase"
				>{tx.costLabel}</span
			>
			<div class="flex items-end gap-0.5">
				{#each Array(cost), i (i)}
					<span class="cost-bar" style="height:{8 + i * 2}px"></span>
				{/each}
			</div>
			<span class="text-sm font-bold text-grass">${cost}</span>
		</div>
	</div>

	<button
		type="button"
		onclick={play}
		disabled={playing}
		class="rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-all enabled:hover:brightness-125 disabled:opacity-50"
	>
		{playing ? tx.running : ran ? tx.again : tx.play}
	</button>
	<p class="h-4 max-w-md text-center text-xs text-muted">{tx.payNote}</p>
</div>

<style>
	.srv {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 24px;
		border-radius: 7px;
		border: 2px solid #3a9c64;
		background: #e7f3ec;
		animation: pop 0.25s ease;
	}
	.srv-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #3a9c64;
	}
	.cost-bar {
		width: 4px;
		border-radius: 2px;
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
