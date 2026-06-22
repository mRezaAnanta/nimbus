import IngressEgressStage from '$lib/components/stages/IngressEgressStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ingressEgress: Lesson = {
	id: 'ingress-egress',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'happy'],
	reactionMood: { in: 'happy', out: 'worried', both: 'idea' },
	stage: IngressEgressStage,
	text: { id, en }
};
