import FirewallStage from '$lib/components/stages/FirewallStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const firewall: Lesson = {
	id: 'firewall',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { web: 'happy', ssh: 'thinking', db: 'worried', secured: 'excited' },
	stage: FirewallStage,
	text: { id, en }
};
