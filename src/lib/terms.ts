import type { Lang } from './i18n';

/**
 * Inline glossary terms for Nim's dialogue. Write `[[label|topic]]` anywhere in a lesson line and it
 * renders as a tappable chip; a tap opens a small "coming soon" card that points at the module which
 * will cover it. `topic` is optional and defaults to `general`. Reusable across every lesson.
 *
 * Add a topic here to give it a friendly localized name and an accent color. Unknown topics still
 * work (the raw word is shown, in the default color), so authors can drop a hint before the module
 * that explains it even exists.
 */
export const TOPICS: Record<string, { id: string; en: string; color: string }> = {
	security: { id: 'Keamanan', en: 'Security', color: '#d3584a' }
};

const DEFAULT_COLOR = '#2e6fe0';

export function topicName(topic: string, lang: Lang): string {
	const t = TOPICS[topic];
	if (t) return t[lang];
	return topic.charAt(0).toUpperCase() + topic.slice(1);
}

export function topicColor(topic: string): string {
	return TOPICS[topic]?.color ?? DEFAULT_COLOR;
}

const TERM_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * Replace every `[[label|topic]]` marker with a clickable chip. Everything else in the string,
 * including existing inline HTML like <b>, is left as is, so this composes with {@html}. The chip
 * carries data-label and data-topic; SpeechBubble reads those on click (event delegation).
 */
export function renderTerms(text: string): string {
	return text.replace(TERM_RE, (_m, label: string, topic?: string) => {
		const tp = (topic ?? 'general').trim();
		const lb = label.trim();
		return `<button type="button" class="term" data-label="${escapeHtml(lb)}" data-topic="${escapeHtml(tp)}" style="--tc:${topicColor(tp)}">${escapeHtml(lb)}</button>`;
	});
}
