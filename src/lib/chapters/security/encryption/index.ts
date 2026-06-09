import EncryptionStage from '$lib/components/stages/EncryptionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const encryption: Lesson = {
	id: 'encryption',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { plain: 'worried', encrypted: 'excited' },
	stage: EncryptionStage,
	text: { id, en }
};
