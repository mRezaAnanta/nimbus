<script lang="ts">
	import ProviderLogo from '../ProviderLogo.svelte';
	import { theme } from '$lib/theme.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CapstoneText } from '$lib/chapters/capstone/types';

	let { text, oncomplete, onstate }: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } =
		$props();
	const tx = $derived(text as CapstoneText);

	let picked = $state('');
	let email = $state('');
	let subState = $state<'' | 'bad' | 'err' | 'busy' | 'ok'>('');
	let done = false;

	function pick(k: string) {
		picked = k;
		onstate?.('picked');
		if (!done) {
			done = true;
			oncomplete?.();
		}
		try {
			localStorage.setItem('nimbus-track', k);
		} catch {
			/* storage may be unavailable, the pick still counts */
		}
	}
	async function subscribe(e: SubmitEvent) {
		e.preventDefault();
		if (subState === 'busy') return;
		if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
			subState = 'bad';
			return;
		}
		subState = 'busy';
		try {
			const res = await fetch('/api/newsletter', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), track: picked })
			});
			if (!res.ok) throw new Error(String(res.status));
			subState = 'ok';
			onstate?.('subscribed');
		} catch {
			subState = 'err';
		}
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- pick the provider you want to learn first -->
	<div class="cards">
		<button type="button" class="prov" class:on={picked === 'aws'} onclick={() => pick('aws')}>
			<span class="soon">{tx.comingSoon}</span>
			<span class="mark"><ProviderLogo id="aws" size={26} /></span>
			<b>{tx.providers[0].name}</b>
			<span class="psub">{tx.providers[0].sub}</span>
			{#if picked === 'aws'}<span class="pickedtag">{tx.pickedTag}</span>{/if}
		</button>
		<button type="button" class="prov" class:on={picked === 'gcp'} onclick={() => pick('gcp')}>
			<span class="soon">{tx.comingSoon}</span>
			<span class="mark"><ProviderLogo id="gcp" size={26} /></span>
			<b>{tx.providers[1].name}</b>
			<span class="psub">{tx.providers[1].sub}</span>
			{#if picked === 'gcp'}<span class="pickedtag">{tx.pickedTag}</span>{/if}
		</button>
		<button type="button" class="prov" class:on={picked === 'azure'} onclick={() => pick('azure')}>
			<span class="soon">{tx.comingSoon}</span>
			<span class="mark"><ProviderLogo id="azure" size={26} /></span>
			<b>{tx.providers[2].name}</b>
			<span class="psub">{tx.providers[2].sub}</span>
			{#if picked === 'azure'}<span class="pickedtag">{tx.pickedTag}</span>{/if}
		</button>
	</div>

	<p class="note">{picked ? tx.notePicked : tx.noteIdle}</p>

	<!-- the heads-up letter -->
	<div class="news">
		<div class="ntext">
			<b>{tx.newsTitle}</b>
			<span>{tx.newsSub}</span>
		</div>
		{#if subState === 'ok'}
			<div class="okmsg">✓ {tx.subscribedMsg}</div>
		{:else}
			<form class="frm" onsubmit={subscribe}>
				<input
					type="email"
					placeholder={tx.emailPh}
					bind:value={email}
					class:bad={subState === 'bad'}
					oninput={() => (subState = '')}
				/>
				<button type="submit" class="sub" disabled={subState === 'busy'}>{tx.subscribe}</button>
			</form>
			{#if subState === 'bad'}<span class="badmsg">{tx.invalidMsg}</span>{/if}
			{#if subState === 'err'}<span class="badmsg">{tx.errMsg}</span>{/if}
		{/if}
	</div>
</div>

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 9px;
		width: min(94vw, 390px);
	}
	.prov {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 16px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		padding: 22px 8px 13px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
		transition: all 0.25s ease;
	}
	.prov:hover {
		border-color: #b9c0c7;
		transform: translateY(-2px);
	}
	.prov.on {
		border-color: #2e6fe0;
		box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.14);
	}
	.soon {
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #dd9e36;
		color: #fff;
		font-size: 7.5px;
		font-weight: 800;
		padding: 2px 8px;
		white-space: nowrap;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.mark {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30px;
	}
	.prov b {
		font-size: 11.5px;
		font-weight: 800;
		color: #16212b;
	}
	.psub {
		font-size: 7.5px;
		font-weight: 600;
		color: #8a949d;
		white-space: nowrap;
	}
	.pickedtag {
		margin-top: 3px;
		border-radius: 999px;
		background: #2e6fe0;
		color: #fff;
		font-size: 7.5px;
		font-weight: 800;
		padding: 2px 8px;
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.note {
		min-height: 1.3em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.news {
		display: flex;
		flex-direction: column;
		gap: 9px;
		width: min(94vw, 390px);
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 13px 14px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.06);
	}
	.ntext {
		display: flex;
		flex-direction: column;
		gap: 2px;
		line-height: 1.3;
	}
	.ntext b {
		font-size: 12.5px;
		font-weight: 800;
		color: #16212b;
	}
	.ntext span {
		font-size: 10px;
		color: #8a949d;
	}
	.frm {
		display: flex;
		gap: 6px;
	}
	.frm input {
		flex: 1;
		min-width: 0;
		border-radius: 11px;
		border: 1.5px solid #e8e2d8;
		background: #faf9f6;
		padding: 9px 12px;
		font-size: 12px;
		font-weight: 600;
		color: #16212b;
		outline: none;
		transition: border-color 0.2s ease;
	}
	.frm input:focus {
		border-color: #2e6fe0;
		background: #fff;
	}
	.frm input.bad {
		border-color: #d3584a;
	}
	.sub {
		border-radius: 11px;
		background: #16212b;
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		padding: 9px 15px;
		white-space: nowrap;
		transition: filter 0.2s ease;
	}
	.sub:hover {
		filter: brightness(1.18);
	}
	.sub:disabled {
		opacity: 0.6;
	}
	.badmsg {
		font-size: 10px;
		font-weight: 700;
		color: #b8392c;
	}
	.okmsg {
		border-radius: 11px;
		border: 1px solid #cde6d7;
		background: #ecf6f0;
		color: #2f7d54;
		font-size: 12px;
		font-weight: 700;
		padding: 10px 12px;
		text-align: center;
		animation: popin 0.3s ease;
	}
	/* ---- Dark mode ---- */
	:global(.dark) .prov {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .prov:hover {
		border-color: var(--color-muted);
	}
	:global(.dark) .prov.on {
		border-color: var(--color-brand);
	}
	:global(.dark) .prov b {
		color: var(--color-ink);
	}
	:global(.dark) .psub {
		color: var(--color-faint);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .news {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .ntext b {
		color: var(--color-ink);
	}
	:global(.dark) .ntext span {
		color: var(--color-faint);
	}
	:global(.dark) .frm input {
		background: var(--color-paper);
		border-color: var(--color-line);
		color: var(--color-ink);
	}
	:global(.dark) .frm input:focus {
		border-color: var(--color-brand);
		background: var(--color-card);
	}
	:global(.dark) .frm input.bad {
		border-color: var(--color-danger);
	}
	:global(.dark) .sub {
		background: var(--btn-primary);
	}
	:global(.dark) .badmsg {
		color: var(--color-danger);
	}
	:global(.dark) .okmsg {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	@media (prefers-reduced-motion: reduce) {
		.pickedtag,
		.okmsg {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.cards {
			width: 520px;
			gap: 14px;
		}
		.prov {
			padding: 28px 10px 17px;
		}
		.prov b {
			font-size: 14.5px;
		}
		.psub {
			font-size: 9.5px;
		}
		.soon {
			font-size: 9px;
		}
		.pickedtag {
			font-size: 9px;
		}
		.mark {
			height: 38px;
		}
		.mark :global(svg) {
			transform: scale(1.25);
		}
		.note {
			font-size: 14px;
		}
		.news {
			width: 520px;
			padding: 16px 18px;
		}
		.ntext b {
			font-size: 15px;
		}
		.ntext span {
			font-size: 12px;
		}
		.frm input {
			font-size: 13.5px;
			padding: 11px 14px;
		}
		.sub {
			font-size: 13.5px;
			padding: 11px 19px;
		}
	}
</style>
