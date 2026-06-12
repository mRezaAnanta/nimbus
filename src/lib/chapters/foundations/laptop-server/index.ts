import LaptopServerStage from '$lib/components/stages/LaptopServerStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const laptopServer: Lesson = {
	id: 'laptop-server',
	mood: 'idea',
	moods: ['idea', 'calm', 'worried', 'happy'],
	reactionMood: { lan: 'excited', public: 'happy', ip: 'worried', sleep: 'sad', slow: 'worried' },
	stage: LaptopServerStage,
	text: { id, en }
};
