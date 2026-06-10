<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Nim from './Nim.svelte';
	import { t } from '$lib/i18n';
	import type { Mood } from '$lib/chapters/types';

	let {
		nim,
		mood = 'calm',
		canNext = false,
		canBack = false,
		final = false,
		aside = false,
		onnext,
		onback
	}: {
		nim: string;
		mood?: Mood;
		canNext?: boolean;
		canBack?: boolean;
		final?: boolean;
		aside?: boolean;
		onnext?: () => void;
		onback?: () => void;
	} = $props();

	// Small screens only: that is where the bubble would otherwise cover the stage, so the
	// moderator-style auto close applies there. On desktop the bubble stays in its corner.
	let isMobile = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		const sync = () => (isMobile = mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	// Game-like companion: Nim sits pinned in the bottom-left corner and never moves; the cloud
	// bubble floats above it without resizing the stage. On a phone, when it is the learner's turn
	// (aside), Nim says its line, waits long enough to read it, then steps out on its own like a
	// game moderator so the stage gets full focus. A tap on Nim takes over for the current line;
	// any new line (a beat or a reaction) clears that, so reactions and completion pop Nim back.
	let override = $state<{ line: string; open: boolean } | null>(null);
	let autoHidden = $state<string | null>(null);
	const moderated = $derived(aside && isMobile);
	const base = $derived(moderated ? autoHidden !== nim : true);
	const open = $derived(override?.line === nim ? override.open : base);

	// A brief, snappy peek scaled a little to length (markup stripped), then Nim ducks out.
	function readMs(html: string) {
		const words = html
			.replace(/<[^>]*>/g, '')
			.trim()
			.split(/\s+/)
			.filter(Boolean).length;
		return Math.min(3500, Math.max(1300, 500 + words * 130));
	}

	$effect(() => {
		// Schedule the auto close once per line, only while moderated and not under a manual tap.
		if (!moderated || override?.line === nim || autoHidden === nim) return;
		const line = nim;
		const id = setTimeout(() => (autoHidden = line), readMs(line));
		return () => clearTimeout(id);
	});

	function toggle() {
		override = { line: nim, open: !open };
	}
</script>

<div class="flex flex-col items-start gap-1.5 md:flex-row md:items-end md:gap-2">
	<!-- Cloud-shaped speech bubble: above Nim on mobile, beside (lifted) on desktop -->
	{#if open}
		<div
			transition:fly={{ y: 18, duration: 260, easing: cubicOut }}
			class="pointer-events-auto order-1 w-[calc(100vw-1.5rem)] max-w-[360px] min-w-0 md:order-2 md:mb-12 md:w-auto md:max-w-[340px]"
			style="filter: drop-shadow(0 10px 22px rgba(22,40,60,0.13));"
		>
			<div class="bg-card relative rounded-[26px]">
				<!-- cloud bumps (top) -->
				<span class="bg-card absolute -top-2.5 left-7 h-6 w-6 rounded-full"></span>
				<span class="bg-card absolute -top-4 left-14 h-9 w-9 rounded-full"></span>
				<span class="bg-card absolute -top-2 right-12 h-5 w-5 rounded-full"></span>
				<!-- trailing dots going down to Nim -->
				<span class="bg-card absolute -bottom-3 left-6 h-3.5 w-3.5 rounded-full"></span>
				<span class="bg-card absolute -bottom-7 left-2 h-2.5 w-2.5 rounded-full"></span>

				<div class="relative px-5 py-4">
					<div class="flex items-center justify-between">
						<p class="text-faint text-[11px] font-bold tracking-widest uppercase">Nim</p>
						<!-- send Nim "out": collapse the bubble to give the stage room -->
						<button
							onclick={toggle}
							aria-label={$t.hideNim}
							class="text-faint hover:text-ink -mr-1.5 -mt-1 rounded-full p-1.5 transition-colors"
						>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
								<path d="M3 5.5l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</button>
					</div>

					{#key nim}
						<p in:fade={{ duration: 200 }} class="text-ink/90 mt-1 min-h-[3.5rem] text-[14.5px] leading-relaxed md:min-h-[4.5rem]">
							{@html nim}
						</p>
					{/key}

					<div class="mt-3 flex items-center justify-end gap-2">
						{#if canBack}
							<button
								onclick={onback}
								class="text-muted hover:text-ink rounded-lg px-3 py-2 text-sm font-medium transition-colors"
							>
								{$t.back}
							</button>
						{/if}
						<button
							onclick={onnext}
							disabled={!canNext}
							class="bg-brand rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_rgba(28,74,160,0.5)] transition-all enabled:hover:brightness-110 enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0_rgba(28,74,160,0.5)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
						>
							{final ? $t.finish : $t.next}
						</button>
					</div>

					{#if !canNext}
						<p class="text-faint mt-2 text-right text-[11px]">{$t.completeHint}</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Nim, the character: pinned bottom-left, shared element that glides between pages.
	     Tap to toggle the bubble (bring it back when it has stepped out). -->
	<button
		type="button"
		onclick={toggle}
		aria-label={open ? $t.hideNim : $t.showNim}
		aria-expanded={open}
		class="pointer-events-auto order-2 shrink-0 self-start outline-none md:order-1 md:self-end"
		class:nim-call={!open}
		style="view-transition-name: nim;"
	>
		<span class="block md:hidden"><Nim {mood} size={58} /></span>
		<span class="hidden md:block"><Nim {mood} size={112} /></span>
		{#if !open}
			<!-- a soft pulse that invites tapping Nim back open -->
			<span class="ping" aria-hidden="true"></span>
		{/if}
	</button>
</div>

<style>
	button {
		position: relative;
		-webkit-tap-highlight-color: transparent;
	}
	/* gentle bob to signal Nim is waiting when the bubble is out */
	.nim-call {
		animation: nim-bob 2.4s ease-in-out infinite;
	}
	@keyframes nim-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}
	.ping {
		position: absolute;
		top: 6px;
		right: 6px;
		height: 9px;
		width: 9px;
		border-radius: 9999px;
		background: var(--color-brand);
		box-shadow: 0 0 0 0 rgba(46, 111, 224, 0.5);
		animation: nim-ping 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
	}
	@keyframes nim-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0.45);
		}
		70% {
			box-shadow: 0 0 0 9px rgba(46, 111, 224, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.nim-call,
		.ping {
			animation: none;
		}
	}
</style>
