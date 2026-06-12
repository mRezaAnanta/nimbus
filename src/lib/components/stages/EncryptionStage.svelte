<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { EncryptionText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as EncryptionText);

	let encrypted = $state(false);
	// 'idle' = before send, 'flying' = packet on the wire, 'arrived' = at recipient
	let phase = $state<'idle' | 'flying' | 'arrived'>('idle');
	let sending = $state(false);
	let sentEncrypted = $state(false); // did the last completed send use encryption
	let fired = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// Deterministic "ciphertext" from the sample text, just for show.
	const CIPHER = 'X9#fK2qL7%vmZ4tA';
	// what the eavesdropper sees once a message is on the wire / delivered
	const wireText = $derived(sentEncrypted ? CIPHER : tx.sample);
	const recipientText = $derived(phase === 'idle' ? '' : tx.sample); // recipient always reads plaintext (has key)
	const showWire = $derived(phase !== 'idle');

	function send() {
		if (sending) return;
		sending = true;
		sentEncrypted = encrypted;
		phase = 'flying';
		timers.push(
			setTimeout(() => {
				phase = 'arrived';
				sending = false;
				if (sentEncrypted) {
					onstate?.('encrypted');
					if (!fired) {
						fired = true;
						oncomplete?.();
					}
				} else {
					onstate?.('plain');
				}
			}, 1500)
		);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="mx-auto flex h-full w-full max-w-2xl flex-col gap-4">
	<!-- the wire: you -> recipient, with an eavesdropper underneath -->
	<div class="border-line bg-card relative rounded-2xl border p-4">
		<div class="flex items-center justify-between gap-3">
			<!-- you -->
			<div class="flex shrink-0 flex-col items-center gap-1">
				<div class="bg-brand-soft text-brand grid h-10 w-10 place-items-center rounded-full">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="8" r="4" fill="currentColor" />
						<path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
					</svg>
				</div>
				<span class="text-muted text-[11px] font-semibold">{tx.youLabel}</span>
			</div>

			<!-- connection -->
			<div class="relative h-0.5 flex-1 self-center bg-line">
				<div
					class="packet {phase === 'flying' ? 'fly' : ''}"
					style="opacity:{phase === 'idle' ? 0 : 1}; background:{sentEncrypted ? '#3a9c64' : '#d3584a'};"
				>
					{#if sentEncrypted}
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<rect x="5" y="11" width="14" height="9" rx="2" fill="#fff" />
							<path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#fff" stroke-width="2" fill="none" />
						</svg>
					{:else}
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<rect x="4" y="6" width="16" height="12" rx="2" fill="#fff" />
							<path d="M5 7l7 6 7-6" stroke="#d3584a" stroke-width="1.6" fill="none" />
						</svg>
					{/if}
				</div>
			</div>

			<!-- recipient -->
			<div class="flex shrink-0 flex-col items-center gap-1">
				<div class="bg-grass-soft text-grass grid h-10 w-10 place-items-center rounded-full">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="8" r="4" fill="currentColor" />
						<path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
					</svg>
				</div>
				<span class="text-muted text-[11px] font-semibold">{tx.recipientLabel}</span>
				<span class="text-grass text-[10px] font-semibold">{tx.keyLabel}</span>
			</div>
		</div>

		<!-- recipient readout -->
		<div class="mt-3 min-h-[34px]">
			{#if phase === 'arrived'}
				<div class="border-grass bg-grass-soft rounded-lg border px-3 py-2">
					<p class="text-grass font-mono text-sm font-semibold">{recipientText}</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- eavesdropper -->
	<div
		class="rounded-2xl border p-4 transition-colors {showWire && !sentEncrypted
			? 'border-danger bg-danger-soft'
			: showWire && sentEncrypted
				? 'border-grass bg-grass-soft'
				: 'border-line bg-card'}"
	>
		<div class="flex items-center gap-3">
			<div class="text-faint grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke="currentColor" stroke-width="1.8" fill="none" />
					<circle cx="12" cy="12" r="3" fill="currentColor" />
				</svg>
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-muted text-[11px] font-semibold">{tx.eavesdropperLabel}</p>
				{#if showWire}
					<p
						class="truncate font-mono text-sm font-semibold {sentEncrypted ? 'text-grass' : 'text-danger'}"
						style={sentEncrypted ? 'letter-spacing:0.04em;' : ''}
					>
						{wireText}
					</p>
				{:else}
					<p class="text-faint font-mono text-sm">. . .</p>
				{/if}
			</div>
			{#if showWire}
				<span
					class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold {sentEncrypted
						? 'bg-grass text-white'
						: 'bg-danger text-white'}"
				>
					{sentEncrypted ? tx.scrambledTag : tx.plainTag}
				</span>
			{/if}
		</div>
	</div>

	<!-- controls -->
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<div class="text-faint text-[11px]">
				<span class="text-muted font-semibold">{tx.messageLabel}:</span> {tx.sample}
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => (encrypted = !encrypted)}
				disabled={sending}
				class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 {encrypted
					? 'border-grass bg-grass-soft text-grass'
					: 'border-line bg-paper text-muted hover:border-grass'}"
			>
				<span class="relative inline-block h-3.5 w-6 rounded-full transition-colors {encrypted ? 'bg-grass' : 'bg-line'}">
					<span class="absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-all {encrypted ? 'left-3' : 'left-0.5'}"></span>
				</span>
				{encrypted ? tx.encryptOn : tx.encryptOff}
			</button>
			<button
				type="button"
				onclick={send}
				disabled={sending}
				class="bg-ink shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
			>
				{tx.sendLabel}
			</button>
		</div>
	</div>

	<!-- in transit / at rest footnote -->
	<div class="text-faint flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px]">
		<span>{tx.inTransitNote}</span>
		<span>{tx.atRestNote}</span>
	</div>
</div>

<style>
	.packet {
		position: absolute;
		top: 50%;
		left: 0;
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		margin-top: -11px;
		border-radius: 999px;
		box-shadow: 0 3px 8px rgba(22, 40, 60, 0.18);
		transition: opacity 0.3s ease;
	}
	.packet.fly {
		animation: fly 1.5s ease forwards;
	}
	@keyframes fly {
		0% {
			left: 0;
		}
		100% {
			left: 100%;
		}
	}
</style>
