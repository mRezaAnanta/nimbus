<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import type { LessonText, FailoverText } from '$lib/chapters/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as FailoverText);

	type Phase = 'normal' | 'down' | 'failing' | 'failed-over';
	let standby = $state(false);
	let phase = $state<Phase>('normal');
	let fired = false;
	let t1: ReturnType<typeof setTimeout> | undefined;
	let t2: ReturnType<typeof setTimeout> | undefined;

	const primaryDown = $derived(phase !== 'normal');
	const browser = $derived<'loaded' | 'loading' | 'offline'>(
		phase === 'failing' ? 'loading' : phase === 'down' ? 'offline' : 'loaded'
	);

	function toggleStandby() {
		if (phase !== 'normal') return;
		standby = !standby;
	}

	function kill() {
		if (phase !== 'normal') return;
		if (standby) {
			phase = 'failing';
			t1 = setTimeout(() => {
				phase = 'failed-over';
				onstate?.('failover');
				if (!fired) {
					fired = true;
					oncomplete?.();
				}
			}, 1300);
			t2 = setTimeout(() => (phase = 'normal'), 4200);
		} else {
			phase = 'down';
			onstate?.('spof');
			t2 = setTimeout(() => (phase = 'normal'), 2800);
		}
	}

	onDestroy(() => {
		clearTimeout(t1);
		clearTimeout(t2);
	});
</script>

{#snippet serverIcon()}
	<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
		<rect x="3.5" y="5" width="17" height="6" rx="1.6" />
		<rect x="3.5" y="13" width="17" height="6" rx="1.6" />
		<circle cx="7" cy="8" r="1" fill="currentColor" stroke="none" />
		<circle cx="7" cy="16" r="1" fill="currentColor" stroke="none" />
	</svg>
{/snippet}

{#snippet stormIcon()}
	<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path d="M13 2 L4 14 h7 l-2 8 11-13 h-7 z" fill="currentColor" />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<!-- Primary and standby -->
	<div class="border-line bg-card flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border p-4">
		<div class="grid flex-1 grid-cols-2 gap-3">
			<!-- primary -->
			<div
				class="flex flex-col items-center justify-center gap-2 rounded-xl border border-line p-3 text-center transition-all {primaryDown
					? 'bg-danger-soft text-danger'
					: 'bg-grass-soft text-grass'}"
			>
				<span class="text-[11px] font-semibold tracking-wide uppercase">{tx.primaryLabel}</span>
				{#if primaryDown}{@render stormIcon()}{:else}{@render serverIcon()}{/if}
				<span class="text-[11px] font-semibold">{primaryDown ? tx.statusDown : tx.serving}</span>
			</div>

			<!-- standby -->
			<button
				type="button"
				onclick={toggleStandby}
				disabled={phase !== 'normal'}
				class="flex flex-col items-center justify-center gap-2 rounded-xl border border-line p-3 text-center transition-all select-none disabled:cursor-not-allowed {standby
					? phase === 'failed-over'
						? 'bg-grass-soft text-grass'
						: phase === 'failing'
							? 'bg-amber-soft text-amber'
							: 'text-muted'
					: 'text-faint hover:text-ink'}"
			>
				{#if standby}
					<span class="text-[11px] font-semibold tracking-wide uppercase">{tx.standbyLabel}</span>
					{@render serverIcon()}
					<span class="text-[11px] font-semibold">
						{phase === 'failed-over' ? tx.serving : phase === 'failing' ? tx.failingOver : tx.standbyState}
					</span>
				{:else}
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" class="opacity-60">
						<path d="M12 6 v12 M6 12 h12" />
					</svg>
					<span class="text-[11px]">{tx.standbyLabel}</span>
				{/if}
			</button>
		</div>

		<div class="mt-3 flex items-center justify-between gap-3">
			<p class="text-faint text-[11px]">{tx.addHint}</p>
			<button
				type="button"
				onclick={kill}
				disabled={phase !== 'normal'}
				class="shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
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
