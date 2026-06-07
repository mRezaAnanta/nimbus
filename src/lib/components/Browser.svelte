<script lang="ts">
	// Reusable phone/browser preview, shared across every stage.
	// idle    = address bar only (empty page)
	// loading = spinner
	// loaded  = content skeleton appears, as if real data arrived
	// offline = loaded content dimmed + an outage mask
	let { phase = 'idle', offlineText = '' }: {
		phase?: 'idle' | 'loading' | 'loaded' | 'offline';
		offlineText?: string;
	} = $props();
</script>

<div class="phone">
	<div class="screen">
		<div class="addr">
			<span class="led" class:on={phase === 'loaded'} class:off={phase === 'offline'}></span>
			<span class="urlbar"></span>
		</div>
		<div class="body">
			{#if phase === 'loading'}
				<div class="spinner"></div>
			{/if}
			{#if phase === 'loaded' || phase === 'offline'}
				<div class="content" class:dim={phase === 'offline'}>
					<div class="hero"></div>
					<div class="bar title"></div>
					<div class="bar w70"></div>
					<div class="bar w85"></div>
					<div class="row">
						<div class="cardlet"></div>
						<div class="cardlet"></div>
					</div>
				</div>
			{/if}
			{#if phase === 'offline'}
				<div class="mask">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="#d3584a" />
					</svg>
					{#if offlineText}<span>{offlineText}</span>{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.phone {
		width: 158px;
		max-width: 100%;
		border-radius: 26px;
		background: #fff;
		border: 1px solid #e8e2d8;
		padding: 10px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.screen {
		position: relative;
		height: 228px;
		border-radius: 18px;
		background: #f7f6f2;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 10px;
		background: #fff;
		border-bottom: 1px solid #efeae1;
	}
	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #cfd6dd;
		transition: background 0.3s;
	}
	.led.on {
		background: #3a9c64;
	}
	.led.off {
		background: #d3584a;
	}
	.urlbar {
		flex: 1;
		height: 9px;
		border-radius: 5px;
		background: #e8e2d8;
	}
	.body {
		position: relative;
		flex: 1;
		padding: 10px;
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.content > * {
		opacity: 0;
		animation: rise 0.4s ease forwards;
	}
	.content > *:nth-child(1) {
		animation-delay: 0.02s;
	}
	.content > *:nth-child(2) {
		animation-delay: 0.09s;
	}
	.content > *:nth-child(3) {
		animation-delay: 0.16s;
	}
	.content > *:nth-child(4) {
		animation-delay: 0.23s;
	}
	.content > *:nth-child(5) {
		animation-delay: 0.3s;
	}
	.content.dim > * {
		animation: none;
		opacity: 0.4;
		filter: grayscale(0.4);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.hero {
		height: 46px;
		border-radius: 8px;
		background: linear-gradient(120deg, #eaf1fc, #dbe8fb);
	}
	.bar {
		height: 9px;
		border-radius: 5px;
		background: #e3ddd3;
	}
	.bar.title {
		width: 60%;
		height: 11px;
		background: #c9d6ea;
	}
	.bar.w70 {
		width: 70%;
	}
	.bar.w85 {
		width: 85%;
	}
	.row {
		display: flex;
		gap: 7px;
		margin-top: 2px;
	}
	.cardlet {
		flex: 1;
		height: 34px;
		border-radius: 8px;
		background: #ece6dc;
	}
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 26px;
		height: 26px;
		margin: -13px;
		border: 3px solid #e7e1d7;
		border-top-color: #2e6fe0;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.mask {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		background: rgba(247, 246, 242, 0.82);
		color: #d3584a;
		font-size: 12px;
		font-weight: 600;
	}
</style>
