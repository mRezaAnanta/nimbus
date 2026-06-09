import ReplicationStage from '$lib/components/stages/ReplicationStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const replication: Lesson = {
	id: 'replication',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { lost: 'sad', replicated: 'excited', restored: 'happy' },
	stage: ReplicationStage,
	text: { id, en }
};
