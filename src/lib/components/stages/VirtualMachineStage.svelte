<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { VirtualMachineText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as VirtualMachineText);

	// The physical host has a fixed pool of CPU and RAM. Each VM claims a slice.
	const CPU_TOTAL = 8; // cores
	const RAM_TOTAL = 16; // GB

	type VM = { id: number; cpu: number; ram: number };
	let vms = $state<VM[]>([]);
	let nextId = 1;
	let fired = false;

	const cpuUsed = $derived(vms.reduce((s, v) => s + v.cpu, 0));
	const ramUsed = $derived(vms.reduce((s, v) => s + v.ram, 0));
	const cpuFree = $derived(CPU_TOTAL - cpuUsed);
	const ramFree = $derived(RAM_TOTAL - ramUsed);
	// Over-allocation: more promised than the host actually has, so VMs contend.
	const over = $derived(cpuUsed > CPU_TOTAL || ramUsed > RAM_TOTAL);

	const cpuPct = $derived(Math.min(100, (cpuUsed / CPU_TOTAL) * 100));
	const ramPct = $derived(Math.min(100, (ramUsed / RAM_TOTAL) * 100));

	function addVm() {
		if (vms.length >= 4) return;
		vms = [...vms, { id: nextId++, cpu: 2, ram: 4 }];
		settle();
	}

	function setCpu(id: number, v: number) {
		vms = vms.map((vm) => (vm.id === id ? { ...vm, cpu: v } : vm));
		settle();
	}
	function setRam(id: number, v: number) {
		vms = vms.map((vm) => (vm.id === id ? { ...vm, ram: v } : vm));
		settle();
	}
	function remove(id: number) {
		vms = vms.filter((vm) => vm.id !== id);
		settle();
	}

	// React to the current allocation after any change.
	function settle() {
		if (cpuUsed > CPU_TOTAL || ramUsed > RAM_TOTAL) {
			onstate?.('overcommit');
			return;
		}
		if (vms.length >= 1) onstate?.('created');
		// Goal: a couple of VMs that comfortably fit within the host.
		if (!fired && vms.length >= 2 && cpuUsed <= CPU_TOTAL && ramUsed <= RAM_TOTAL) {
			fired = true;
			oncomplete?.();
		}
	}
</script>

<div class="flex h-full w-full items-start justify-center">
	<div class="border-line bg-card w-full max-w-xl rounded-2xl border p-4 md:p-5">
		<!-- host header -->
		<div class="mb-3 flex items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect x="3" y="4" width="18" height="6" rx="1.5" stroke="#16212b" stroke-width="1.7" />
					<rect x="3" y="14" width="18" height="6" rx="1.5" stroke="#16212b" stroke-width="1.7" />
					<circle cx="6.5" cy="7" r="1" fill="#3a9c64" />
					<circle cx="6.5" cy="17" r="1" fill="#3a9c64" />
				</svg>
				<div>
					<p class="text-ink text-sm font-semibold">{tx.hostLabel}</p>
					<p class="text-faint text-[11px]">{tx.hostSub}</p>
				</div>
			</div>
			<button
				type="button"
				onclick={addVm}
				disabled={vms.length >= 4}
				class="bg-ink shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all enabled:hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{tx.addVm}
			</button>
		</div>

		<!-- capacity meters -->
		<div class="mb-4 grid grid-cols-2 gap-3">
			{#each [{ label: tx.cpuLabel, pct: cpuPct, used: cpuUsed, total: CPU_TOTAL, unit: '' }, { label: tx.ramLabel, pct: ramPct, used: ramUsed, total: RAM_TOTAL, unit: ' GB' }] as m (m.label)}
				<div>
					<div class="mb-1 flex items-center justify-between text-[11px] font-semibold">
						<span class="text-muted">{m.label}</span>
						<span class={over ? 'text-danger' : 'text-faint'}>{m.used}{m.unit} / {m.total}{m.unit}</span>
					</div>
					<div class="bg-line h-2.5 overflow-hidden rounded-full">
						<div
							class="h-full rounded-full transition-all duration-300 {over ? 'bg-danger' : 'bg-grass'}"
							style="width:{m.pct}%;"
						></div>
					</div>
				</div>
			{/each}
		</div>

		<!-- VMs -->
		{#if vms.length === 0}
			<p class="text-faint py-6 text-center text-xs">{tx.fitHint}</p>
		{:else}
			<div class="space-y-2.5">
				{#each vms as vm, i (vm.id)}
					<div
						class="rounded-xl border p-3 transition-colors {over
							? 'border-danger bg-danger-soft'
							: 'border-line bg-paper'}"
					>
						<div class="mb-2 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<span class="text-ink text-sm font-semibold">{tx.vmName.replace('{n}', String(i + 1))}</span>
								<span class="text-faint text-[10px]">{tx.osLabel}</span>
								<span
									class="rounded-full px-2 py-0.5 text-[10px] font-semibold {over
										? 'bg-danger-soft text-danger'
										: 'bg-grass-soft text-grass'}"
								>
									{over ? tx.slowLabel : tx.runningLabel}
								</span>
							</div>
							<button
								type="button"
								onclick={() => remove(vm.id)}
								class="text-faint hover:text-danger text-base leading-none transition-colors"
								aria-label="remove">×</button
							>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<label class="block">
								<span class="text-faint text-[10px] font-semibold">{tx.cpuLabel}: {vm.cpu}</span>
								<input
									type="range"
									min="1"
									max="8"
									value={vm.cpu}
									oninput={(e) => setCpu(vm.id, +e.currentTarget.value)}
									class="vm-range mt-1 w-full"
								/>
							</label>
							<label class="block">
								<span class="text-faint text-[10px] font-semibold">{tx.ramLabel}: {vm.ram} GB</span>
								<input
									type="range"
									min="2"
									max="16"
									step="2"
									value={vm.ram}
									oninput={(e) => setRam(vm.id, +e.currentTarget.value)}
									class="vm-range mt-1 w-full"
								/>
							</label>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- footer hint -->
		{#if over}
			<p class="text-danger mt-3 text-center text-xs font-semibold">{tx.overHint}</p>
		{:else if vms.length > 0}
			<p class="text-faint mt-3 text-center text-[11px]">
				{tx.freeLabel}: {cpuFree} {tx.cpuLabel}, {ramFree} GB {tx.ramLabel}
			</p>
		{/if}
	</div>
</div>

<style>
	.vm-range {
		appearance: none;
		height: 4px;
		border-radius: 999px;
		background: #e8e2d8;
		outline: none;
	}
	.vm-range::-webkit-slider-thumb {
		appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #2e6fe0;
		cursor: pointer;
		border: 2px solid #fff;
		box-shadow: 0 1px 3px rgba(22, 40, 60, 0.25);
	}
	.vm-range::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #2e6fe0;
		cursor: pointer;
		border: 2px solid #fff;
	}
</style>
