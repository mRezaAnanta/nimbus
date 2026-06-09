<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { FirewallText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as FirewallText);

	type Key = 'web' | 'ssh' | 'db';
	// Each knocking connection: a port, and whether it should be allowed (safe config).
	const RULES: { key: Key; port: number; safe: boolean }[] = [
		{ key: 'web', port: 443, safe: true },
		{ key: 'ssh', port: 22, safe: false },
		{ key: 'db', port: 3306, safe: false }
	];

	// Safe default: deny everything until the learner opens it.
	let allow = $state<Record<Key, boolean>>({ web: false, ssh: false, db: false });
	let tested = $state(false);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const correct = $derived(RULES.every((r) => allow[r.key] === r.safe));

	function set(key: Key, value: boolean) {
		allow[key] = value;
		tested = false;
	}

	function runTest() {
		tested = true;
		timers.push(
			setTimeout(() => {
				if (correct) {
					onstate?.('secured');
					if (!done) {
						done = true;
						oncomplete?.();
					}
				} else {
					// Point at the first rule that is set wrong so Nim can explain it.
					const wrong = RULES.find((r) => allow[r.key] !== r.safe);
					if (wrong) onstate?.(wrong.key);
				}
			}, 650)
		);
	}

	function reset() {
		allow = { web: false, ssh: false, db: false };
		tested = false;
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4 pb-[8vh]">
	<div class="border-line bg-card w-full max-w-2xl rounded-2xl border p-4">
		<p class="text-faint mb-3 text-[11px] font-semibold tracking-widest uppercase">{tx.ruleHeader}</p>

		<div class="flex flex-col gap-2">
			{#each RULES as r (r.key)}
				{@const c = tx.connections[r.key]}
				{@const pass = allow[r.key]}
				<div class="border-line bg-paper flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center">
					<!-- connection identity -->
					<div class="min-w-0 flex-1">
						<p class="text-ink truncate text-sm font-semibold">{c.name}</p>
						<p class="text-faint truncate text-[11px]">
							{tx.portLabel} {r.port}, {tx.sourceLabel}: {c.source}
						</p>
					</div>

					<!-- allow / deny toggle -->
					<div class="flex shrink-0 gap-1">
						<button type="button" onclick={() => set(r.key, true)} class="seg allow" class:on={pass}>
							{tx.allow}
						</button>
						<button type="button" onclick={() => set(r.key, false)} class="seg deny" class:on={!pass}>
							{tx.deny}
						</button>
					</div>

					<!-- result after a test -->
					<div class="w-[92px] shrink-0 text-right">
						{#if tested}
							<span class="text-xs font-bold {pass ? 'text-grass' : 'text-danger'}">
								{pass ? `✓ ${tx.succeeded}` : `✕ ${tx.failed}`}
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

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
</div>

<style>
	.seg {
		border-radius: 999px;
		padding: 5px 14px;
		font-size: 12px;
		font-weight: 600;
		color: #5e6b76;
		background: #faf9f6;
		border: 1px solid #e8e2d8;
		transition: all 0.15s;
	}
	.seg.allow.on {
		background: #e7f3ec;
		color: #3a9c64;
		border-color: #3a9c64;
	}
	.seg.deny.on {
		background: #fbe9e6;
		color: #d3584a;
		border-color: #d3584a;
	}
</style>
