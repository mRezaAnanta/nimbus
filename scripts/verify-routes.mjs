// Verifies that each data-packet route in routes.json actually runs along the real cables in
// cables.json. It densifies the cable lines (so distance is measured to the cable line, not
// just its sparse vertices), then samples each route and reports how much of its length runs
// within 60km / 150km of a real cable. Sea legs should be near 100%; the only stretches far
// from any cable are the intended terrestrial hops (source to coast, the Egypt crossing, and
// the inland data center), which are listed so you can confirm they are the expected ones.
//
//   Usage:  bun scripts/verify-routes.mjs
//
import { readFileSync } from 'node:fs';

const here = (p) => new URL('../src/lib/data/' + p, import.meta.url);
const cables = JSON.parse(readFileSync(here('cables.json')));
const routes = JSON.parse(readFileSync(here('routes.json')));

const R = 6371;
const toRad = (d) => (d * Math.PI) / 180;
function dist(a, b) {
	const dLat = toRad(b[1] - a[1]);
	const dLon = toRad(b[0] - a[0]);
	const la1 = toRad(a[1]);
	const la2 = toRad(b[1]);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// densify cables into a 0.5deg grid so nearest-vertex ~= nearest-line
const grid = new Map();
const add = (p) => {
	const k = Math.round(p[0] * 2) + ':' + Math.round(p[1] * 2);
	if (!grid.has(k)) grid.set(k, []);
	grid.get(k).push(p);
};
for (const line of cables) {
	for (let i = 1; i < line.length; i++) {
		const a = line[i - 1];
		const b = line[i];
		const n = Math.max(1, Math.ceil(dist(a, b) / 25));
		for (let s = 0; s <= n; s++) {
			const f = s / n;
			add([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
		}
	}
}
function nearest(pt) {
	let best = Infinity;
	const bx = Math.round(pt[0] * 2);
	const by = Math.round(pt[1] * 2);
	for (let dx = -6; dx <= 6; dx++)
		for (let dy = -6; dy <= 6; dy++) {
			const arr = grid.get(bx + dx + ':' + (by + dy));
			if (!arr) continue;
			for (const q of arr) {
				const d = dist(pt, q);
				if (d < best) best = d;
			}
		}
	return best;
}

let allGood = true;
for (const [code, pts] of Object.entries(routes)) {
	let total = 0;
	let near = 0;
	let mid = 0;
	const far = [];
	for (let i = 1; i < pts.length; i++) {
		const a = pts[i - 1];
		const b = pts[i];
		const segLen = dist(a, b);
		const n = Math.max(1, Math.round(segLen / 40));
		for (let s = 0; s < n; s++) {
			const f = (s + 0.5) / n;
			const p = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
			const d = nearest(p);
			const w = segLen / n;
			total += w;
			if (d <= 60) near += w;
			else if (d <= 150) mid += w;
			else far.push([Math.round(p[0]), Math.round(p[1])]);
		}
	}
	const pctNear = (100 * near) / total;
	const pctClose = (100 * (near + mid)) / total;
	if (pctClose < 90) allGood = false;
	console.log(
		`${code}: ${Math.round(total)} km | on cable (<=60km): ${pctNear.toFixed(0)}% | close (<=150km): ${pctClose.toFixed(0)}%`
	);
	if (far.length) console.log(`  off-cable points (expected land hops): ${far.map((f) => `[${f[0]},${f[1]}]`).join(' ')}`);
}
console.log(allGood ? '\nOK: every route stays close to real cables.' : '\nWARN: a route strays from the cable network.');
