<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { lang, t, setLang } from '$lib/i18n';
	import { chapters } from '$lib/chapters';
	import Nim from '$lib/components/Nim.svelte';
	import ProgressDots from '$lib/components/ProgressDots.svelte';

	const first = chapters[0];
	const target = `/${first.id}/${first.lessons[0].id}`;

	let beat = $state(0);
	const lines = $derived($t.welcome);
	const isLast = $derived(beat >= lines.length - 1);

	function next() {
		if (!isLast) {
			beat += 1;
			return;
		}
		// The view transition in the root layout glides Nim from here to the lesson corner.
		goto(target);
	}
	function onKey(e: KeyboardEvent) {
		if (e.code === 'Space') {
			e.preventDefault();
			next();
		}
	}
</script>

<svelte:head>
	<title>Nimbus: learn cloud by playing</title>
</svelte:head>

<svelte:window onkeydown={onKey} />

<div
	class="relative flex min-h-dvh flex-col overflow-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, #eef4fc 0%, #f6f4ee 55%, #faf9f6 100%);"
>
	<header class="z-20 flex shrink-0 items-center justify-between px-5 pt-4 md:px-8">
		<span class="font-display text-lg font-semibold tracking-tight">Nimbus</span>
		<div class="border-line flex items-center gap-0.5 rounded-full border bg-white/70 p-0.5 text-[11px] font-bold backdrop-blur">
			<button
				onclick={() => setLang('id')}
				class="rounded-full px-2 py-0.5 transition-colors {$lang === 'id' ? 'bg-ink text-white' : 'text-faint hover:text-ink'}"
			>
				ID
			</button>
			<button
				onclick={() => setLang('en')}
				class="rounded-full px-2 py-0.5 transition-colors {$lang === 'en' ? 'bg-ink text-white' : 'text-faint hover:text-ink'}"
			>
				EN
			</button>
		</div>
	</header>

	<main class="flex flex-1 items-center justify-center p-6">
		<div class="flex items-end gap-2">
			<!-- Nim, bobbing (glides to the lesson corner via the view transition) -->
			<div class="float shrink-0 self-end" style="view-transition-name: nim">
				<Nim mood="happy" size={180} />
			</div>

			<!-- cloud bubble -->
			<div class="mb-10 w-full max-w-md" style="filter: drop-shadow(0 12px 26px rgba(22,40,60,0.14));">
				<div class="bg-card relative rounded-[28px]">
					<span class="bg-card absolute -top-3 left-8 h-7 w-7 rounded-full"></span>
					<span class="bg-card absolute -top-5 left-16 h-10 w-10 rounded-full"></span>
					<span class="bg-card absolute -top-2.5 right-14 h-6 w-6 rounded-full"></span>
					<span class="bg-card absolute -bottom-3 left-7 h-4 w-4 rounded-full"></span>
					<span class="bg-card absolute -bottom-8 left-2 h-3 w-3 rounded-full"></span>

					<div class="relative px-6 py-5">
						<p class="text-faint text-[11px] font-bold tracking-widest uppercase">Nim</p>
						{#key beat}
							<p in:fade={{ duration: 220 }} class="text-ink/90 mt-1.5 min-h-[5rem] text-[15.5px] leading-relaxed">
								{@html lines[beat]}
							</p>
						{/key}

						<div class="mt-4 flex items-center justify-between">
							<ProgressDots total={lines.length} current={beat} />
							<button
								onclick={next}
								class="bg-brand rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_rgba(28,74,160,0.5)] transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(28,74,160,0.5)]"
							>
								{isLast ? $t.start : $t.next}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<p class="text-faint pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px]">
		{$lang === 'id' ? 'Tekan Spasi atau klik untuk lanjut' : 'Press Space or click to continue'}
	</p>
</div>

<style>
	.float {
		animation: float 3s ease-in-out infinite;
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-9px);
		}
	}
</style>
