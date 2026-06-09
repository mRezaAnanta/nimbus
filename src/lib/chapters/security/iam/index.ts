import IamStage from '$lib/components/stages/IamStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const iam: Lesson = {
	id: 'iam',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { denied: 'worried', allowed: 'happy', leastpriv: 'excited' },
	stage: IamStage,
	text: { id, en }
};
