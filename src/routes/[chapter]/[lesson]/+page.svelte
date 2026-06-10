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
	let reactionToken = $state<string | null>(null);
	let completed = $state(false);
	// A stage can lock Next (during an intro animation) and ask to be shown on an early beat.
	let locked = $state(false);
	let shown = $state(false);
	// reset when the lesson (URL) changes
	$effect(() => {
		void data.lessonId;
		beat = 0;
		reaction = null;
		reactionToken = null;
		completed = false;
	});

	const isLastBeat = $derived(beat >= text.intro.length - 1);
	const isLastLesson = $derived(data.index === data.total - 1);
	const canNext = $derived(!((isLastBeat && !completed) || locked));
	const final = $derived(isLastLesson && isLastBeat);
	const canBack = $derived(beat > 0 || data.index > 0);
	const message = $derived(reaction ?? text.intro[Math.min(beat, text.intro.length - 1)]);
	// "Your turn": on the last beat, once Nim has said its piece and is waiting for you to act
	// (no reaction showing yet), Nim steps out so the whole stage is free to play with. A tap
	// brings the bubble back, and any reaction or completion pops it back on its own.
	const aside = $derived(isLastBeat && !completed && reaction === null);
	// Stage stays locked + dimmed while Nim is still narrating; it unlocks on the last beat,
	// the one that invites interaction, or earlier if the stage asks to be shown (an intro).
	const stageActive = $derived(isLastBeat || shown);
	// Nim's face: a reaction mood if one is showing, else this beat's mood, else the lesson default.
	const currentMood = $derived(
		(reactionToken ? lesson.reactionMood?.[reactionToken] : undefined) ??
			lesson.moods?.[Math.min(beat, (lesson.moods?.length ?? 1) - 1)] ??
			lesson.mood
	);

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
		reactionToken = s;
		reaction = text.reactions[s] ?? null;
	}
	function next() {
		reaction = null;
		reactionToken = null;
		if (beat < text.intro.length - 1) {
			beat += 1;
			return;
		}
		shown = false;
		locked = false;
		if (isLastLesson) goto(`/${chapter.id}/done`);
		else goto(`/${chapter.id}/${chapter.lessons[data.index + 1].id}`);
	}
	function back() {
		reaction = null;
		reactionToken = null;
		if (beat > 0) {
			beat -= 1;
			return;
		}
		shown = false;
		locked = false;
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

	<!-- Stage. Sits between the title and Nim and is bounded so neither ever gets pushed off screen. -->
	<section class="flex min-h-0 flex-1 items-start justify-center overflow-hidden px-4 pb-4 pt-2 md:px-8 md:pb-6 md:pt-5">
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

	<!-- Nim + cloud bubble: floats in the bottom-left corner (every screen) so Nim stays put and
	     the stage never resizes when the bubble pops in or out. The wrapper ignores pointer events
	     so taps fall through to the stage; only Nim and the bubble themselves are interactive.
	     Safe-area padding keeps it clear of the phone's home bar. -->
	<div
		class="pointer-events-none absolute bottom-0 left-0 z-10 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] md:bottom-5 md:left-5 md:px-0 md:pb-0"
	>
		<SpeechBubble nim={message} mood={currentMood} {canNext} {canBack} {final} {aside} onnext={next} onback={back} />
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
