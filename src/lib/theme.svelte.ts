import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

function save(value: Theme) {
	try {
		if (typeof localStorage !== 'undefined') localStorage.setItem('nimbus-theme', value);
	} catch {
		// localStorage unavailable (SSR, private browsing, etc.)
	}
}

function detectTheme(): Theme {
	// On the client the pre-paint script in app.html already applied the dark class;
	// read it so the store matches before any $effect runs.
	if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
		return 'dark';
	}
	return 'light';
}

function createTheme() {
	const { subscribe, set, update } = writable<Theme>(detectTheme());

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
