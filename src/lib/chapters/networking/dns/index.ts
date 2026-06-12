import DnsStage from '$lib/components/stages/DnsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dns: Lesson = {
	id: 'dns',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { resolved: 'excited' },
	stage: DnsStage,
	text: { id, en }
};
