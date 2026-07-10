<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { DatabaseText } from '$lib/chapters/resilience/types';
	import { theme } from '$lib/theme.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as DatabaseText);
	let dark = $derived($theme === 'dark');

	let extraCount = $state(0);
	let docCount = $state(1);
	const tried = new SvelteSet<string>();
	let done = false;

	function register(k: string) {
		tried.add(k);
		onstate?.(k);
		if (tried.size >= 2 && !done) {
			done = true;
			oncomplete?.();
		}
	}
	function addRow() {
		if (extraCount >= tx.extraRows.length) return;
		extraCount += 1;
		register('sql');
	}
	function addDoc() {
		if (docCount >= tx.docs.length) return;
		docCount += 1;
		register('nosql');
	}

	const allRows = $derived([...tx.rows, ...tx.extraRows.slice(0, extraCount)]);
	const shownDocs = $derived(tx.docs.slice(0, docCount));
	const DOCC = ['#2e6fe0', '#3a9c64', '#dd9e36'];
</script>

<div class="flex h-full w-full items-center justify-center" class:dark>
	<div class="grid w-full max-w-[680px] grid-cols-2 gap-3 md:gap-5">
		<!-- SQL, the strict table -->
		<section class="card">
			<header>
				<span class="ic" style="--a:#2e6fe0">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="M4 5h16M4 12h16M4 19h16M9 5v14" stroke="#2e6fe0" stroke-width="2" stroke-linecap="round" />
					</svg>
				</span>
				<div><h3>{tx.sqlTitle}</h3><p>{tx.sqlSub}</p></div>
			</header>

			<div class="demo">
				<div class="tbl">
					<div class="tname">{tx.tableName}</div>
					<div class="trow head">
						{#each tx.columns as c (c)}<span>{c}</span>{/each}
					</div>
					{#each allRows as r, i (i)}
						<div class="trow" class:fresh={i >= tx.rows.length}>
							{#each r as cell, j (j)}<span>{cell}</span>{/each}
						</div>
					{/each}
				</div>
				<span class="snote">{tx.schemaNote}</span>
			</div>

			<div class="when">
				<span class="wtitle">{tx.whenTitle}</span>
				{#each tx.sqlWhen as w (w)}<span class="wchip blue">{w}</span>{/each}
			</div>

			<button class="act" class:pulse={!tried.has('sql')} onclick={addRow} disabled={extraCount >= tx.extraRows.length}>
				{tx.addRow}
			</button>
		</section>

		<!-- NoSQL, the free documents -->
		<section class="card">
			<header>
				<span class="ic" style="--a:#3a9c64">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="#3a9c64" stroke-width="2" stroke-linejoin="round" />
						<path d="M9 13h6M9 17h4" stroke="#3a9c64" stroke-width="2" stroke-linecap="round" />
					</svg>
				</span>
				<div><h3>{tx.nosqlTitle}</h3><p>{tx.nosqlSub}</p></div>
			</header>

			<div class="demo">
				<div class="docs">
					{#each shownDocs as d, i (d.name)}
						<div class="doc" style="--a:{DOCC[i % DOCC.length]}">
							<span class="dname">{d.name}</span>
							{#each d.fields as f (f)}
								<span class="dfield"><i>{f}</i><em></em></span>
							{/each}
						</div>
					{/each}
				</div>
				<span class="snote">{tx.freeNote}</span>
			</div>

			<div class="when">
				<span class="wtitle">{tx.whenTitle}</span>
				{#each tx.nosqlWhen as w (w)}<span class="wchip green">{w}</span>{/each}
			</div>

			<button class="act grass" class:pulse={!tried.has('nosql')} onclick={addDoc} disabled={docCount >= tx.docs.length}>
				{tx.addDoc}
			</button>
		</section>
	</div>
</div>

<style>
	.card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 9px;
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 12px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.05);
	}
	header {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.ic {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: color-mix(in srgb, var(--a) 12%, #fff);
	}
	header h3 {
		font-size: 13px;
		font-weight: 800;
		color: #16212b;
		line-height: 1.1;
	}
	header p {
		font-size: 9.5px;
		color: #8a949d;
		line-height: 1.2;
	}
	.demo {
		display: flex;
		min-height: 168px;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 7px;
		border-radius: 12px;
		background: #f7f6f2;
		padding: 10px 8px;
	}

	/* the strict table */
	.tbl {
		width: 100%;
		max-width: 190px;
		border-radius: 9px;
		border: 1.5px solid #cdddf6;
		background: #fff;
		overflow: hidden;
	}
	.tname {
		background: #eaf1fc;
		color: #2e6fe0;
		font-size: 9px;
		font-weight: 800;
		padding: 3px 8px;
	}
	.trow {
		display: grid;
		grid-template-columns: 0.6fr 1.1fr 1.3fr;
		border-top: 1px solid #eef2f9;
	}
	.trow span {
		padding: 3px 7px;
		font-size: 9px;
		color: #3d4a55;
		font-variant-numeric: tabular-nums;
		border-left: 1px solid #eef2f9;
		white-space: nowrap;
		overflow: hidden;
	}
	.trow span:first-child {
		border-left: none;
	}
	.trow.head span {
		background: #f4f8fe;
		color: #2e6fe0;
		font-weight: 800;
	}
	.trow.fresh {
		animation: rowin 0.4s ease;
	}
	.trow.fresh span {
		background: #f0f9f3;
	}
	@keyframes rowin {
		from {
			transform: translateY(-6px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* the free documents */
	.docs {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.doc {
		display: flex;
		width: 100%;
		max-width: 180px;
		flex-direction: column;
		gap: 3px;
		border-radius: 9px;
		border: 1.5px solid var(--a);
		background: color-mix(in srgb, var(--a) 6%, #fff);
		padding: 5px 8px;
		animation: rowin 0.35s ease;
	}
	.dname {
		font-size: 9px;
		font-weight: 800;
		color: var(--a);
	}
	.dfield {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.dfield i {
		flex: none;
		width: 44px;
		font-size: 8.5px;
		font-style: normal;
		font-weight: 700;
		color: #5e6b76;
	}
	.dfield em {
		flex: 1;
		height: 5px;
		border-radius: 3px;
		background: color-mix(in srgb, var(--a) 22%, #fff);
	}

	.snote {
		font-size: 9px;
		font-weight: 700;
		color: #8a949d;
		text-align: center;
	}

	.when {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 4px;
	}
	.wtitle {
		width: 100%;
		text-align: center;
		font-size: 8.5px;
		font-weight: 800;
		color: #16212b;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.wchip {
		border-radius: 999px;
		font-size: 9px;
		font-weight: 700;
		padding: 1px 8px;
	}
	.wchip.blue {
		border: 1px solid #cdddf6;
		background: #eaf1fc;
		color: #2e6fe0;
	}
	.wchip.green {
		border: 1px solid #cde6d7;
		background: #ecf6f0;
		color: #2f7d54;
	}

	.act {
		align-self: center;
		border-radius: 999px;
		background: #2e6fe0;
		color: #fff;
		padding: 7px 16px;
		font-size: 12px;
		font-weight: 600;
		transition:
			filter 0.2s ease,
			transform 0.15s ease;
	}
	.act.grass {
		background: #3a9c64;
	}
	.act:active {
		transform: translateY(1px);
	}
	.act:disabled {
		opacity: 0.4;
	}
	.act:enabled:hover {
		filter: brightness(1.08);
	}
	.pulse {
		animation: pulse 1.8s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.16);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse,
		.trow.fresh,
		.doc {
			animation-duration: 0.01s;
		}
	}
	/* ---- Dark mode ---- */
	.dark .card {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	.dark .ic {
		background: color-mix(in srgb, var(--a) 20%, var(--color-card));
	}
	.dark header h3 {
		color: var(--color-ink);
	}
	.dark header p {
		color: var(--color-faint);
	}
	.dark .demo {
		background: #1e2835;
	}
	.dark .tbl {
		background: var(--color-card);
		border-color: #3a5a80;
	}
	.dark .tname {
		background: var(--color-brand-soft);
	}
	.dark .trow {
		border-top-color: var(--color-line);
	}
	.dark .trow span {
		color: var(--color-muted);
		border-left-color: var(--color-line);
	}
	.dark .trow.head span {
		background: var(--color-brand-soft);
	}
	.dark .trow.fresh span {
		background: var(--color-grass-soft);
	}
	.dark .doc {
		background: color-mix(in srgb, var(--a) 10%, var(--color-card));
	}
	.dark .dfield i {
		color: var(--color-muted);
	}
	.dark .dfield em {
		background: color-mix(in srgb, var(--a) 30%, var(--color-card));
	}
	.dark .snote {
		color: var(--color-faint);
	}
	.dark .wtitle {
		color: var(--color-ink);
	}
	.dark .wchip.blue {
		background: var(--color-brand-soft);
		border-color: #3a5a80;
	}
	.dark .wchip.green {
		background: var(--color-grass-soft);
		border-color: #1f3d28;
		color: var(--color-grass);
	}

	@media (min-width: 768px) {
		.card {
			gap: 12px;
			padding: 18px;
		}
		header h3 {
			font-size: 16px;
		}
		header p {
			font-size: 12px;
		}
		.ic {
			width: 32px;
			height: 32px;
		}
		.demo {
			min-height: 218px;
			padding: 14px;
		}
		.tbl {
			max-width: 240px;
		}
		.tname {
			font-size: 11px;
		}
		.trow span {
			font-size: 11px;
			padding: 4px 9px;
		}
		.doc {
			max-width: 230px;
		}
		.dname {
			font-size: 11px;
		}
		.dfield i {
			font-size: 10.5px;
			width: 56px;
		}
		.dfield em {
			height: 6px;
		}
		.snote {
			font-size: 11px;
		}
		.wtitle {
			font-size: 10px;
		}
		.wchip {
			font-size: 11px;
			padding: 2px 10px;
		}
		.act {
			font-size: 13.5px;
			padding: 8px 18px;
		}
	}
</style>
