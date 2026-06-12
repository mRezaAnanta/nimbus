import VirtualMachineStage from '$lib/components/stages/VirtualMachineStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const virtualMachine: Lesson = {
	id: 'virtual-machine',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'happy'],
	reactionMood: { first: 'excited', more: 'happy', full: 'excited' },
	stage: VirtualMachineStage,
	text: { id, en }
};
