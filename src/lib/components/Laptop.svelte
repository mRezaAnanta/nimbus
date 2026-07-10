<!--
	Reusable laptop preview, the sibling of Browser.svelte with the same design
	language (white card, soft borders, skeleton content).
	phase  on     = open, screen showing the running app skeleton
	       closed = lid shut
	led    the small status light in the screen header
-->
<script lang="ts">
	import { theme } from '$lib/theme.svelte';

	let { phase = 'on', led = 'off' }: {
		phase?: 'on' | 'closed';
		led?: 'ok' | 'warn' | 'down' | 'off';
	} = $props();

	let dark = $derived($theme === 'dark');
</script>

<div class="laptop" class:dark>
	{#if phase === 'closed'}
		<div class="lid"></div>
	{:else}
		<div class="shell">
			<div class="screen">
				<div class="head">
					<span class="led {led}"></span>
					<span class="tab"></span>
				</div>
				<div class="body">
					<div class="bar title"></div>
					<div class="bar w85"></div>
					<div class="bar w70"></div>
				</div>
			</div>
		</div>
	{/if}
	<div class="base"><span class="pad"></span></div>
</div>

<style>
	.laptop {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.shell {
		width: 132px;
		border-radius: 12px 12px 0 0;
		background: #fff;
		border: 1px solid #e8e2d8;
		border-bottom: none;
		padding: 7px 7px 0;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.screen {
		display: flex;
		flex-direction: column;
		height: 82px;
		border-radius: 8px 8px 0 0;
		background: #f7f6f2;
		overflow: hidden;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px 7px;
		background: #fff;
		border-bottom: 1px solid #efeae1;
	}
	.led {
		flex: none;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #cfd6dd;
		transition: background 0.3s;
	}
	.led.ok {
		background: #3a9c64;
	}
	.led.warn {
		background: #dd9e36;
	}
	.led.down {
		background: #d3584a;
	}
	.tab {
		flex: 1;
		max-width: 56px;
		height: 7px;
		border-radius: 4px;
		background: #e8e2d8;
	}
	.body {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
		padding: 7px 9px;
	}
	.bar {
		height: 7px;
		border-radius: 4px;
		background: #e3ddd3;
	}
	.bar.title {
		width: 55%;
		height: 8px;
		background: #c9d6ea;
	}
	.bar.w85 {
		width: 85%;
	}
	.bar.w70 {
		width: 70%;
	}
	.lid {
		width: 132px;
		height: 14px;
		border-radius: 12px 12px 0 0;
		background: #fff;
		border: 1px solid #e8e2d8;
		border-bottom: none;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
	}
	.base {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		width: 158px;
		height: 9px;
		border-radius: 2px 2px 10px 10px;
		background: #fff;
		border: 1px solid #e8e2d8;
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.08);
	}
	.pad {
		width: 34px;
		height: 3px;
		border-radius: 0 0 4px 4px;
		background: #e8e2d8;
	}
	.dark .shell {
		background: #1b2533;
		border-color: #2c3746;
	}
	.dark .screen {
		background: #141c2a;
	}
	.dark .head {
		background: #1b2533;
		border-bottom-color: #2c3746;
	}
	.dark .led {
		background: #6b7885;
	}
	.dark .tab {
		background: #3a4a5c;
	}
	.dark .bar {
		background: #2c3746;
	}
	.dark .bar.title {
		background: #1a2d4a;
	}
	.dark .lid {
		background: #1b2533;
		border-color: #2c3746;
	}
	.dark .base {
		background: #1b2533;
		border-color: #2c3746;
	}
	.dark .pad {
		background: #3a4a5c;
	}
</style>
