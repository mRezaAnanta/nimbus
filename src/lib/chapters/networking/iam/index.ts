import IamStage from '$lib/components/stages/IamStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const iam: Lesson = {
	id: 'iam',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'happy'],
	reactionMood: { admin: 'worried', scoped: 'excited' },
	stage: IamStage,
	text: { id, en }
};
