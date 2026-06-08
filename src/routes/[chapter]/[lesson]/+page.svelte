<script lang="ts">
	import { goto } from '$app/navigation';
	import { lang, t } from '$lib/i18n';
	import { getChapter } from '$lib/chapters';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const chapter = $derived(getChapter(data.chapterId)!);
	const lesson = $derived(chapter.lessons[data.index]);
	const Stage = $derived(lesson.stage);
	const text = $derived(lesson.text[$lang]);
	// "Next" both paginates the narrative beats and, on the last beat, advances the lesson.
	let beat = $state(0);
	let reaction = $state<string | null>(null);
	let completed = $state(false);
	// A stage can lock Next (during an intro animation) and ask to be shown on an early beat.
	let locked = $state(false);
	let shown = $state(false);
	// reset when the lesson (URL) changes
	$effect(() => {
		void data.lessonId;
		beat = 0;
		reaction = null;
		completed = false;
		locked = false;
		shown = false;
	});

	const isLastBeat = $derived(beat >= text.intro.length - 1);
	const isLastLesson = $derived(data.index === data.total - 1);
	const canNext = $derived(!((isLastBeat && !completed) || locked));
	const final = $derived(isLastLesson && isLastBeat);
	const canBack = $derived(beat > 0 || data.index > 0);
	const message = $derived(reaction ?? text.intro[Math.min(beat, text.intro.length - 1)]);
	// Stage stays locked + dimmed while Nim is still narrating; it unlocks on the last beat,
	// the one that invites interaction, or earlier if the stage asks to be shown (an intro).
	const stageActive = $derived(isLastBeat || shown);

	function onComplete() {
		completed = true;
	}
	function onLock(v: boolean) {
		locked = v;
	}
	function onShow(v: boolean) {
		shown = v;
	}
	function onState(s: string) {
		reaction = text.reactions[s] ?? null;
	}
	function next() {
		reaction = null;
		if (beat < text.intro.length - 1) {
			beat += 1;
			return;
		}
		if (isLastLesson) goto(`/${chapter.id}/done`);
		else goto(`/${chapter.id}/${chapter.lessons[data.index + 1].id}`);
	}
	function back() {
		reaction = null;
		if (beat > 0) {
			beat -= 1;
			return;
		}
		if (data.index > 0) goto(`/${chapter.id}/${chapter.lessons[data.index - 1].id}`);
	}
	function onKey(e: KeyboardEvent) {
		if (e.code === 'Space') {
			e.preventDefault();
			if (canNext) next();
		}
	}
</script>

<svelte:head>
	<title>Nimbus: {text.title}</title>
</svelte:head>

<svelte:window onkeydown={onKey} />

<main class="relative flex min-h-0 flex-1 flex-col">
	<!-- Title band (in normal flow, never overlaps the stage) -->
	<div class="shrink-0 px-4 pt-3 pb-1 text-center">
		<p class="text-faint text-[11px] font-semibold tracking-widest uppercase">
			{$t.chapter} {chapter.number}: {chapter.title[$lang]}
		</p>
		<h1 class="font-display text-ink mt-1 text-2xl font-medium md:text-[1.9rem]">{text.title}</h1>
	</div>

	<!-- Stage. Content aligns to the top (region fills via h-full); never far from the title. -->
	<section class="flex min-h-[40vh] flex-1 items-start justify-center px-4 pb-4 pt-2 md:min-h-0 md:px-8 md:pb-6 md:pt-5">
		{#key data.lessonId}
			<div class="stage-in h-full w-full">
				<div
					class="flex h-full w-full items-start justify-center transition-opacity duration-300 {stageActive
						? ''
						: 'pointer-events-none opacity-40 select-none'}"
				>
					<Stage {text} {beat} oncomplete={onComplete} onstate={onState} onlock={onLock} onshow={onShow} />
				</div>
			</div>
		{/key}
	</section>

	<!-- Nim + cloud bubble (bottom-left) -->
	<div class="z-10 shrink-0 p-4 md:absolute md:bottom-5 md:left-5 md:p-0">
		<SpeechBubble nim={message} mood={lesson.mood} {canNext} {canBack} {final} onnext={next} onback={back} />
	</div>
</main>

<style>
	:global(.stage-in) {
		animation: stage-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes stage-in {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
