<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ReplicationText } from '$lib/chapters/storage/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ReplicationText);

	// three zones: A holds the primary, B and C can hold replicas
	type ZoneState = 'live' | 'replica' | 'down' | 'empty';
	const ZONES = ['a', 'b', 'c'] as const;
	type ZoneKey = (typeof ZONES)[number];

	let zone = $state<Record<ZoneKey, ZoneState>>({ a: 'live', b: 'empty', c: 'empty' });
	let hasBackup = $state(false);
	let deleted = $state(false);
	let survived = false;
	let fired = false;
	let t: ReturnType<typeof setTimeout> | undefined;

	const replicas = $derived(ZONES.filter((z) => zone[z] === 'replica').length);
	const anyLive = $derived(ZONES.some((z) => zone[z] === 'live' || zone[z] === 'replica'));
	const allGone = $derived(!anyLive && !deleted);

	function addReplica(z: ZoneKey) {
		if (zone[z] !== 'empty') return;
		zone[z] = 'replica';
	}

	function takeBackup() {
		hasBackup = true;
	}

	// a hardware failure hits the primary zone
	function fail() {
		if (deleted) return;
		zone.a = 'down';
		if (replicas > 0) {
			// a replica is promoted and keeps serving
			const r = ZONES.find((z) => zone[z] === 'replica');
			if (r) zone[r] = 'live';
			onstate?.('replicated');
			survived = true;
			if (!fired) {
				fired = true;
				oncomplete?.();
			}
			// the failed zone comes back as empty after a moment
			t = setTimeout(() => {
				if (zone.a === 'down') zone.a = 'empty';
			}, 2000);
		} else {
			// no replica: the only copy is lost
			onstate?.('lost');
		}
	}

	// an accidental delete wipes the live data everywhere (a replica would just copy it)
	function del() {
		deleted = true;
		onstate?.('lost');
	}

	function restore() {
		if (!hasBackup) return;
		deleted = false;
		zone.a = 'live';
		zone.b = zone.b === 'live' ? 'replica' : zone.b;
		onstate?.('restored');
	}

	const dataGone = $derived(allGone || deleted);

	function label(z: ZoneKey, st: ZoneState) {
		if (st === 'live') return tx.serving;
		if (st === 'replica') return tx.replicaLabel;
		if (st === 'down') return tx.lostLabel;
		return tx.emptyLabel;
	}

	onDestroy(() => clearTimeout(t));
</script>

<div class="flex h-full w-full flex-col gap-4">
	<!-- three zones across separate buildings -->
	<div class="grid flex-1 grid-cols-3 gap-3">
		{#each ZONES as z (z)}
			{@const st = zone[z]}
			<div
				class="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 text-center transition-all {st ===
				'down'
					? 'border-danger bg-danger-soft'
					: st === 'live'
						? 'border-grass bg-grass-soft'
						: st === 'replica'
							? 'border-brand bg-brand-soft'
							: 'border-line bg-card'}"
			>
				<span class="text-faint text-[10px] font-semibold tracking-wide uppercase">{tx.zones[z]}</span>
				<!-- disk glyph -->
				<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
					{#if st === 'empty'}
						<rect x="8" y="10" width="24" height="20" rx="3" fill="none" stroke="#cfd6dd" stroke-width="2" />
					{:else}
						<rect
							x="8"
							y="10"
							width="24"
							height="20"
							rx="3"
							fill={st === 'down' ? '#fbe9e6' : st === 'live' ? '#e7f3ec' : '#eaf1fc'}
							stroke={st === 'down' ? '#d3584a' : st === 'live' ? '#3a9c64' : '#2e6fe0'}
							stroke-width="2"
						/>
						<circle
							cx="20"
							cy="20"
							r="5"
							fill={st === 'down' ? '#d3584a' : st === 'live' ? '#3a9c64' : '#2e6fe0'}
						/>
					{/if}
				</svg>
				<span
					class="text-[11px] font-semibold {st === 'down'
						? 'text-danger'
						: st === 'live'
							? 'text-grass'
							: st === 'replica'
								? 'text-brand'
								: 'text-faint'}"
				>
					{label(z, st)}
				</span>
				{#if st === 'empty'}
					<button
						type="button"
						onclick={() => addReplica(z)}
						class="border-brand text-brand hover:bg-brand-soft mt-1 rounded-full border px-2 py-1 text-[10px] font-semibold transition-all"
					>
						{tx.addReplica}
					</button>
				{/if}
			</div>
		{/each}
	</div>

	<!-- backup shelf -->
	<div class="border-line bg-paper flex items-center justify-between rounded-2xl border px-4 py-3">
		<div class="flex items-center gap-2">
			<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
				<rect
					x="3"
					y="6"
					width="18"
					height="14"
					rx="2"
					fill={hasBackup ? '#fbf1de' : 'none'}
					stroke={hasBackup ? '#dd9e36' : '#cfd6dd'}
					stroke-width="2"
				/>
				<path d="M3 9h18" stroke={hasBackup ? '#dd9e36' : '#cfd6dd'} stroke-width="2" />
			</svg>
			<span class="text-[11px] font-semibold {hasBackup ? 'text-amber' : 'text-faint'}">
				{tx.backupLabel}{hasBackup ? '' : ` (${tx.emptyLabel})`}
			</span>
		</div>
		<button
			type="button"
			onclick={takeBackup}
			disabled={hasBackup}
			class="border-amber text-amber hover:bg-amber-soft rounded-full border px-3 py-1 text-[11px] font-semibold transition-all disabled:opacity-40"
		>
			{tx.takeBackup}
		</button>
	</div>

	<p class="text-faint text-center text-[11px]">{tx.prompt}</p>

	<!-- the threats -->
	<div class="flex flex-wrap items-center justify-center gap-2">
		<button
			type="button"
			onclick={fail}
			disabled={deleted}
			class="bg-ink rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:opacity-40"
		>
			{tx.failButton}
		</button>
		<button
			type="button"
			onclick={del}
			disabled={deleted}
			class="border-danger text-danger hover:bg-danger-soft rounded-full border px-4 py-1.5 text-xs font-semibold transition-all disabled:opacity-40"
		>
			{tx.deleteButton}
		</button>
		{#if deleted}
			<button
				type="button"
				onclick={restore}
				disabled={!hasBackup}
				class="border-grass text-grass hover:bg-grass-soft rounded-full border px-4 py-1.5 text-xs font-semibold transition-all disabled:opacity-40"
			>
				{tx.restoreButton}
			</button>
		{/if}
	</div>
</div>
