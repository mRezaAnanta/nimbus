// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Minimal D1 surface used by this app, so we avoid pulling in the huge
// generated worker types that clash with SvelteKit's own ambient types.
interface D1PreparedStatement {
	bind(...values: unknown[]): D1PreparedStatement;
	run(): Promise<{ success: boolean }>;
}
interface D1Database {
	prepare(query: string): D1PreparedStatement;
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: { DB: D1Database };
		}
	}
}

export {};
