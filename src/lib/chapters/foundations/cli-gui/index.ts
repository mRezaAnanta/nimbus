import CliGuiStage from '$lib/components/stages/CliGuiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cliGui: Lesson = {
	id: 'cli-gui',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'thinking', 'happy'],
	reactionMood: { gui: 'happy', cli: 'happy', both: 'excited' },
	stage: CliGuiStage,
	text: { id, en }
};
