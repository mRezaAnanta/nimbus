<script lang="ts">
	import { fade } from 'svelte/transition';
	import Nim from './Nim.svelte';
	import { t } from '$lib/i18n';

	type Mood = 'calm' | 'happy' | 'thinking';
	let {
		nim,
		mood = 'calm',
		canNext = false,
		canBack = false,
		final = false,
		onnext,
		onback
	}: {
		nim: string;
		mood?: Mood;
		canNext?: boolean;
		canBack?: boolean;
		final?: boolean;
		onnext?: () => void;
		onback?: () => void;
	} = $props();
</script>

<div class="flex items-end gap-2">
	<!-- Nim, the character (shared element that glides in from the landing page) -->
	<div class="shrink-0 self-end" style="view-transition-name: nim">
		<span class="block md:hidden"><Nim {mood} size={64} /></span>
		<span class="hidden md:block"><Nim {mood} size={116} /></span>
	</div>

	<!-- Cloud-shaped speech bubble (lifted above Nim, tail points down to him) -->
	<div class="mb-8 min-w-0 max-w-[340px] flex-1 md:mb-12 md:flex-none" style="filter: drop-shadow(0 10px 22px rgba(22,40,60,0.13));">
		<div class="bg-card relative rounded-[26px]">
			<!-- cloud bumps (top) -->
			<span class="bg-card absolute -top-2.5 left-7 h-6 w-6 rounded-full"></span>
			<span class="bg-card absolute -top-4 left-14 h-9 w-9 rounded-full"></span>
			<span class="bg-card absolute -top-2 right-12 h-5 w-5 rounded-full"></span>
			<!-- trailing dots going down to Nim -->
			<span class="bg-card absolute -bottom-3 left-6 h-3.5 w-3.5 rounded-full"></span>
			<span class="bg-card absolute -bottom-7 left-2 h-2.5 w-2.5 rounded-full"></span>

			<div class="relative px-5 py-4">
				<p class="text-faint text-[11px] font-bold tracking-widest uppercase">Nim</p>
				{#key nim}
					<p in:fade={{ duration: 200 }} class="text-ink/90 mt-1 min-h-[4.5rem] text-[14.5px] leading-relaxed">{@html nim}</p>
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
</div>
