<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { MicroservicesText } from '$lib/chapters/compute/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as MicroservicesText);

	const PLAY = $derived(tx.intro.length - 1);
	const PAY = $derived(tx.requests.length - 1); // the pay request is the one that breaks

	// 0-1 monolith healthy, 2 monolith breaks, 3 microservices healthy, 4 breaks, 5 recap
	const arch = $derived(beat <= 2 ? 'mono' : 'micro');
	const broken = $derived(beat === 2 || beat === 4);
	const recap = $derived(beat >= 5);

	// a request fails when the program serving it is down. Monolith: one program, so all fail.
	// Microservices: separate programs, so only the pay one fails.
	function laneOk(i: number) {
		if (!broken) return true;
		if (arch === 'mono') return false;
		return i !== PAY;
	}

	$effect(() => {
		onshow?.(true);
		if (beat >= PLAY) oncomplete?.();
	});
</script>

<div class="ms">
	{#if recap}
		<div class="recap">
			<div class="rcard">
				<div class="rmini"><span class="rblock big"></span></div>
				<span class="rname">Monolith</span>
				<p>{tx.recapMono}</p>
			</div>
			<div class="rcard">
				<div class="rmini grid">
					<span class="rblock"></span><span class="rblock"></span>
					<span class="rblock"></span><span class="rblock"></span>
				</div>
				<span class="rname">Microservices</span>
				<p>{tx.recapMicro}</p>
			</div>
		</div>
	{:else}
		<div class="board">
			<div class="heads">
				<span>{tx.userLabel}</span>
				<span>{tx.devLabel}</span>
			</div>
			<div class="lanes">
				<!-- left: users sending requests -->
				<div class="users">
					{#each tx.requests as r, i (r.label)}
						<div class="user">
							<svg viewBox="0 0 24 24" class="person" aria-hidden="true">
								<circle cx="12" cy="8" r="3.4" fill="#9fb0c4" />
								<path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5z" fill="#9fb0c4" />
							</svg>
							<span class="ulab">{r.label}</span>
							<span class="badge" class:ok={laneOk(i)} class:fail={!laneOk(i)}>
								{laneOk(i) ? tx.okTag : tx.failTag}
							</span>
						</div>
					{/each}
				</div>

				<!-- middle: the wires, requests fly across and come back coloured -->
				<div class="wires">
					{#each tx.requests as r, i (r.label)}
						<div class="lane" style="--res:{laneOk(i) ? '#2f8a57' : '#d3584a'}">
							<div class="wire"></div>
							<span class="pkt" style="animation-delay:{i * 0.55}s"></span>
						</div>
					{/each}
				</div>

				<!-- right: the architecture -->
				<div class="arch">
					{#if arch === 'mono'}
						<div class="mono" class:broken>
							<div class="mbar">
								<span class="mname">{tx.monoLabel}</span>
								<span class="msub">{tx.oneProgram}</span>
								{#if broken}<span class="downchip">{tx.downTag}</span>{/if}
							</div>
							<div class="mrows">
								{#each tx.requests as r (r.service)}
									<span class="mrow">{r.service}</span>
								{/each}
							</div>
						</div>
					{:else}
						{#each tx.requests as r, i (r.service)}
							<div class="svc" class:bad={broken && i === PAY}>
								<span class="sname">{r.service}</span>
								<span class="ssub">{tx.sepPrograms}</span>
								{#if broken && i === PAY}<span class="downchip sm">{tx.downTag}</span>{/if}
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.ms {
		display: flex;
		width: min(96vw, 700px);
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.board {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
	}
	.heads {
		display: flex;
		justify-content: space-between;
		padding: 0 4px;
		font-size: 11px;
		font-weight: 800;
		color: #5b6675;
	}
	.lanes {
		display: flex;
		align-items: stretch;
		gap: 0;
	}
	.users,
	.arch {
		display: flex;
		flex: none;
		flex-direction: column;
		justify-content: space-between;
		gap: 12px;
	}
	.wires {
		display: flex;
		min-width: 70px;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		gap: 12px;
	}

	/* users */
	.user {
		display: flex;
		height: 52px;
		width: 96px;
		align-items: center;
		gap: 6px;
		border-radius: 11px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 0 9px;
		box-shadow: 0 4px 11px rgba(22, 40, 60, 0.05);
	}
	.person {
		width: 20px;
		height: 20px;
		flex: none;
	}
	.ulab {
		flex: 1;
		font-size: 11px;
		font-weight: 700;
		color: #2b3640;
	}
	.badge {
		border-radius: 5px;
		padding: 1px 6px;
		font-size: 9px;
		font-weight: 800;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.badge.ok {
		background: #eaf6ee;
		color: #2f8a57;
	}
	.badge.fail {
		background: #fdecea;
		color: #d3584a;
	}

	/* wires with a request packet that goes out blue and returns in the result colour */
	.lane {
		position: relative;
		display: flex;
		height: 52px;
		align-items: center;
	}
	.wire {
		width: 100%;
		height: 2px;
		border-radius: 2px;
		background: repeating-linear-gradient(90deg, #d7dde6 0 6px, transparent 6px 11px);
	}
	.pkt {
		position: absolute;
		top: 50%;
		left: 0;
		height: 9px;
		width: 9px;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		background: #2e6fe0;
		animation: ping 2.4s linear infinite;
	}
	@keyframes ping {
		0% {
			left: 2%;
			opacity: 0;
			background: #2e6fe0;
		}
		8% {
			opacity: 1;
		}
		42% {
			left: 98%;
			background: #2e6fe0;
		}
		52% {
			left: 98%;
			background: var(--res);
		}
		92% {
			opacity: 1;
		}
		100% {
			left: 2%;
			opacity: 0;
			background: var(--res);
		}
	}

	/* monolith: one program */
	.arch {
		width: 150px;
	}
	.mono {
		display: flex;
		height: 100%;
		flex-direction: column;
		overflow: hidden;
		border-radius: 13px;
		border: 1.5px solid #d8d0c0;
		background: #fff;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.08);
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}
	.mono.broken {
		border-color: #e3a99f;
		box-shadow: 0 0 0 3px rgba(211, 88, 74, 0.16);
		animation: shake 0.4s ease;
	}
	.mbar {
		display: flex;
		flex-direction: column;
		gap: 1px;
		border-bottom: 1px solid #ece6dc;
		background: #f6f2ea;
		padding: 8px 11px;
	}
	.mono.broken .mbar {
		background: #fbe7e3;
		border-color: #f1cdc6;
	}
	.mname {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12px;
		font-weight: 800;
		color: #2b3640;
	}
	.msub,
	.ssub {
		font-size: 9px;
		font-weight: 700;
		color: #9aa3ae;
	}
	.downchip {
		align-self: flex-start;
		margin-top: 3px;
		border-radius: 5px;
		background: #d3584a;
		padding: 1px 7px;
		font-size: 9.5px;
		font-weight: 800;
		color: #fff;
	}
	.mrows {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		padding: 9px 11px;
	}
	.mrow {
		border-radius: 7px;
		border: 1px solid #eee8dd;
		background: #faf9f6;
		padding: 5px 9px;
		font-size: 11px;
		font-weight: 700;
		color: #3a4651;
		transition: opacity 0.3s;
	}
	.mono.broken .mrow {
		opacity: 0.5;
	}

	/* microservices: separate programs */
	.svc {
		position: relative;
		display: flex;
		height: 52px;
		flex-direction: column;
		justify-content: center;
		gap: 1px;
		border-radius: 11px;
		border: 1.5px solid #cde3d5;
		background: #f5fbf7;
		padding: 0 11px;
		box-shadow: 0 4px 11px rgba(22, 40, 60, 0.05);
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.sname {
		font-size: 12px;
		font-weight: 800;
		color: #2b3640;
	}
	.svc.bad {
		border-color: #eab3aa;
		background: #fdf3f1;
		animation: shake 0.4s ease;
	}
	.svc.bad .sname {
		color: #c4392c;
	}
	.downchip.sm {
		position: absolute;
		top: -7px;
		right: -6px;
		margin: 0;
	}

	/* recap */
	.recap {
		display: flex;
		width: 100%;
		max-width: 520px;
		justify-content: center;
		gap: 14px;
	}
	.rcard {
		display: flex;
		max-width: 230px;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		border: 1px solid #ece6dc;
		background: #fff;
		padding: 16px 14px;
		text-align: center;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.rmini {
		display: flex;
		height: 46px;
		align-items: center;
		justify-content: center;
	}
	.rmini.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
	}
	.rblock {
		height: 18px;
		width: 18px;
		border-radius: 5px;
		background: linear-gradient(135deg, #cdead9, #aee0c4);
	}
	.rblock.big {
		height: 44px;
		width: 60px;
		border-radius: 8px;
		background: linear-gradient(135deg, #dbe8fb, #c8dbf7);
	}
	.rname {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 15px;
		font-weight: 600;
		color: #1f2a37;
	}
	.rcard p {
		margin: 0;
		font-size: 12px;
		line-height: 1.45;
		color: #4a5663;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	:global(.dark) .heads {
		color: var(--color-muted);
	}
	:global(.dark) .user {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .user svg circle,
	:global(.dark) .user svg path {
		fill: var(--color-faint);
	}
	:global(.dark) .ulab {
		color: var(--color-ink);
	}
	:global(.dark) .badge.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	:global(.dark) .badge.fail {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	:global(.dark) .wire {
		background: repeating-linear-gradient(90deg, var(--color-line) 0 6px, transparent 6px 11px);
	}
	:global(.dark) .mono {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .mono.broken {
		border-color: color-mix(in srgb, var(--color-danger) 50%, transparent);
	}
	:global(.dark) .mbar {
		background: var(--color-paper);
		border-bottom-color: var(--color-line);
	}
	:global(.dark) .mono.broken .mbar {
		background: var(--color-danger-soft);
		border-color: color-mix(in srgb, var(--color-danger) 25%, transparent);
	}
	:global(.dark) .mname {
		color: var(--color-ink);
	}
	:global(.dark) .msub,
	:global(.dark) .ssub {
		color: var(--color-faint);
	}
	:global(.dark) .mrow {
		border-color: var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
	}
	:global(.dark) .svc {
		border-color: color-mix(in srgb, var(--color-grass) 25%, transparent);
		background: color-mix(in srgb, var(--color-grass) 8%, transparent);
		box-shadow: none;
	}
	:global(.dark) .sname {
		color: var(--color-ink);
	}
	:global(.dark) .svc.bad {
		border-color: color-mix(in srgb, var(--color-danger) 30%, transparent);
		background: var(--color-danger-soft);
	}
	:global(.dark) .svc.bad .sname {
		color: var(--color-danger);
	}
	:global(.dark) .rcard {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .rname {
		color: var(--color-ink);
	}
	:global(.dark) .rcard p {
		color: var(--color-muted);
	}
	:global(.dark) .rblock {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-grass) 50%, transparent),
			color-mix(in srgb, var(--color-grass) 30%, transparent)
		);
	}
	:global(.dark) .rblock.big {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-brand) 50%, transparent),
			color-mix(in srgb, var(--color-brand) 30%, transparent)
		);
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt {
			animation: none;
			left: 50%;
			background: var(--res);
		}
		.mono.broken,
		.svc.bad {
			animation: none;
		}
	}
	@media (max-width: 430px) {
		.user {
			width: 80px;
		}
		.arch {
			width: 124px;
		}
	}
</style>
