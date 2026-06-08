// Regenerates src/lib/data/region-shapes.json: the boundary geometry for the regions the
// Availability Zone lesson zooms into (Virginia as a US state, Singapore as a country), pulled
// from Natural Earth. Coordinates are rounded to ~100m. The AZ stage fits each shape to the
// panel so a small country (Singapore) zooms in more than a large state.
//
//   Usage:  bun scripts/generate-region-shapes.mjs
//
import { writeFileSync } from 'node:fs';

const STATES = 'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/cultural/ne_50m_admin_1_states_provinces.json';
const COUNTRIES = 'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/cultural/ne_10m_admin_0_countries.json';
const r = (n) => Math.round(n * 1000) / 1000;

function simplify(g) {
	const ring = (rg) => rg.map(([x, y]) => [r(x), r(y)]);
	if (g.type === 'Polygon') return { type: 'Polygon', coordinates: g.coordinates.map(ring) };
	if (g.type === 'MultiPolygon') return { type: 'MultiPolygon', coordinates: g.coordinates.map((p) => p.map(ring)) };
	return g;
}
const propMatch = (p, value) =>
	Object.values(p).some((v) => typeof v === 'string' && v === value);

const states = await (await fetch(STATES)).json();
const va = states.features.find(
	(f) => (f.properties.name === 'Virginia' || f.properties.NAME === 'Virginia') && propMatch(f.properties, 'United States of America')
);
const countries = await (await fetch(COUNTRIES)).json();
const sg = countries.features.find((f) => propMatch(f.properties, 'Singapore'));

if (!va) throw new Error('Virginia not found in states data');
if (!sg) throw new Error('Singapore not found in countries data');

const out = { virginia: simplify(va.geometry), singapore: simplify(sg.geometry) };
const json = JSON.stringify(out);
writeFileSync(new URL('../src/lib/data/region-shapes.json', import.meta.url), json);
console.log(`region-shapes.json: ${json.length} bytes | virginia ${out.virginia.type} | singapore ${out.singapore.type}`);
