import ReverseProxyStage from '$lib/components/stages/ReverseProxyStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const reverseProxy: Lesson = {
	id: 'reverse-proxy',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'happy', 'calm'],
	reactionMood: { web: 'happy', api: 'happy', static: 'excited' },
	stage: ReverseProxyStage,
	text: { id, en }
};
