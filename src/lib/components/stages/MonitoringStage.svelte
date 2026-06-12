<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { MonitoringText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as MonitoringText);

	// Live metrics. CPU tracks traffic (more visitors, more work), errors stay low until CPU is high.
	let cpu = $state(34);
	let traffic = $state(40);
	let errors = $state(2);
	let phase = 0; // drives a slow climb so CPU is guaranteed to cross a reasonable threshold

	// The alarm the learner configures.
	let threshold = $state(80);
	let armed = $state(false);
	let firing = $state(false);
	let dragging = $state(false);
	let fired = false;
	let armedFired = false;

	let timer: ReturnType<typeof setInterval> | undefined;

	const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

	function tick() {
		phase += 0.06;
		// Traffic drifts up and down on a slow wave, with a rising bias so a spike always arrives.
		const wave = Math.sin(phase) * 22 + Math.sin(phase * 2.3) * 9;
		const rise = Math.min(phase * 7, 46);
		traffic = clamp(38 + rise + wave + (Math.random() * 6 - 3), 8, 99);
		// CPU follows traffic closely, with a little noise.
		cpu = clamp(traffic * 0.92 + 6 + (Math.random() * 6 - 3), 5, 99);
		// Errors only climb once CPU is genuinely struggling.
		errors = cpu > 85 ? clamp(errors + 1.4, 2, 40) : clamp(errors * 0.85, 0, 40);

		if (armed && cpu >= threshold) {
			if (!firing) firing = true;
			if (!fired) {
				fired = true;
				onstate?.('alarm-fired');
				oncomplete?.();
			}
		} else if (armed && cpu < threshold - 4) {
			firing = false;
		}
	}

	timer = setInterval(tick, 700);
	onDestroy(() => clearInterval(timer));

	function setAlarm() {
		armed = true;
		if (!armedFired) {
			armedFired = true;
			onstate?.('alarm-set');
		}
	}

	// Slider geometry for dragging the threshold along the CPU gauge.
	let trackEl = $state<HTMLDivElement>();

	function posToThreshold(clientX: number) {
		if (!trackEl) return;
		const r = trackEl.getBoundingClientRect();
		const pct = clamp(((clientX - r.left) / r.width) * 100, 40, 95);
		threshold = Math.round(pct);
	}
	function onDown(e: PointerEvent) {
		dragging = true;
		(e.target as HTMLElement).setPointerCapture?.(e.pointerId);
		posToThreshold(e.clientX);
	}
	function onMove(e: PointerEvent) {
		if (dragging) posToThreshold(e.clientX);
	}
	function onUp() {
		dragging = false;
	}

	type Metric = { key: string; label: string; value: number; unit: string; tone: 'cpu' | 'plain' };
	const metrics = $derived<Metric[]>([
		{ key: 'cpu', label: tx.cpuLabel, value: cpu, unit: '%', tone: 'cpu' },
		{ key: 'traffic', label: tx.trafficLabel, value: traffic, unit: '%', tone: 'plain' },
		{ key: 'errors', label: tx.errorsLabel, value: errors, unit: '/min', tone: 'plain' }
	]);

	const barColor = (m: Metric) => {
		if (m.tone === 'cpu' && armed && m.value >= threshold) return '#d3584a';
		if (m.value >= 85) return '#dd9e36';
		return m.key === 'errors' ? '#5e6b76' : '#2e6fe0';
	};
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- Dashboard panel -->
	<div class="border-line bg-card w-full max-w-md rounded-2xl border p-5 shadow-sm">
		<div class="mb-3 flex items-center justify-between">
			<span class="text-faint text-[11px] font-semibold tracking-widest uppercase">dashboard</span>
			<span
				class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold {firing
					? 'bg-danger-soft text-danger'
					: 'bg-grass-soft text-grass'}"
			>
				{firing ? tx.alarmFiring : armed ? tx.allCalm : tx.siteUp}
			</span>
		</div>

		<div class="flex flex-col gap-4">
			{#each metrics as m (m.key)}
				<div>
					<div class="mb-1 flex items-baseline justify-between">
						<span class="text-muted text-xs font-semibold">{m.label}</span>
						<span class="text-ink text-sm font-bold tabular-nums">{Math.round(m.value)}{m.unit}</span>
					</div>
					{#if m.key === 'cpu'}
						<!-- CPU gauge doubles as the alarm slider track -->
						<div
							bind:this={trackEl}
							class="relative h-3 w-full cursor-pointer rounded-full bg-line"
							style="touch-action:none;"
							role="slider"
							tabindex="0"
							aria-label={tx.cpuLabel}
							aria-valuenow={threshold}
							aria-valuemin={40}
							aria-valuemax={95}
							onpointerdown={onDown}
							onpointermove={onMove}
							onpointerup={onUp}
							onkeydown={(e) => {
								if (e.key === 'ArrowLeft') threshold = clamp(threshold - 1, 40, 95);
								if (e.key === 'ArrowRight') threshold = clamp(threshold + 1, 40, 95);
							}}
						>
							<div
								class="h-3 rounded-full transition-[width] duration-500 ease-out"
								style="width:{m.value}%; background:{barColor(m)};"
							></div>
							<!-- threshold marker -->
							<div
								class="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
								style="left:{threshold}%;"
							>
								<div
									class="h-6 w-1 rounded-full {armed ? 'bg-danger' : 'bg-ink'} {dragging
										? 'scale-y-125'
										: ''} transition-transform"
								></div>
							</div>
						</div>
					{:else}
						<div class="h-3 w-full overflow-hidden rounded-full bg-line">
							<div
								class="h-3 rounded-full transition-[width] duration-500 ease-out"
								style="width:{m.key === 'errors' ? Math.min(m.value * 2.5, 100) : m.value}%; background:{barColor(m)};"
							></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Alarm controls -->
	<div class="flex w-full max-w-md items-center justify-between gap-3">
		<div class="min-w-0">
			<p class="text-muted text-xs font-semibold">
				{armed ? tx.alarmArmed.replace('{n}', String(threshold)) : tx.thresholdLabel.replace('{n}', String(threshold))}
			</p>
			{#if !armed}<p class="text-faint mt-0.5 text-[11px]">{tx.hint}</p>{/if}
		</div>
		<button
			type="button"
			onclick={setAlarm}
			disabled={armed}
			class="bg-ink shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
		>
			{tx.setAlarm}
		</button>
	</div>
</div>
