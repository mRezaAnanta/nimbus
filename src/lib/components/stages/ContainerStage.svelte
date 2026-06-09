<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { ContainerText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ContainerText);

	// Build the app into an image once, then run identical copies on two hosts.
	let built = $state(false);
	type HostState = 'empty' | 'running'; // containers start instantly, no OS boot
	let hosts = $state<HostState[]>(['empty', 'empty']);
	let fired = false;

	function build() {
		if (built) return;
		built = true;
		onstate?.('shipped');
	}

	function runOn(i: number) {
		if (!built || hosts[i] !== 'empty') return;
		const next = hosts.map((h, j) => (j === i ? 'running' : h)) as HostState[];
		hosts = next;
		if (next.filter((h) => h === 'running').length >= 2 && !fired) {
			fired = true;
			onstate?.('scaled');
			oncomplete?.();
		}
	}
</script>

<div class="flex h-full w-full items-start justify-center">
	<div class="w-full max-w-2xl">
		<!-- build step: the app + its dependencies become one image -->
		<div class="border-line bg-card mb-4 rounded-2xl border p-4">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<div class="img-box {built ? 'sealed' : ''}">
						<span class="chip app">{tx.appLabel}</span>
						<span class="chip dep">{tx.depsLabel}</span>
					</div>
					<div>
						<p class="text-ink text-sm font-semibold">{built ? tx.imageLabel : tx.buildLabel}</p>
						<p class="text-faint text-[11px]">{tx.buildHint}</p>
					</div>
				</div>
				<button
					type="button"
					onclick={build}
					disabled={built}
					class="bg-ink shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all enabled:hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
				>
					{tx.buildLabel}
				</button>
			</div>
		</div>

		<!-- run the same image on two different hosts -->
		<div class="mb-4 grid grid-cols-2 gap-3">
			{#each hosts as h, i (i)}
				<div class="border-line bg-paper flex flex-col items-center gap-2 rounded-xl border p-3">
					<p class="text-faint text-[11px] font-semibold">{tx.hostLabel.replace('{n}', String(i + 1))}</p>
					{#if h === 'running'}
						<div class="img-box mini sealed running">
							<span class="chip app">{tx.appLabel}</span>
							<span class="chip dep">{tx.depsLabel}</span>
						</div>
						<span class="bg-grass-soft text-grass rounded-full px-2 py-0.5 text-[10px] font-semibold"
							>{tx.runningHere}</span
						>
					{:else}
						<button
							type="button"
							onclick={() => runOn(i)}
							disabled={!built}
							class="border-line text-muted enabled:hover:border-brand enabled:hover:text-brand flex h-[58px] w-full items-center justify-center rounded-lg border text-xs font-semibold transition-colors disabled:opacity-40"
						>
							{tx.runHere}
						</button>
					{/if}
				</div>
			{/each}
		</div>

		<!-- contrast: container vs VM weight + start time -->
		<div class="grid grid-cols-2 gap-3">
			<div class="border-line bg-card rounded-xl border p-3">
				<p class="text-ink text-xs font-semibold">{tx.containerTitle}</p>
				<p class="text-faint mb-2 text-[10px]">{tx.containerSub}</p>
				<div class="mb-1.5 flex items-center gap-2">
					<div class="bg-line h-2 flex-1 overflow-hidden rounded-full">
						<div class="bg-grass h-full rounded-full" style="width:18%;"></div>
					</div>
					<span class="text-grass text-[10px] font-semibold">{tx.containerSize}</span>
				</div>
				<p class="text-grass text-[11px] font-semibold">{tx.containerBoot}</p>
			</div>
			<div class="border-line bg-card rounded-xl border p-3">
				<p class="text-ink text-xs font-semibold">{tx.vmTitle}</p>
				<p class="text-faint mb-2 text-[10px]">{tx.vmSub}</p>
				<div class="mb-1.5 flex items-center gap-2">
					<div class="bg-line h-2 flex-1 overflow-hidden rounded-full">
						<div class="bg-amber h-full rounded-full" style="width:92%;"></div>
					</div>
					<span class="text-amber text-[10px] font-semibold">{tx.vmSize}</span>
				</div>
				<p class="text-amber text-[11px] font-semibold">{tx.vmBoot}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.img-box {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 64px;
		padding: 7px;
		border-radius: 9px;
		border: 1.5px solid #e8e2d8;
		background: #faf9f6;
		transition: all 0.3s ease;
	}
	.img-box.sealed {
		border-color: #2e6fe0;
		background: #eaf1fc;
		box-shadow: 0 4px 12px rgba(46, 111, 224, 0.16);
	}
	.img-box.mini {
		width: 56px;
		padding: 6px;
	}
	.img-box.running {
		animation: pop 0.3s ease;
	}
	.chip {
		border-radius: 4px;
		padding: 2px 0;
		text-align: center;
		font-size: 9px;
		font-weight: 600;
		color: #5e6b76;
		background: #fff;
		border: 1px solid #ece6dc;
	}
	.chip.app {
		color: #16212b;
	}
	@keyframes pop {
		0% {
			transform: scale(0.7);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
