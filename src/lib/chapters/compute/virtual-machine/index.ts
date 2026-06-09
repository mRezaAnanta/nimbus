import VirtualMachineStage from '$lib/components/stages/VirtualMachineStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const virtualMachine: Lesson = {
	id: 'virtual-machine',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { created: 'happy', overcommit: 'worried' },
	stage: VirtualMachineStage,
	text: { id, en }
};
