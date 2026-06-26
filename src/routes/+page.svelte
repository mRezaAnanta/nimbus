<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { lang, t, setLang } from '$lib/i18n';
	import { theme } from '$lib/theme.svelte';
	import { chapters } from '$lib/chapters';
	import Nim from '$lib/components/Nim.svelte';
	import ProgressDots from '$lib/components/ProgressDots.svelte';

	const first = chapters[0];
	const target = `/${first.id}/${first.lessons[0].id}`;

	let beat = $state(0);
	// on a phone, Nim adds a cheeky note recommending a bigger screen, and sizing adapts
	let small = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		small = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (small = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	const lines = $derived(small ? [...$t.welcome, $t.welcomeMobile] : $t.welcome);
	const shown = $derived(Math.min(beat, lines.length - 1));
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
	style="background: radial-gradient(120% 90% at 75% 8%, var(--bg-grad-1) 0%, var(--bg-grad-2) 55%, var(--bg-grad-3) 100%);"
>
	<header class="z-20 flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
		<span class="font-display text-lg font-semibold tracking-tight">Nimbus</span>
		<div class="flex items-center gap-2">
			<button
				onclick={() => theme.toggle()}
				class="flex h-7 w-7 items-center justify-center rounded-full text-faint transition-colors hover:text-ink"
				aria-label="Toggle theme"
			>
				{#if $theme === 'light'}
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
					>
				{:else}
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="12" cy="12" r="5" /><path
							d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
						/></svg
					>
				{/if}
			</button>
			<div
				class="flex items-center gap-0.5 rounded-full border border-line p-0.5 text-[11px] font-bold backdrop-blur"
				style="background: var(--header-btn-bg);"
			>
				<button
					onclick={() => setLang('id')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'id' ? 'text-white' : 'text-faint hover:text-ink'}"
					style={$lang === 'id' ? 'background: var(--toggle-active);' : ''}
				>
					ID
				</button>
				<button
					onclick={() => setLang('en')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'en' ? 'text-white' : 'text-faint hover:text-ink'}"
					style={$lang === 'en' ? 'background: var(--toggle-active);' : ''}
				>
					EN
				</button>
			</div>
		</div>
	</header>

	<main class="flex flex-1 flex-col items-center justify-center gap-1 px-5 pb-8">
		<!-- Nim, bobbing (glides to the lesson corner via the view transition) -->
		<div class="float shrink-0" style="view-transition-name: nim">
			<Nim mood="happy" size={small ? 128 : 164} />
		</div>

		<!-- speech cloud -->
		<div class="w-full max-w-md" style="filter: drop-shadow(0 16px 32px rgba(22,40,60,0.13));">
			<div class="bg-card relative rounded-[30px]">
				<!-- puffs: a little tail rising toward Nim, plus soft cloud edges -->
				<span class="bg-card absolute -top-3 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full"></span>
				<span class="bg-card absolute -top-7 left-[41%] h-5 w-5 rounded-full"></span>
				<span class="bg-card absolute -top-10 left-[45%] h-3 w-3 rounded-full"></span>
				<span class="bg-card absolute -top-2 left-9 h-6 w-6 rounded-full"></span>
				<span class="bg-card absolute -top-2 right-11 h-5 w-5 rounded-full"></span>
				<span class="bg-card absolute -bottom-2.5 left-12 h-4 w-4 rounded-full"></span>
				<span class="bg-card absolute -bottom-2.5 right-16 h-3 w-3 rounded-full"></span>

				<div class="relative px-6 py-5 md:px-7 md:py-6">
					<p class="text-brand text-[11px] font-bold tracking-widest uppercase">Nim</p>
					{#key shown}
						<p in:fade={{ duration: 220 }} class="text-ink/90 mt-1.5 min-h-[6.5rem] text-[15.5px] leading-relaxed md:min-h-[5rem]">
							{@html lines[shown]}
						</p>
					{/key}

					<div class="mt-3.5 flex items-center justify-between md:mt-4">
						<ProgressDots total={lines.length} current={beat} />
						<button
							onclick={next}
							class="bg-brand rounded-xl px-7 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_rgba(28,74,160,0.5)] transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(28,74,160,0.5)]"
						>
							{isLast ? $t.start : $t.next}
						</button>
					</div>
				</div>
			</div>
		</div>
	</main>

	<p class="text-faint pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px]">
		{#if $lang === 'id'}
			{small ? 'Ketuk Lanjut untuk mulai' : 'Tekan Spasi atau klik untuk lanjut'}
		{:else}
			{small ? 'Tap Next to begin' : 'Press Space or click to continue'}
		{/if}
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
	@media (prefers-reduced-motion: reduce) {
		.float {
			animation: none;
		}
	}
</style>
