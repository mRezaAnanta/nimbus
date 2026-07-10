<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText, VirtualMachineText } from '$lib/chapters/types';
	import { theme } from '$lib/theme.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate,
		beat = 0,
		onshow
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as VirtualMachineText);

	let dark = $derived($theme === 'dark');

	const lastBeat = $derived(beat >= tx.intro.length - 1);
	// from the second beat (where virtualization is introduced) the one screen splits and the
	// virtualization layer slides in, before the learner builds any VMs
	const sliced = $derived(beat >= 1);
	// the laptop narrates from the first beat, so keep the stage undimmed
	$effect(() => {
		void beat;
		onshow?.(true);
	});

	// the lid opens by itself shortly after the lesson starts
	let open = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];
	$effect(() => {
		timers.push(setTimeout(() => (open = true), 750));
	});

	const COLORS = ['#2e6fe0', '#3a9c64', '#dd9e36', '#7c6fd0'];
	let vms = $state(0);
	let done = false;

	function addVm() {
		if (vms >= 4) return;
		vms += 1;
		onstate?.(vms === 1 ? 'first' : vms === 4 ? 'full' : 'more');
		if (vms === 4 && !done) {
			done = true;
			oncomplete?.();
		}
	}

	const used = $derived(vms === 0 ? 15 : vms * 25);
	const caption = $derived(vms === 4 ? tx.fullLabel : vms > 0 ? tx.prompt : '');

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4" class:dark>
	<!-- the laptop, lid swinging open, screen splitting into VMs -->
	<div class="stagebox">
		<div class="lap">
			<div class="lid" class:open>
				<div class="lidback"></div>
				<div class="screen">
					{#if !sliced}
						<div class="single">
							<div class="shead"><span class="sled"></span><span class="stab"></span></div>
							<div class="sbody">
								<div class="bar title"></div>
								<div class="bar w85"></div>
								<div class="bar w70"></div>
							</div>
							<div class="scap">
								<b>{tx.singleLabel}</b>
								<span>{tx.singleSub}</span>
							</div>
						</div>
					{:else}
						<div class="grid4">
							{#each [0, 1, 2, 3] as i (i)}
								{#if i < vms}
									<div class="vm" style="--a:{COLORS[i]}">
										<div class="vhead"><span class="vled"></span><span class="vtab"></span></div>
										<div class="vbar w80"></div>
										<div class="vbar w60"></div>
										<div class="vfoot">
											<b>{tx.vmName.replace('{n}', String(i + 1))}</b>
											<span>{tx.vmSub}</span>
										</div>
									</div>
								{:else}
									<div class="slot">+</div>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="deck"><span class="pad"></span></div>
		</div>
	</div>

	<!-- the virtualization layer that slices the one machine into many -->
	{#if sliced}
		<div class="vlayer">
			<span class="vlayer-name">{tx.virtLayer}</span>
			<span class="vlayer-sub">{tx.virtSub}</span>
		</div>
	{/if}

	<!-- the one machine underneath it all -->
	<div class="chips">
		<span class="chip dark">{tx.hostLabel}</span>
		<span class="chip">{tx.hostCpu}</span>
		<span class="chip">{tx.hostRam}</span>
		{#if vms > 0}
			{#key vms}<span class="chip per">{tx.perVm}</span>{/key}
		{/if}
	</div>

	<!-- how much of the machine is actually working -->
	<div class="gauge">
		<span class="gtrack"><i style="width:{used}%"></i></span>
		<span class="gnum">{tx.usedLabel.replace('{n}', String(used))}</span>
	</div>

	<p class="cap" class:full={vms === 4}>{caption}</p>

	{#if vms < 4}
		<CallToActionButton waiting={!lastBeat} onclick={addVm} disabled={!lastBeat || !open}>
			{tx.addVm}
		</CallToActionButton>
	{/if}
</div>

<style>
	.stagebox {
		perspective: 900px;
	}
	.lap {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.lid {
		position: relative;
		width: 252px;
		height: 168px;
		transform-origin: bottom center;
		transform: rotateX(-84deg);
		transition: transform 1s cubic-bezier(0.32, 0.9, 0.35, 1);
		transform-style: preserve-3d;
	}
	.lid.open {
		transform: rotateX(0deg);
	}
	.lidback {
		position: absolute;
		inset: 0;
		border-radius: 14px 14px 0 0;
		background: #fff;
		border: 1px solid #e8e2d8;
		transform: translateZ(-1px);
	}
	.screen {
		position: absolute;
		inset: 0;
		border-radius: 14px 14px 0 0;
		background: #fff;
		border: 1px solid #e8e2d8;
		border-bottom: none;
		padding: 8px 8px 6px;
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.1);
		backface-visibility: hidden;
	}
	.deck {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: 292px;
		height: 11px;
		border-radius: 2px 2px 12px 12px;
		background: #fff;
		border: 1px solid #e8e2d8;
		box-shadow: 0 8px 18px rgba(22, 40, 60, 0.09);
	}
	.pad {
		width: 52px;
		height: 4px;
		border-radius: 0 0 5px 5px;
		background: #e8e2d8;
	}

	/* one lonely system filling the whole screen */
	.single {
		position: relative;
		display: flex;
		height: 100%;
		flex-direction: column;
		border-radius: 9px;
		background: #f7f6f2;
		overflow: hidden;
	}
	.shead {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 9px;
		background: #fff;
		border-bottom: 1px solid #efeae1;
	}
	.sled {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #3a9c64;
	}
	.stab {
		width: 64px;
		height: 8px;
		border-radius: 4px;
		background: #e8e2d8;
	}
	.sbody {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
		padding: 10px 14px 30px;
	}
	.bar {
		height: 9px;
		border-radius: 5px;
		background: #e3ddd3;
	}
	.bar.title {
		width: 55%;
		height: 10px;
		background: #c9d6ea;
	}
	.bar.w85 {
		width: 85%;
	}
	.bar.w70 {
		width: 70%;
	}
	.scap {
		position: absolute;
		bottom: 8px;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.2;
	}
	.scap b {
		font-size: 11px;
		font-weight: 800;
		color: #16212b;
	}
	.scap span {
		font-size: 9px;
		color: #8a949d;
	}

	/* the screen split into four VMs, two up two down */
	.grid4 {
		display: grid;
		height: 100%;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 6px;
	}
	.vm {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-radius: 9px;
		border: 1.5px solid var(--a);
		background: color-mix(in srgb, var(--a) 7%, #fff);
		padding: 5px 7px;
		animation: vmpop 0.35s ease;
	}
	@keyframes vmpop {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.vhead {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.vled {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--a);
	}
	.vtab {
		width: 26px;
		height: 5px;
		border-radius: 3px;
		background: color-mix(in srgb, var(--a) 25%, #fff);
	}
	.vbar {
		height: 4px;
		border-radius: 2px;
		background: color-mix(in srgb, var(--a) 18%, #fff);
	}
	.vbar.w80 {
		width: 80%;
	}
	.vbar.w60 {
		width: 60%;
	}
	.vfoot {
		margin-top: auto;
		display: flex;
		align-items: baseline;
		gap: 4px;
		line-height: 1;
	}
	.vfoot b {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--a);
	}
	.vfoot span {
		font-size: 7.5px;
		color: #8a949d;
	}
	.slot {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9px;
		border: 1.5px solid #ece5d8;
		color: #cfc7b8;
		font-size: 17px;
		font-weight: 700;
	}
	/* the four cells slice into being the moment virtualization kicks in */
	.grid4 .slot {
		animation: slicein 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
	}
	.grid4 .slot:nth-child(1) {
		animation-delay: 0.04s;
	}
	.grid4 .slot:nth-child(2) {
		animation-delay: 0.12s;
	}
	.grid4 .slot:nth-child(3) {
		animation-delay: 0.2s;
	}
	.grid4 .slot:nth-child(4) {
		animation-delay: 0.28s;
	}
	@keyframes slicein {
		from {
			opacity: 0;
			transform: scale(0.55);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* the virtualization layer the VMs sit on, above the one physical machine */
	.vlayer {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 244px;
		padding: 6px 14px;
		border-radius: 11px;
		background: #eaf1fc;
		border: 1px solid #bcd6f5;
		line-height: 1.15;
		animation: layerin 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.vlayer-name {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.02em;
		color: #2e6fe0;
	}
	.vlayer-sub {
		font-size: 9px;
		font-weight: 600;
		color: #6a8fc4;
	}
	@keyframes layerin {
		from {
			opacity: 0;
			transform: translateY(-7px) scaleX(0.8);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 5px;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 2px 10px;
		font-size: 10px;
		font-weight: 700;
		color: #5e6b76;
		font-variant-numeric: tabular-nums;
	}
	.chip.dark {
		background: #16212b;
		border-color: #16212b;
		color: #fff;
	}
	.chip.per {
		border-color: #cdddf6;
		background: #eaf1fc;
		color: #2e6fe0;
		animation: vmpop 0.3s ease;
	}

	.gauge {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.gtrack {
		position: relative;
		width: 150px;
		height: 8px;
		border-radius: 999px;
		background: #f1ede5;
		overflow: hidden;
	}
	.gtrack i {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: #2e6fe0;
		transition: width 0.5s ease;
	}
	.gnum {
		font-size: 10.5px;
		font-weight: 700;
		color: #5e6b76;
		font-variant-numeric: tabular-nums;
	}

	.cap {
		min-height: 1.4em;
		font-size: 12px;
		font-weight: 600;
		color: #8a949d;
		text-align: center;
	}
	.cap.full {
		color: #2f7d54;
	}

	@media (prefers-reduced-motion: reduce) {
		.vm,
		.vlayer,
		.grid4 .slot {
			animation-duration: 0.01s;
		}
		.lid {
			transition-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.lid {
			width: 330px;
			height: 212px;
		}
		.vlayer {
			width: 320px;
			padding: 7px 16px;
		}
		.vlayer-name {
			font-size: 13px;
		}
		.vlayer-sub {
			font-size: 10.5px;
		}
		.deck {
			width: 380px;
			height: 13px;
		}
		.pad {
			width: 66px;
		}
		.scap b {
			font-size: 13px;
		}
		.scap span {
			font-size: 11px;
		}
		.vfoot b {
			font-size: 12px;
		}
		.vfoot span {
			font-size: 9.5px;
		}
		.vbar {
			height: 5px;
		}
		.vled {
			width: 6px;
			height: 6px;
		}
		.vtab {
			width: 34px;
			height: 6px;
		}
		.chip {
			font-size: 12px;
			padding: 3px 12px;
		}
		.gtrack {
			width: 210px;
		}
		.gnum {
			font-size: 12.5px;
		}
		.cap {
			font-size: 14px;
		}
	}
	.dark .lidback {
		background: #1b2533;
		border-color: #2c3746;
	}
	.dark .screen {
		background: #1b2533;
		border-color: #2c3746;
	}
	.dark .deck {
		background: #1b2533;
		border-color: #2c3746;
	}
	.dark .pad {
		background: #3a4a5c;
	}
	.dark .single {
		background: #141c2a;
	}
	.dark .shead {
		background: #1b2533;
		border-bottom-color: #2c3746;
	}
	.dark .stab {
		background: #3a4a5c;
	}
	.dark .bar {
		background: #2c3746;
	}
	.dark .bar.title {
		background: #1a2d4a;
	}
	.dark .scap b {
		color: #e0dcd4;
	}
	.dark .scap span {
		color: #6b7885;
	}
	.dark .vm {
		background: color-mix(in srgb, var(--a) 7%, #1b2533);
	}
	.dark .vtab {
		background: color-mix(in srgb, var(--a) 25%, #1b2533);
	}
	.dark .vbar {
		background: color-mix(in srgb, var(--a) 18%, #1b2533);
	}
	.dark .vfoot span {
		color: #6b7885;
	}
	.dark .slot {
		border-color: #2c3746;
		color: #4a5560;
	}
	.dark .vlayer {
		background: #1a2d4a;
		border-color: #2c4a6e;
	}
	.dark .vlayer-name {
		color: #7daae0;
	}
	.dark .vlayer-sub {
		color: #5a8fd4;
	}
	.dark .chip {
		border-color: #2c3746;
		background: #1b2533;
		color: #97a3ae;
	}
	.dark .chip.per {
		border-color: #2c4a6e;
		background: #1a2d4a;
		color: #7daae0;
	}
	.dark .gtrack {
		background: #2c3746;
	}
	.dark .gnum {
		color: #97a3ae;
	}
	.dark .cap {
		color: #6b7885;
	}
	.dark .cap.full {
		color: #5bb87e;
	}
</style>
