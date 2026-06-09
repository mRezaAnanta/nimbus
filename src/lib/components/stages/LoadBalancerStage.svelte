<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { LoadBalancerText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as LoadBalancerText);

	type Server = { id: number; load: number; alive: boolean };
	let servers = $state<Server[]>([{ id: 1, load: 0, alive: true }]);
	let hasBalancer = $state(false);
	let sale = $state(false);
	let tick: ReturnType<typeof setInterval> | undefined;
	let done = false;

	// total incoming traffic units per tick; jumps high during the flash sale
	const incoming = $derived(sale ? 18 : 3);
	const aliveServers = $derived(servers.filter((s) => s.alive));
	// with a balancer, each live server takes an even slice; without one, a single server eats it all
	const overloaded = $derived(servers.some((s) => s.alive && s.load > 100));
	const browser = $derived<'loaded' | 'loading' | 'offline'>(
		overloaded ? (sale && !hasBalancer ? 'offline' : 'loading') : 'loaded'
	);

	function distribute() {
		const live = servers.filter((s) => s.alive);
		if (live.length === 0) return;
		const share = hasBalancer ? incoming / live.length : incoming;
		servers = servers.map((s) => {
			if (!s.alive) return { ...s, load: 0 };
			// without a balancer all traffic hits the first server; with one it is split evenly
			const target = hasBalancer ? share * 5.6 : incoming === 18 ? 130 : 40;
			// ease the bar toward its target so it animates
			const next = s.load + (target - s.load) * 0.5;
			return { ...s, load: Math.max(0, Math.min(160, next)) };
		});
		evaluate();
	}

	function evaluate() {
		if (!sale) return;
		if (!hasBalancer && overloaded) {
			onstate?.('overload');
		} else if (hasBalancer && aliveServers.length >= 3 && !overloaded) {
			onstate?.('balanced');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		}
	}

	function startSale() {
		sale = true;
		onstate?.('overload');
	}

	function addBalancer() {
		hasBalancer = true;
		// the balancer needs a few identical servers to spread across
		servers = [
			{ id: 1, load: 0, alive: true },
			{ id: 2, load: 0, alive: true },
			{ id: 3, load: 0, alive: true }
		];
	}

	function killServer() {
		const live = servers.filter((s) => s.alive);
		if (live.length <= 1) return;
		// take down the last live server; the balancer reroutes around it
		const victim = live[live.length - 1].id;
		servers = servers.map((s) => (s.id === victim ? { ...s, alive: false, load: 0 } : s));
		onstate?.('rerouted');
	}

	function reset() {
		sale = false;
		hasBalancer = false;
		done = false;
		servers = [{ id: 1, load: 0, alive: true }];
	}

	$effect(() => {
		if (sale) {
			tick = setInterval(distribute, 420);
			return () => clearInterval(tick);
		}
	});

	onDestroy(() => clearInterval(tick));

	function barColor(s: Server): string {
		if (!s.alive) return '#cfd6dd';
		if (s.load > 100) return '#d3584a';
		if (s.load > 70) return '#dd9e36';
		return '#3a9c64';
	}
	function status(): { text: string; cls: string } {
		if (overloaded && !hasBalancer && sale) return { text: tx.siteDown, cls: 'text-danger' };
		if (overloaded) return { text: tx.siteSlow, cls: 'text-amber' };
		return { text: tx.siteFast, cls: 'text-grass' };
	}
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row md:items-stretch">
	<div
		class="relative flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl border border-line bg-card p-4"
	>
		<!-- balancer node, present only after the learner adds it -->
		<div class="mb-3 flex items-center justify-center">
			{#if hasBalancer}
				<div class="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
					{tx.balancerLabel}
				</div>
			{:else}
				<div class="text-xs text-faint">{sale ? tx.statusOver : ''}</div>
			{/if}
		</div>

		<!-- servers with per-server load bars -->
		<div class="flex flex-1 items-end justify-center gap-3 md:gap-5">
			{#each servers as s (s.id)}
				<div class="flex flex-col items-center gap-2">
					<div class="bar-track">
						<div
							class="bar-fill"
							style="height:{Math.min(100, (s.load / 160) * 100)}%; background:{barColor(s)}"
						></div>
					</div>
					<div class="server-box" class:dead={!s.alive} style="border-color:{barColor(s)}">
						{#if s.alive}
							<span class="srv-dot" style="background:{barColor(s)}"></span>
						{:else}
							<span class="srv-x">×</span>
						{/if}
					</div>
					<span class="text-[10px] font-semibold text-faint"
						>{tx.serverLabel.replace('{n}', String(s.id))}</span
					>
				</div>
			{/each}
		</div>

		<!-- controls -->
		<div class="mt-4 flex flex-wrap items-center justify-center gap-2">
			{#if !sale}
				<button
					type="button"
					onclick={startSale}
					class="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125"
				>
					{tx.startSale}
				</button>
			{:else}
				{#if !hasBalancer}
					<button
						type="button"
						onclick={addBalancer}
						class="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
					>
						{tx.addBalancer}
					</button>
				{:else}
					<button
						type="button"
						onclick={killServer}
						disabled={aliveServers.length <= 1}
						class="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink transition-all enabled:hover:brightness-105 disabled:opacity-40"
					>
						{tx.killServer}
					</button>
				{/if}
				<button
					type="button"
					onclick={reset}
					class="rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition-all hover:brightness-110"
				>
					{tx.reset}
				</button>
			{/if}
		</div>
	</div>

	<!-- phone + status -->
	<div class="flex shrink-0 flex-row items-center justify-center gap-4 md:w-[200px] md:flex-col">
		<Browser phase={browser} />
		<div class="w-[150px] rounded-2xl border border-line bg-card p-4 text-center md:w-full">
			<p class="text-lg font-bold {status().cls}">{status().text}</p>
		</div>
	</div>
</div>

<style>
	.bar-track {
		display: flex;
		align-items: flex-end;
		width: 26px;
		height: 90px;
		border-radius: 6px;
		background: #f1ede5;
		overflow: hidden;
	}
	.bar-fill {
		width: 100%;
		border-radius: 6px 6px 0 0;
		transition:
			height 0.35s ease,
			background 0.3s ease;
	}
	.server-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 30px;
		border-radius: 8px;
		border: 2px solid #3a9c64;
		background: #fff;
		transition: border-color 0.3s ease;
	}
	.server-box.dead {
		background: #f4f1ea;
	}
	.srv-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	.srv-x {
		color: #b9c0c7;
		font-size: 16px;
		font-weight: 700;
		line-height: 1;
	}
</style>
