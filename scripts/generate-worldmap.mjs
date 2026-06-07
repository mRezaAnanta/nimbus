// Regenerates src/lib/components/WorldMap.svelte from Natural Earth 110m land data.
// Equirectangular projection cropped to the land band (LAT_TOP..LAT_BOTTOM) so the
// continents fill the viewBox with no empty polar strip. The Region stage places pins
// with the same projection. viewBox is 960 x H (printed below).
//
//   Usage:  bun scripts/generate-worldmap.mjs
//
import { writeFileSync } from 'node:fs';

const SOURCE =
	'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json';
const W = 960;
const LAT_TOP = 84; // northern edge of the viewBox
const LAT_BOTTOM = -56; // southern edge (Antarctica dropped)
const H = +((W * (LAT_TOP - LAT_BOTTOM)) / 360).toFixed(2); // keep degrees square

const px = (lon) => (((lon + 180) / 360) * W).toFixed(1);
const py = (lat) => (((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * H).toFixed(1);

const geo = await (await fetch(SOURCE)).json();

const paths = [];
for (const f of geo.features) {
	const rings = f.geometry.coordinates;
	let maxLat = -90;
	for (const p of rings[0]) if (p[1] > maxLat) maxLat = p[1];
	if (maxLat < LAT_BOTTOM + 1) continue; // drop Antarctica
	let d = '';
	for (const ring of rings) {
		const pts = ring.map((p) => px(p[0]) + ' ' + py(p[1]));
		d += 'M' + pts[0] + 'L' + pts.slice(1).join('L') + 'Z';
	}
	paths.push(d);
}

const vlines = [160, 320, 480, 640, 800]
	.map((x) => `\t\t<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#eaf0f8" stroke-width="1" />`)
	.join('\n');
const hlines = [0.25, 0.5, 0.75]
	.map((f) => {
		const y = +(H * f).toFixed(1);
		return `\t\t<line x1="0" y1="${y}" x2="960" y2="${y}" stroke="#eaf0f8" stroke-width="1" />`;
	})
	.join('\n');

const out = `<!--
	World map for the Region stage. Generated from Natural Earth 110m land data,
	equirectangular projection cropped to ${LAT_TOP}N..${LAT_BOTTOM}S into a 960x${H} viewBox.
	Continents are accurate; the stage places pins with the same projection.
	Regenerate with: bun scripts/generate-worldmap.mjs
-->
<g aria-hidden="true">
${vlines}
${hlines}
	<path d="${paths.join('')}" fill="#d9e4f2" fill-rule="evenodd" />
</g>
`;

writeFileSync(new URL('../src/lib/components/WorldMap.svelte', import.meta.url), out);
console.log(`WorldMap.svelte written (${paths.length} landmasses, viewBox 960 x ${H}).`);
