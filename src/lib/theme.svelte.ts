import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

function save(value: Theme) {
	try {
		if (typeof localStorage !== 'undefined') localStorage.setItem('nimbus-theme', value);
	} catch {
		// localStorage unavailable (SSR, private browsing, etc.)
	}
}

function createTheme() {
	const { subscribe, set, update } = writable<Theme>('light');

	return {
		subscribe,
		set(value: Theme) {
			save(value);
			set(value);
		},
		toggle() {
			update((current) => {
				const next: Theme = current === 'light' ? 'dark' : 'light';
				save(next);
				return next;
			});
		}
	};
}

export const theme = createTheme();
