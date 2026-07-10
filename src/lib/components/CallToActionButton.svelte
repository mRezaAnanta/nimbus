<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		disabled = false,
		waiting = false,
		onclick,
		children
	}: {
		disabled?: boolean;
		waiting?: boolean;
		onclick?: () => void;
		children?: Snippet;
	} = $props();
</script>

<button type="button" class="cta" class:waiting {disabled} {onclick}>
	{@render children?.()}
</button>

<style>
	.cta {
		border-radius: 12px;
		background: #16212b;
		padding: 12px 24px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		animation: invite 2s ease-in-out infinite;
		transition:
			filter 0.2s ease,
			transform 0.15s ease,
			opacity 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:active {
		transform: translateY(1px);
	}
	.cta:disabled {
		opacity: 0.5;
		animation: none;
	}
	.cta.waiting {
		opacity: 0.35;
	}
	@keyframes invite {
		0%,
		100% {
			box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		}
		50% {
			box-shadow:
				0 8px 20px rgba(22, 40, 60, 0.16),
				0 0 0 6px rgba(22, 40, 60, 0.08);
		}
	}
	:global(.dark) .cta {
		background: #2a3748;
		color: #e0dcd4;
		animation: invite-dark 2s ease-in-out infinite;
	}
	@keyframes invite-dark {
		0%,
		100% {
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
		}
		50% {
			box-shadow:
				0 8px 20px rgba(0, 0, 0, 0.25),
				0 0 0 6px rgba(255, 255, 255, 0.06);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cta {
			animation: none;
		}
	}
</style>
