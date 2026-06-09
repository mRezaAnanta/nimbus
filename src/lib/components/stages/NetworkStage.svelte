<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { NetworkText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as NetworkText);

	type Zone = 'public' | 'private';
	let web = $state<Zone>('public');
	let db = $state<Zone>('public');
	let tested = $state(false);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// What a probe from the internet finds: only public-subnet resources answer.
	const secure = $derived(web === 'public' && db === 'private');
	const dbExposed = $derived(db === 'public');

	function place(which: 'web' | 'db', zone: Zone) {
		if (which === 'web') web = zone;
		else db = zone;
		tested = false;
	}

	function runTest() {
		tested = true;
		timers.push(
			setTimeout(() => {
				if (secure) {
					onstate?.('secured');
					if (!done) {
						done = true;
						oncomplete?.();
					}
				} else if (dbExposed) {
					onstate?.('exposed');
				}
			}, 650)
		);
	}

	function reset() {
		web = 'public';
		db = 'public';
		tested = false;
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4 pb-[8vh]">
	<!-- the VPC building -->
	<div class="border-line bg-card w-full max-w-2xl rounded-2xl border p-4">
		<p class="text-faint mb-3 text-[11px] font-semibold tracking-widest uppercase">{tx.vpcLabel}</p>
		<div class="flex flex-col gap-3 md:flex-row">
			<!-- public subnet -->
			<div
				class="flex-1 rounded-xl border p-3 transition-colors {tested && dbExposed
					? 'border-danger bg-danger-soft'
					: 'border-brand bg-brand-soft'}"
			>
				<div class="flex items-center justify-between">
					<span class="text-brand text-xs font-bold">{tx.publicLabel}</span>
					<span class="text-faint text-[10px]">{tx.publicSub}</span>
				</div>
				<div class="mt-3 flex min-h-[52px] flex-wrap items-center gap-2">
					{#if web === 'public'}
						<span class="chip web">{tx.webLabel}</span>
					{/if}
					{#if db === 'public'}
						<span class="chip db" class:danger={tested}>{tx.dbLabel}</span>
					{/if}
				</div>
			</div>

			<!-- private subnet -->
			<div class="border-line bg-paper flex-1 rounded-xl border p-3">
				<div class="flex items-center justify-between">
					<span class="text-ink text-xs font-bold">{tx.privateLabel}</span>
					<span class="text-faint text-[10px]">{tx.privateSub}</span>
				</div>
				<div class="mt-3 flex min-h-[52px] flex-wrap items-center gap-2">
					{#if web === 'private'}
						<span class="chip web">{tx.webLabel}</span>
					{/if}
					{#if db === 'private'}
						<span class="chip db">{tx.dbLabel}</span>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- placement controls -->
	<div class="flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
		<div class="border-line bg-card flex flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2">
			<span class="text-muted text-xs font-semibold">{tx.webLabel}</span>
			<div class="flex gap-1">
				<button type="button" onclick={() => place('web', 'public')} class="seg" class:on={web === 'public'}>
					{tx.publicLabel}
				</button>
				<button type="button" onclick={() => place('web', 'private')} class="seg" class:on={web === 'private'}>
					{tx.privateLabel}
				</button>
			</div>
		</div>
		<div class="border-line bg-card flex flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2">
			<span class="text-muted text-xs font-semibold">{tx.dbLabel}</span>
			<div class="flex gap-1">
				<button type="button" onclick={() => place('db', 'public')} class="seg" class:on={db === 'public'}>
					{tx.publicLabel}
				</button>
				<button type="button" onclick={() => place('db', 'private')} class="seg" class:on={db === 'private'}>
					{tx.privateLabel}
				</button>
			</div>
		</div>
	</div>

	<!-- test + verdict -->
	<div class="flex items-center gap-3">
		<button
			type="button"
			onclick={runTest}
			class="bg-ink rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-125"
		>
			{tx.testLabel}
		</button>
		{#if tested}
			<button
				type="button"
				onclick={reset}
				class="border-line text-muted hover:border-brand rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
			>
				{tx.reset}
			</button>
		{/if}
	</div>

	{#if tested}
		<p
			class="text-sm font-semibold {secure ? 'text-grass' : dbExposed ? 'text-danger' : 'text-amber'}"
		>
			{#if secure}✓ {tx.securedNote}{:else if dbExposed}! {tx.exposedNote}{/if}
		</p>
	{/if}
</div>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		border-radius: 8px;
		padding: 6px 10px;
		font-size: 12px;
		font-weight: 600;
		border: 1px solid transparent;
	}
	.chip.web {
		background: #fff;
		border-color: #c9d6ea;
		color: #2e6fe0;
	}
	.chip.db {
		background: #fff;
		border-color: #e8e2d8;
		color: #16212b;
	}
	.chip.db.danger {
		background: #fbe9e6;
		border-color: #d3584a;
		color: #d3584a;
	}
	.seg {
		border-radius: 999px;
		padding: 4px 10px;
		font-size: 11px;
		font-weight: 600;
		color: #5e6b76;
		background: #faf9f6;
		border: 1px solid #e8e2d8;
		transition: all 0.15s;
	}
	.seg.on {
		background: #16212b;
		color: #fff;
		border-color: #16212b;
	}
</style>
