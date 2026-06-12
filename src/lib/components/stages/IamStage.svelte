<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { IamText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as IamText);

	type Perm = 'readFile' | 'writeFile' | 'deleteDb' | 'manageUsers';
	const PERMS: Perm[] = ['readFile', 'writeFile', 'deleteDb', 'manageUsers'];
	// A safe, scoped setup: can read (and edit) files, but cannot delete the database or manage users.
	const SAFE: Perm[] = ['readFile', 'writeFile'];
	const DANGER: Perm[] = ['deleteDb', 'manageUsers'];

	let mode = $state<'admin' | 'scoped'>('scoped');
	let granted = $state<Record<Perm, boolean>>({
		readFile: false,
		writeFile: false,
		deleteDb: false,
		manageUsers: false
	});
	// result per action: 'allow' | 'deny' | null (untested)
	let result = $state<Record<Perm, 'allow' | 'deny' | null>>({
		readFile: null,
		writeFile: null,
		deleteDb: null,
		manageUsers: null
	});

	let testedAllow = false;
	let testedDeny = false;
	let scopedRight = false;
	let fired = false;
	let flash = $state<Perm | null>(null);
	let flashKind = $state<'allow' | 'deny'>('allow');
	let flashT: ReturnType<typeof setTimeout> | undefined;

	const allows = $derived((p: Perm) => mode === 'admin' || granted[p]);
	// scoped correctly = exactly the safe perms granted, no dangerous ones
	const isLeastPriv = $derived(
		mode === 'scoped' && SAFE.every((p) => granted[p]) && DANGER.every((p) => !granted[p])
	);

	function setMode(m: 'admin' | 'scoped') {
		mode = m;
		result = { readFile: null, writeFile: null, deleteDb: null, manageUsers: null };
	}

	function toggle(p: Perm) {
		if (mode !== 'scoped') return;
		granted[p] = !granted[p];
		result[p] = null;
	}

	function maybeComplete() {
		if (!fired && scopedRight && testedAllow && testedDeny) {
			fired = true;
			oncomplete?.();
		}
	}

	function tryAction(p: Perm) {
		const ok = allows(p);
		result[p] = ok ? 'allow' : 'deny';
		flash = p;
		flashKind = ok ? 'allow' : 'deny';
		clearTimeout(flashT);
		flashT = setTimeout(() => (flash = null), 700);

		// Report least privilege the first time the learner gets the scoped setup right.
		if (isLeastPriv && !scopedRight) {
			scopedRight = true;
			onstate?.('leastpriv');
		} else if (ok) {
			testedAllow = true;
			onstate?.('allowed');
		} else {
			testedDeny = true;
			onstate?.('denied');
		}
		maybeComplete();
	}

	function reset() {
		granted = { readFile: false, writeFile: false, deleteDb: false, manageUsers: false };
		result = { readFile: null, writeFile: null, deleteDb: null, manageUsers: null };
	}

	onDestroy(() => clearTimeout(flashT));
</script>

<div class="mx-auto flex h-full w-full max-w-2xl flex-col gap-4">
	<!-- user + badge + mode -->
	<div class="border-line bg-card flex items-center gap-3 rounded-2xl border p-3">
		<div class="bg-brand-soft text-brand grid h-11 w-11 shrink-0 place-items-center rounded-full">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle cx="12" cy="8" r="4" fill="currentColor" />
				<path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
			</svg>
		</div>
		<div class="min-w-0 flex-1">
			<p class="text-ink text-sm font-bold">{tx.userLabel}</p>
			<p class="text-faint text-[11px]">{tx.userSub}</p>
		</div>
		<div class="flex shrink-0 gap-1.5">
			<button
				type="button"
				onclick={() => setMode('admin')}
				class="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all {mode === 'admin'
					? 'border-danger bg-danger-soft text-danger'
					: 'border-line bg-paper text-muted hover:border-danger'}"
			>
				{tx.adminLabel}
			</button>
			<button
				type="button"
				onclick={() => setMode('scoped')}
				class="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all {mode === 'scoped'
					? 'border-brand bg-brand-soft text-brand'
					: 'border-line bg-paper text-muted hover:border-brand'}"
			>
				{tx.scopedLabel}
			</button>
		</div>
	</div>

	<div class="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
		<!-- permissions -->
		<div class="border-line bg-card flex flex-col rounded-2xl border p-3">
			<p class="text-faint mb-2 text-[11px] font-semibold tracking-wide uppercase">{tx.permsTitle}</p>
			{#if mode === 'admin'}
				<p class="text-danger bg-danger-soft mb-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold">
					{tx.adminHint}
				</p>
			{:else}
				<p class="text-faint mb-2 text-[11px]">{tx.scopedHint}</p>
			{/if}
			<div class="flex flex-col gap-1.5">
				{#each PERMS as p (p)}
					{@const on = mode === 'admin' || granted[p]}
					<button
						type="button"
						onclick={() => toggle(p)}
						disabled={mode === 'admin'}
						class="flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all {on
							? DANGER.includes(p)
								? 'border-danger bg-danger-soft text-danger'
								: 'border-grass bg-grass-soft text-grass'
							: 'border-line bg-paper text-muted'} {mode === 'scoped' ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}"
					>
						<span>{tx.perms[p]}</span>
						<span
							class="grid h-4 w-4 place-items-center rounded-full border {on
								? 'border-current'
								: 'border-line'}"
						>
							{#if on}
								<svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
									<path d="M2 6l3 3 5-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							{/if}
						</span>
					</button>
				{/each}
			</div>
			{#if mode === 'scoped'}
				<button type="button" onclick={reset} class="text-faint hover:text-muted mt-2 self-start text-[11px] font-semibold underline">
					{tx.resetLabel}
				</button>
			{/if}
		</div>

		<!-- try actions -->
		<div class="border-line bg-card flex flex-col rounded-2xl border p-3">
			<p class="text-faint mb-2 text-[11px] font-semibold tracking-wide uppercase">{tx.tryTitle}</p>
			<div class="flex flex-col gap-1.5">
				{#each PERMS as p (p)}
					{@const r = result[p]}
					<button
						type="button"
						onclick={() => tryAction(p)}
						class="flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all {flash === p
							? flashKind === 'allow'
								? 'border-grass bg-grass-soft'
								: 'border-danger bg-danger-soft'
							: 'border-line bg-paper hover:border-brand'}"
					>
						<span class="text-ink">{tx.actions[p]}</span>
						{#if r === 'allow'}
							<span class="text-grass shrink-0 text-[11px] font-bold">{tx.allowedTag}</span>
						{:else if r === 'deny'}
							<span class="text-danger shrink-0 text-[11px] font-bold">{tx.deniedTag}</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
