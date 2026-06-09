<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { ReverseProxyText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ReverseProxyText);

	// Each backend gets a stable colour. Keys match the route definitions.
	const COLORS: Record<string, string> = {
		web: '#2e6fe0',
		api: '#3a9c64',
		static: '#dd9e36'
	};

	type Flight = { id: number; path: string; backend: string; phase: 'toProxy' | 'toBackend' };
	let flights = $state<Flight[]>([]);
	const routed = new SvelteSet<string>();
	let busy = $state(false);
	let uid = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let done = false;

	function send(routeIndex: number) {
		if (busy) return;
		const route = tx.routes[routeIndex];
		busy = true;
		const id = ++uid;
		flights = [...flights, { id, path: route.path, backend: route.backend, phase: 'toProxy' }];
		// packet reaches the proxy, then the proxy forwards it to the matching backend
		timers.push(
			setTimeout(() => {
				flights = flights.map((f) => (f.id === id ? { ...f, phase: 'toBackend' } : f));
			}, 650)
		);
		timers.push(
			setTimeout(() => {
				flights = flights.filter((f) => f.id !== id);
				routed.add(route.backend);
				busy = false;
				onstate?.(route.backend);
				if (routed.size >= 2 && !done) {
					done = true;
					oncomplete?.();
				}
			}, 1500)
		);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-6 pb-[12vh]">
	<div class="grid w-full max-w-3xl grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-5">
		<!-- visitors send requests with different paths -->
		<div class="flex flex-col gap-2">
			{#each tx.routes as route, i (route.path)}
				<button
					type="button"
					onclick={() => send(i)}
					disabled={busy}
					class="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-left text-xs font-semibold text-ink transition-all enabled:hover:brightness-105 disabled:opacity-50"
				>
					<span
						class="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
						style="background:{COLORS[route.backend]}"
					></span>
					<span class="font-mono">{route.path}</span>
				</button>
			{/each}
		</div>

		<!-- proxy in the middle, with packets flying across -->
		<div class="relative flex min-h-[200px] items-center justify-center">
			<div class="proxy">
				<div class="text-[11px] font-bold tracking-wide uppercase" style="color:#16212b">
					{tx.proxyLabel}
				</div>
				<div class="mt-0.5 text-[10px] leading-tight text-faint">{tx.proxySub}</div>
				<div class="mt-2 rounded-md bg-brand-soft px-2 py-1 font-mono text-[10px] text-brand">
					{tx.publicAddr}
				</div>
			</div>

			<!-- flying packets -->
			{#each flights as f (f.id)}
				<div
					class="packet"
					class:to-backend={f.phase === 'toBackend'}
					style="background:{COLORS[f.backend]}"
				>
					{f.path}
				</div>
			{/each}
		</div>

		<!-- backends, color coded, addresses hidden -->
		<div class="flex flex-col gap-2">
			{#each tx.routes as route (route.backend)}
				<div
					class="backend"
					class:lit={routed.has(route.backend)}
					style="--c:{COLORS[route.backend]}"
				>
					<span class="dot"></span>
					<div class="min-w-0">
						<div class="text-[11px] font-semibold" style="color:{COLORS[route.backend]}">
							{route.label}
						</div>
						<div class="font-mono text-[9px] text-faint">{tx.hiddenLabel}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<p class="h-5 text-sm font-semibold text-grass">
		{#if routed.size > 0}
			✓ {tx.routedNote.replace('{n}', String(routed.size))}
		{/if}
	</p>
</div>

<style>
	.proxy {
		position: relative;
		z-index: 2;
		width: 150px;
		border-radius: 14px;
		border: 1px solid #d8e3f5;
		background: #fff;
		padding: 12px;
		text-align: center;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.backend {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 132px;
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 8px 10px;
		opacity: 0.55;
		transition:
			opacity 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}
	.backend.lit {
		opacity: 1;
		border-color: var(--c);
		box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 24%, transparent);
	}
	.backend .dot {
		flex: none;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--c);
	}
	.packet {
		position: absolute;
		top: 50%;
		left: 0;
		transform: translate(-50%, -50%);
		padding: 3px 9px;
		border-radius: 999px;
		color: #fff;
		font-size: 10px;
		font-weight: 700;
		font-family: ui-monospace, monospace;
		white-space: nowrap;
		box-shadow: 0 3px 8px rgba(22, 40, 60, 0.18);
		animation: to-proxy 0.65s ease forwards;
	}
	.packet.to-backend {
		animation: to-backend 0.85s ease forwards;
	}
	@keyframes to-proxy {
		from {
			left: -8%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			left: 50%;
			opacity: 1;
		}
	}
	@keyframes to-backend {
		from {
			left: 50%;
			opacity: 1;
		}
		to {
			left: 108%;
			opacity: 0;
		}
	}
</style>
