<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { lang, t } from '$lib/i18n';
	import { chapters } from '$lib/chapters';
	import { progress } from '$lib/progress.svelte';
	// NOTE: lesson locking is temporarily disabled (see the menu list below), so `globalIndexOf`
	// and `progress.isUnlocked` are not imported for now.

	let menuOpen = $state(false);

	const curChapter = $derived(page.params.chapter);
	const curLesson = $derived(page.params.lesson);
	const pct = $derived(
		progress.total ? Math.round((progress.doneCount / progress.total) * 100) : 0
	);

	function go(chapterId: string, lessonId: string, unlocked: boolean) {
		if (!unlocked) return;
		menuOpen = false;
		if (chapterId === curChapter && lessonId === curLesson) return;
		goto(`/${chapterId}/${lessonId}`);
	}
	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window onkeydown={onKey} />

<button
	type="button"
	onclick={() => (menuOpen = true)}
	aria-label={$t.lessons}
	class="header-btn flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink backdrop-blur transition-colors"
>
	<svg
		width="17"
		height="17"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.2"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<path d="M4 7h16M4 12h16M4 17h16" />
	</svg>
</button>

{#if menuOpen}
	<div
		class="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
		transition:fade={{ duration: 180 }}
		onclick={() => (menuOpen = false)}
		role="presentation"
	></div>

	<aside
		class="fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-[330px] flex-col bg-paper shadow-2xl"
		transition:fly={{ x: -360, duration: 260 }}
		aria-label={$t.lessons}
	>
		<!-- header with overall progress -->
		<div class="px-5 pt-[max(1.1rem,env(safe-area-inset-top))] pb-4">
			<div class="flex items-center justify-between">
				<p class="font-display text-lg font-semibold text-ink">{$t.lessons}</p>
				<button
					type="button"
					onclick={() => (menuOpen = false)}
					aria-label="Close"
					class="-mr-1 flex h-8 w-8 items-center justify-center rounded-full text-faint transition-colors hover:bg-white hover:text-ink"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.4"
						stroke-linecap="round"
						aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" /></svg
					>
				</button>
			</div>
			<div class="mt-3 flex items-center gap-2.5">
				<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
					<div
						class="h-full rounded-full bg-brand transition-all duration-500"
						style="width:{pct}%"
					></div>
				</div>
				<span class="text-[11px] font-semibold text-faint tabular-nums"
					>{progress.doneCount}/{progress.total}</span
				>
			</div>
		</div>

		<nav class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
			{#each chapters as ch (ch.id)}
				{@const chDone = ch.lessons.filter((l) => progress.isDone(ch.id, l.id)).length}
				<section class="mb-2">
					<!-- chapter header -->
					<div class="flex items-center gap-2.5 py-1.5">
						<span
							class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-bold text-brand"
						>
							{#if ch.unnumbered}
								<svg
									width="13"
									height="13"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
									><path
										d="M12 3.5l2.6 5.2 5.8.85-4.2 4.1 1 5.75L12 21.7l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85Z"
									/></svg
								>
							{:else}
								{ch.number}
							{/if}
						</span>
						<span class="flex-1 font-display text-sm font-semibold text-ink">{ch.title[$lang]}</span
						>
						<span class="text-[11px] text-faint tabular-nums">{chDone}/{ch.lessons.length}</span>
					</div>

					<!-- lessons, indented under a guide line -->
					<div class="ml-3 border-l border-line pl-3">
						{#each ch.lessons as l, i (l.id)}
							{@const isDoneL = progress.isDone(ch.id, l.id)}
							<!-- Lesson locking temporarily disabled so any lesson is reachable without
							     finishing the previous one. To restore sequential unlocking, re-add the
							     globalIndexOf import and set unlocked via
							     progress.isUnlocked(globalIndexOf(ch.id, l.id)) instead of true. -->
							{@const unlocked = true}
							{@const current = ch.id === curChapter && l.id === curLesson}
							{@const newSection =
								l.section && l.section !== (i > 0 ? ch.lessons[i - 1].section : undefined)}
							{#if newSection}
								<div
									class="mt-2 mb-0.5 flex items-center gap-1.5 pl-0.5 text-[10.5px] font-bold tracking-wider text-faint uppercase"
								>
									<svg
										width="11"
										height="11"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.4"
										stroke-linecap="round"
										aria-hidden="true"><path d="M7 4v7a4 4 0 0 0 4 4h7" /></svg
									>
									{l.section}
								</div>
							{/if}
							<div class={l.section ? 'ml-1.5 border-l border-line pl-2.5' : ''}>
								<button
									type="button"
									onclick={() => go(ch.id, l.id, unlocked)}
									disabled={!unlocked && !current}
									aria-current={current ? 'page' : undefined}
									title={unlocked ? undefined : $t.locked}
									class="my-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] leading-snug transition-colors {current
										? 'bg-brand-soft font-semibold text-brand'
										: isDoneL
											? 'text-muted hover:bg-white'
											: unlocked
												? 'text-ink hover:bg-white'
												: 'cursor-not-allowed text-faint'}"
								>
									<span class="flex h-4 w-4 shrink-0 items-center justify-center">
										{#if current}
											<svg
												width="9"
												height="9"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden="true"><path d="M7 5l12 7-12 7Z" /></svg
											>
										{:else if isDoneL}
											<svg
												class="text-grass"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
											>
										{:else if unlocked}
											<span class="h-2.5 w-2.5 rounded-full border-[1.5px] border-faint/70"></span>
										{:else}
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												aria-hidden="true"
												class="opacity-70"
												><rect x="5" y="11" width="14" height="9" rx="2" /><path
													d="M8 11V8a4 4 0 0 1 8 0v3"
												/></svg
											>
										{/if}
									</span>
									<span class="truncate">{l.text[$lang].title}</span>
								</button>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</nav>
	</aside>
{/if}

<style>
	.header-btn {
		background: var(--header-btn-bg);
	}
	.header-btn:hover {
		background: var(--header-btn-hover);
	}
</style>
