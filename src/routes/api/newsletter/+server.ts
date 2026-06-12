import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Collects newsletter signups into the nimbus-newsletter D1 database.
// The DB binding is configured in wrangler.jsonc; without it (plain vite dev)
// we answer 503 so the client can tell the visitor to try again later.
export const POST: RequestHandler = async ({ request, platform }) => {
	let body: { email?: string; track?: string };
	try {
		body = await request.json();
	} catch {
		return json({ ok: false }, { status: 400 });
	}
	const email = (body.email ?? '').trim().toLowerCase();
	const track = (body.track ?? '').slice(0, 32);
	if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
		return json({ ok: false }, { status: 400 });
	}
	const db = platform?.env?.DB;
	if (!db) return json({ ok: false }, { status: 503 });
	await db
		.prepare('INSERT INTO subscribers (email, track) VALUES (?1, ?2) ON CONFLICT(email) DO UPDATE SET track = ?2')
		.bind(email, track || null)
		.run();
	return json({ ok: true });
};
