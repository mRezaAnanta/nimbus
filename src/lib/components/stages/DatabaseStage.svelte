<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { DatabaseText } from '$lib/chapters/resilience/types';

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

	type Kind = 'sql' | 'nosql';
	// each case has a correct fit
	const CASES: { key: string; fit: Kind }[] = [
		{ key: 'transfer', fit: 'sql' },
		{ key: 'feed', fit: 'nosql' }
	];

	let step = $state(0);
	let answered = $state<Kind | null>(null);
	let fired = false;

	const current = $derived(CASES[Math.min(step, CASES.length - 1)]);
	const solved = $derived(step >= CASES.length);
	const correct = $derived(answered !== null && answered === current.fit);

	function answer(pick: Kind) {
		if (answered) return;
		answered = pick;
		const ok = pick === current.fit;
		onstate?.(ok ? current.fit : 'wrong');
		if (!ok) return;
	}

	function nextCase() {
		answered = null;
		step += 1;
		if (solved && !fired) {
			fired = true;
			oncomplete?.();
		}
	}
</script>

<div class="flex h-full w-full flex-col gap-4">
	<!-- visual: a relational table beside a JSON document -->
	<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
		<!-- SQL table -->
		<div class="border-line bg-card flex flex-col overflow-hidden rounded-2xl border">
			<div class="border-line bg-brand-soft flex items-center justify-between border-b px-3 py-2">
				<span class="text-brand text-xs font-bold">{tx.sqlTitle}</span>
				<span class="text-muted text-[10px]">{tx.tableName}</span>
			</div>
			<div class="overflow-x-auto p-2">
				<table class="w-full border-collapse text-left text-[11px]">
					<thead>
						<tr>
							{#each tx.columns as c (c)}
								<th class="border-line text-muted border-b px-2 py-1 font-semibold">{c}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each tx.rows as row, ri (ri)}
							<tr>
								{#each row as cell, ci (ci)}
									<td class="border-line text-ink border-b px-2 py-1">{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<p class="text-faint px-3 pb-2 text-[10px] leading-snug">{tx.sqlSub}</p>
		</div>

		<!-- NoSQL document -->
		<div class="border-line bg-card flex flex-col overflow-hidden rounded-2xl border">
			<div class="border-line bg-amber-soft flex items-center justify-between border-b px-3 py-2">
				<span class="text-amber text-xs font-bold">{tx.nosqlTitle}</span>
				<span class="text-muted text-[10px]">{tx.docLabel}</span>
			</div>
			<pre class="text-ink overflow-x-auto p-3 text-[11px] leading-relaxed"><code
					>{`{
  "id": "p_91",
  "type": "photo",
  "likes": 1240,
  "tags": ["sunset", "bali"],
  "place": { "lat": -8.4, "lon": 115.2 }
}`}</code
				></pre>
			<p class="text-faint px-3 pb-2 text-[10px] leading-snug">{tx.nosqlSub}</p>
		</div>
	</div>

	<!-- the case + choice -->
	<div class="border-line bg-paper flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-2xl border p-4">
		{#if solved}
			<span class="text-grass text-sm font-semibold">{tx.done}</span>
		{:else}
			<p class="text-ink max-w-md text-center text-sm font-medium">{tx.cases[current.key]}</p>
			{#if answered === null}
				<p class="text-faint text-[11px]">{tx.prompt}</p>
				<div class="flex gap-3">
					<button
						type="button"
						onclick={() => answer('sql')}
						class="border-brand text-brand hover:bg-brand-soft rounded-full border px-5 py-2 text-sm font-semibold transition-all"
					>
						{tx.pickSql}
					</button>
					<button
						type="button"
						onclick={() => answer('nosql')}
						class="border-amber text-amber hover:bg-amber-soft rounded-full border px-5 py-2 text-sm font-semibold transition-all"
					>
						{tx.pickNosql}
					</button>
				</div>
			{:else}
				<p
					class="max-w-md text-center text-sm font-medium {correct ? 'text-grass' : 'text-danger'}"
				>
					{tx.why[correct ? current.fit : 'wrong']}
				</p>
				{#if correct}
					<button
						type="button"
						onclick={nextCase}
						class="bg-ink rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-125"
					>
						{step + 1 < CASES.length ? '→' : tx.done}
					</button>
				{:else}
					<button
						type="button"
						onclick={() => (answered = null)}
						class="border-line text-ink hover:border-brand rounded-full border px-5 py-2 text-sm font-semibold transition-all"
					>
						↺
					</button>
				{/if}
			{/if}
		{/if}
	</div>
</div>
