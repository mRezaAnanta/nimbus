/**
 * The request journey, seen from your own eyes.
 *
 * You are standing on the pavement in front of your house holding your phone. You open
 * nimbus.com, the request leaves your hand as radio (to the router indoors, or to the
 * tower down the street if you are on mobile data), drops into the cable buried under
 * the pavement, runs along it to the server, and comes back the same way.
 *
 * Three rules hold this file together.
 *
 * 1. One camera, one take. Scroll is the only clock. Nothing cuts, so the thread from
 *    hand to tower to cable to server is never lost, and that is the whole reason to
 *    draw it in 3D instead of as five pictures.
 * 2. Only the first hop changes. Picking WiFi or mobile data swaps the first leg of the
 *    packet's road and nothing else, because that is exactly what the lesson says.
 * 3. It draws only what the lesson claims. There is no distance here, no speed and no
 *    hop count, because the lesson never puts a number on any of them.
 *
 * Geometry is in metres. The street runs along Z, you look down it towards negative Z,
 * and the tower stands off to the right.
 */

import * as THREE from 'three';

import { LEG, roadPosition, type JourneyScreen, type Mode } from './legs';

export type { JourneyScreen, Mode };
export { LEG };

export interface JourneyState {
	/** 0..1 along the whole journey, out and back. */
	t: number;
	mode: Mode;
	screen: JourneyScreen;
}

const EYE = 1.6;
/**
 * Home WiFi happens INDOORS, so it is drawn indoors: you are in your own room with the
 * router on the shelf. Mobile data happens out on the pavement with the tower down the
 * street. Same request, two different places to be standing, which is the whole point
 * of the toggle.
 */
const ROOM = { x: -16, z: 4 };
const ROUTER = new THREE.Vector3(ROOM.x + 1.35, 1.42, ROOM.z - 1.1);
const TOWER = { x: 9, z: -26, height: 17 };
const CABLE_Y = -2.6;
/**
 * The sea in the middle of the road.
 *
 * Between your street and the machine there is water, because there usually is, and a
 * cable that only ever runs under a pavement makes the world feel smaller than it is.
 * The street ends at `SEA_FROM`, the cable lies on the seabed until `SEA_TO`, and the
 * far shore carries it the rest of the way to the building.
 */
const SEA_FROM = -60;
const SEA_TO = -150;
const SEA_BED = -6.4;
const SERVER_Z = -190;
/**
 * Where the buried run ends.
 *
 * The trench used to run the whole length of the world, straight THROUGH the building at
 * the end of it, and since the camera rides down the middle of that trench the arrival
 * at the server was a shot of the inside of a pipe. The cable stops here and climbs.
 */
const TRENCH_END = SERVER_Z + 8;
/** The server room stands on the ground, like the building it is. */
const ROOM_FRONT = SERVER_Z + 6;
/**
 * The machine that answers, standing at the end of the corridor facing you.
 *
 * The request circles it while the answer is put together. A row of racks passed at
 * walking pace never said WHICH of them was doing the work, so the arrival read as a
 * corridor rather than as a meeting with the server.
 */
const ANSWERS_AT = new THREE.Vector3(2.6, 2, SERVER_Z - 21);

const DEFAULT_SCREEN: JourneyScreen = {
	site: 'nimbus.com',
	button: 'Buka',
	sending: '',
	page: { title: '', body: '', cta: '', cardA: '', cardB: '' }
};

/**
 * The road the packet takes, in three pieces per mode. The camera watches it, it does
 * not ride it.
 *
 * Three pieces and not one because each piece belongs to one leg of the scroll: to the
 * first hop, from that hop down into the ground, and along the ground to the server.
 * As a single curve the packet was three quarters of the way to the cable while the
 * caption still said "as far as the router", since the buried run is longer than
 * everything before it put together and swallowed the pacing.
 */
type Road = { toHop: THREE.Vector3[]; toTrunk: THREE.Vector3[]; trunk: THREE.Vector3[] };

/**
 * Where your own line meets your ISP's cable, per mode.
 *
 * There is a chamber drawn at each of these, because "which one is the ISP's cable" was a
 * fair question of the old drawing: a house lead and a trunk of the same gauge ran into
 * one another mid soil and nothing marked the hand over. Your lead is thin and stops
 * here. Everything past it is one thick duct that belongs to the ISP.
 */
const JUNCTION: Record<Mode, THREE.Vector3> = {
	wifi: new THREE.Vector3(2.6, CABLE_Y, -14),
	cell: new THREE.Vector3(2.6, CABLE_Y, TOWER.z - 10)
};

const TRUNK_TAIL = [
	new THREE.Vector3(2.6, CABLE_Y, -46),
	new THREE.Vector3(2.6, CABLE_Y, SEA_FROM + 3),
	// down the shore and onto the seabed
	new THREE.Vector3(2.6, SEA_BED, SEA_FROM - 8),
	new THREE.Vector3(2.6, SEA_BED, -100),
	new THREE.Vector3(2.6, SEA_BED, SEA_TO + 8),
	// up the far shore and back under land
	new THREE.Vector3(2.6, CABLE_Y, SEA_TO - 8),
	new THREE.Vector3(2.6, CABLE_Y, TRENCH_END + 2.4),
	// Up out of the road IN FRONT of the building, then in through its wall. Z runs
	// negative into the scene, so "outside the building" is TRENCH_END plus a little.
	new THREE.Vector3(2.6, -0.9, TRENCH_END + 1.4),
	new THREE.Vector3(2.6, 1.2, TRENCH_END + 0.4),
	new THREE.Vector3(2.6, 1.35, ROOM_FRONT - 1.5),
	// Down to the floor and along it to the machine, which is where a cable in a server
	// room actually runs.
	new THREE.Vector3(1.7, 0.24, ROOM_FRONT - 4.5),
	new THREE.Vector3(1.7, 0.24, ANSWERS_AT.z + 5.5),
	new THREE.Vector3(ANSWERS_AT.x - 0.55, 1, ANSWERS_AT.z + 1.1)
];

/** The trunk from a junction onwards, straight down the axis and never doubling back. */
function trunkFrom(j: THREE.Vector3): THREE.Vector3[] {
	return [
		j,
		new THREE.Vector3(2.6, CABLE_Y, j.z - 12),
		...TRUNK_TAIL.filter((p) => p.z < j.z - 12)
	];
}

const ROADS: Record<Mode, Road> = {
	// indoors: across the room to the router, then down through the floor
	wifi: {
		toHop: [
			new THREE.Vector3(ROOM.x - 1.2, 1.4, ROOM.z + 2),
			new THREE.Vector3(ROOM.x - 0.4, 1.66, ROOM.z + 1),
			new THREE.Vector3(ROUTER.x - 0.7, 1.6, ROUTER.z + 0.5),
			new THREE.Vector3(ROUTER.x, ROUTER.y + 0.08, ROUTER.z)
		],
		toTrunk: [
			new THREE.Vector3(ROUTER.x, ROUTER.y + 0.08, ROUTER.z),
			// Away from the shelf before it drops, and then down at an angle. Straight down
			// off the router the camera behind it hung directly overhead an arm's length
			// from the shelf, and the frame was one indicator light the size of a plate.
			new THREE.Vector3(ROUTER.x + 0.8, 1.05, ROUTER.z - 1.5),
			new THREE.Vector3(ROOM.x + 2.5, -0.5, ROOM.z - 3),
			new THREE.Vector3(ROOM.x + 5, CABLE_Y, -4),
			// Straightened onto the trunk's own line before it gets there, so the two meet
			// along the same direction instead of the house lead swinging into the duct.
			new THREE.Vector3(-2, CABLE_Y, -9.5),
			JUNCTION.wifi.clone()
		],
		trunk: trunkFrom(JUNCTION.wifi)
	},
	// outdoors: up to the tower down the street, then down the mast into the ground
	cell: {
		toHop: [
			new THREE.Vector3(-0.5, 1.4, 3.6),
			new THREE.Vector3(2.5, 6, -2),
			new THREE.Vector3(6.5, 13, -14),
			// ON one of the panels near the top, which is the part of a mast that does the
			// talking.
			new THREE.Vector3(TOWER.x + 1.15, TOWER.height - 1.2, TOWER.z + 0.5)
		],
		toTrunk: [
			new THREE.Vector3(TOWER.x + 1.15, TOWER.height - 1.2, TOWER.z + 0.5),
			// Down the OUTSIDE of the mast, where a mast's cable actually runs.
			new THREE.Vector3(TOWER.x + 1.2, TOWER.height * 0.55, TOWER.z + 0.55),
			new THREE.Vector3(TOWER.x + 1.2, 1.4, TOWER.z + 0.55),
			new THREE.Vector3(TOWER.x + 1, -1.4, TOWER.z - 0.6),
			new THREE.Vector3(6, CABLE_Y, TOWER.z - 5),
			JUNCTION.cell.clone()
		],
		trunk: trunkFrom(JUNCTION.cell)
	}
};

type Shot = { t: number; pos: [number, number, number]; look: [number, number, number] };

/**
 * Your own eyes, at the two ends of the journey: one pose looking down at the phone, and
 * one a breath closer as the thumb comes down. Everything between them is the camera
 * following the request, so there is nothing else in this table any more.
 */
const SHOTS: Record<Mode, Shot[]> = {
	// indoors, in your own room, where home WiFi actually happens
	wifi: [
		{ t: 0, pos: [ROOM.x - 1.4, EYE, ROOM.z + 2.4], look: [ROOM.x - 0.3, 1.22, ROOM.z + 0.4] },
		{
			t: LEG.tap,
			pos: [ROOM.x - 1.4, EYE + 0.02, ROOM.z + 2.3],
			look: [ROOM.x - 0.35, 1.26, ROOM.z + 0.3]
		}
	],
	// outdoors on the pavement, where the tower down the street is the first hop
	cell: [
		{ t: 0, pos: [-1.4, EYE, 8], look: [-1.05, 1.14, 6.4] },
		{ t: LEG.tap, pos: [-1.4, EYE + 0.02, 7.8], look: [-1.1, 1.2, 6.3] }
	]
};

const UP = new THREE.Vector3(0, 1, 0);

const smoothstep = (x: number) => {
	const c = Math.max(0, Math.min(1, x));
	return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export class JourneyWorld {
	#renderer: THREE.WebGLRenderer;
	#scene = new THREE.Scene();
	#camera: THREE.PerspectiveCamera;
	#canvas: HTMLCanvasElement;

	#sun = new THREE.DirectionalLight(0xffffff, 1.15);
	#hemi = new THREE.HemisphereLight(0xdcecff, 0x9aa3ab, 1.1);

	#phone = new THREE.Group();
	/** Comes down on the button as the request leaves, and lifts off again after. */
	#thumb!: THREE.Mesh;
	#screenCanvas!: HTMLCanvasElement;
	#screenTex!: THREE.CanvasTexture;
	#screenLight = new THREE.PointLight(0xbfe0ff, 0, 1.2, 2);

	#packet = new THREE.Group();
	#packetLight = new THREE.PointLight(0x8fc3ff, 0, 22, 2);
	#curves: Record<
		Mode,
		{
			toHop: THREE.CatmullRomCurve3;
			toTrunk: THREE.CatmullRomCurve3;
			trunk: THREE.CatmullRomCurve3;
		}
	>;

	/** Follows the camera underground, where the sun cannot reach. */
	#tunnelLight = new THREE.PointLight(0xbcd6ff, 0, 34, 2);

	#room = new THREE.Group();
	/** Lights the racks when the request is with them, and nothing before that. */
	#serverLight = new THREE.PointLight(0xdcefff, 0, 48, 2);
	#router = new THREE.Group();
	#tower = new THREE.Group();
	/**
	 * The cables, one group per mode, and deliberately NOT the same groups as the router
	 * and the mast. The mast group is positioned at the mast, so cable geometry built in
	 * world coordinates and parented to it came out shifted by the mast's own position:
	 * on mobile data the duct was drawn nine metres to the side of the road the request
	 * took, which read as a request travelling with no cable at all.
	 */
	#cables: Record<Mode, THREE.Group> = { wifi: new THREE.Group(), cell: new THREE.Group() };
	#rackLights: THREE.MeshBasicMaterial[] = [];
	/** The front of the machine that answers, which works harder than the rest. */
	#heroLights: THREE.MeshBasicMaterial[] = [];

	#state: JourneyState = { t: 0, mode: 'wifi', screen: { ...DEFAULT_SCREEN } };
	#drawnPhase = '';
	#drawnScreen = '';
	#look = new THREE.Vector3();
	#tmp = new THREE.Vector3();
	#side = new THREE.Vector3();

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
		this.#renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		// A phone on a slow connection is the audience here, so a full pixel ratio on a
		// small screen is battery spent where nothing is gained.
		const small = window.innerWidth < 768;
		this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.6 : 2));
		this.#renderer.setClearAlpha(0);
		this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;

		this.#camera = new THREE.PerspectiveCamera(58, 1, 0.05, 400);
		this.#scene.add(this.#camera);
		this.#scene.fog = new THREE.FogExp2(0xdbe6f0, 0.011);

		this.#sun.position.set(-14, 26, 14);
		this.#scene.add(this.#sun, this.#hemi, this.#tunnelLight);

		const curve = (r: Road) => ({
			toHop: new THREE.CatmullRomCurve3(r.toHop),
			toTrunk: new THREE.CatmullRomCurve3(r.toTrunk),
			trunk: new THREE.CatmullRomCurve3(r.trunk)
		});
		this.#curves = { wifi: curve(ROADS.wifi), cell: curve(ROADS.cell) };
		this.#scene.add(this.#cables.wifi, this.#cables.cell);

		this.#buildStreet();
		this.#buildSea();
		this.#buildRoom();
		this.#buildRouter();
		this.#buildTower();
		this.#buildBranch('wifi');
		this.#buildBranch('cell');
		this.#buildCable();
		this.#buildServer();
		this.#buildPacket();
		this.#buildPhone();

		this.resize();
		this.applyState({});
	}

	/* ── the world ────────────────────────────────────────────────────────── */

	#buildStreet() {
		// The street runs from behind you to the building at the end of it, and stops there.
		// Run past that point it went straight through the data centre.
		const from = 12;
		const len = from - SEA_FROM;
		const mid = (from + SEA_FROM) / 2;

		const road = new THREE.Mesh(
			new THREE.PlaneGeometry(14, len),
			new THREE.MeshStandardMaterial({ color: 0x9aa1a8, roughness: 0.95 })
		);
		road.rotation.x = -Math.PI / 2;
		road.position.set(0, 0, mid);
		this.#scene.add(road);

		// the pavement you are standing on, both sides
		const walkMat = new THREE.MeshStandardMaterial({ color: 0xd7d2c8, roughness: 0.9 });
		for (const x of [-9.5, 9.5]) {
			const walk = new THREE.Mesh(new THREE.BoxGeometry(5, 0.18, len), walkMat);
			walk.position.set(x, 0.09, mid);
			this.#scene.add(walk);
		}

		// centre dashes, thinning into the fog
		const dash = new THREE.PlaneGeometry(0.24, 2.4);
		const dashMat = new THREE.MeshBasicMaterial({ color: 0xf2f4f6 });
		const dashes = new THREE.InstancedMesh(dash, dashMat, 30);
		const m = new THREE.Matrix4();
		for (let i = 0; i < 30; i++) {
			m.makeRotationX(-Math.PI / 2);
			m.setPosition(0, 0.02, 4 - i * 7);
			dashes.setMatrixAt(i, m);
		}
		this.#scene.add(dashes);

		// blocks along both sides. Boxes, deliberately: this is a diagram of a street,
		// not a model of one, and detail here would compete with the packet.
		const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d8, roughness: 0.85 });
		const windowMat = new THREE.MeshStandardMaterial({
			color: 0x93a6b8,
			roughness: 0.25,
			metalness: 0.1
		});
		for (let i = 0; i < 6; i++) {
			for (const side of [-1, 1]) {
				// The block nearest you on the left is the one your room is inside, so it is
				// not drawn as a block. Drawn, its front wall stood between the camera and
				// the router and the whole indoor leg was a flat grey field.
				if (side < 0 && i === 0) continue;
				const w = 5 + ((i * 7) % 4);
				const h = 4 + ((i * 5) % 7);
				const d = 6 + ((i * 3) % 5);
				const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
				b.position.set(side * (15 + ((i * 2) % 3)), h / 2, 2 - i * 11 - (side > 0 ? 4 : 0));
				this.#scene.add(b);

				const glass = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.55, 0.1), windowMat);
				glass.position.set(b.position.x - side * (w / 2 + 0.04), h * 0.55, b.position.z);
				glass.rotation.y = Math.PI / 2;
				this.#scene.add(glass);
			}
		}
	}

	/**
	 * The sea the cable crosses, and the floor it lies on.
	 *
	 * Drawn as a volume rather than a surface, because the shot goes INTO it: the water is
	 * a box the camera flies through, lit from a bright ceiling that is the underside of
	 * the surface. What it is for is scale. A request that only ever runs under a pavement
	 * feels like it went to the next street.
	 */
	#buildSea() {
		const len = SEA_FROM - SEA_TO;
		const mid = (SEA_FROM + SEA_TO) / 2;

		const bed = new THREE.Mesh(
			new THREE.PlaneGeometry(80, len),
			new THREE.MeshStandardMaterial({ color: 0x6f7f86, roughness: 1 })
		);
		bed.rotation.x = -Math.PI / 2;
		bed.position.set(2.6, SEA_BED - 0.5, mid);

		// the water, seen from the inside
		const water = new THREE.Mesh(
			new THREE.BoxGeometry(80, Math.abs(SEA_BED) + 0.5, len),
			new THREE.MeshStandardMaterial({
				color: 0x2f7fa8,
				roughness: 0.4,
				transparent: true,
				opacity: 0.5,
				side: THREE.DoubleSide
			})
		);
		water.position.set(2.6, (SEA_BED - 0.5) / 2, mid);

		// the underside of the surface, which is the brightest thing down there
		const surface = new THREE.Mesh(
			new THREE.PlaneGeometry(80, len),
			new THREE.MeshBasicMaterial({ color: 0xbfe3f2, side: THREE.DoubleSide })
		);
		surface.rotation.x = -Math.PI / 2;
		surface.position.set(2.6, -0.05, mid);

		// the two shores, so the cable is seen going in and coming out
		const shoreMat = new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 1 });
		for (const [z, depth] of [
			[SEA_FROM + 4, 14],
			[SEA_TO - 4, 14]
		] as [number, number][]) {
			const shore = new THREE.Mesh(new THREE.BoxGeometry(80, 0.5, depth), shoreMat);
			shore.position.set(2.6, -0.25, z);
			this.#scene.add(shore);
		}

		// the land on the far side, which the building stands on
		const far = new THREE.Mesh(
			new THREE.PlaneGeometry(80, 90),
			new THREE.MeshStandardMaterial({ color: 0xa8a89c, roughness: 1 })
		);
		far.rotation.x = -Math.PI / 2;
		far.position.set(2.6, 0, SEA_TO - 45);

		this.#scene.add(bed, water, surface, far);
	}

	/**
	 * The room you are standing in when you are on home WiFi.
	 *
	 * Four walls seen from the inside, a window with the daylight coming through it, and
	 * the shelf the router sits on. It is a room and not a street because that is where
	 * home WiFi actually happens, and the lesson's whole point is that this hop is the
	 * short one.
	 */
	#buildRoom() {
		const shell = new THREE.Mesh(
			new THREE.BoxGeometry(5.4, 2.8, 6),
			new THREE.MeshStandardMaterial({ color: 0xf1ece3, roughness: 0.95, side: THREE.BackSide })
		);
		shell.position.set(ROOM.x, 1.4, ROOM.z);
		this.#room.add(shell);

		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(5.4, 6),
			new THREE.MeshStandardMaterial({ color: 0xb08b62, roughness: 0.9 })
		);
		floor.rotation.x = -Math.PI / 2;
		floor.position.set(ROOM.x, 0.02, ROOM.z);
		this.#room.add(floor);

		// the window, and the daylight that comes through it
		const glass = new THREE.Mesh(
			new THREE.PlaneGeometry(1.9, 1.3),
			new THREE.MeshBasicMaterial({ color: 0xdff0ff })
		);
		glass.position.set(ROOM.x + 2.68, 1.55, ROOM.z - 0.4);
		glass.rotation.y = -Math.PI / 2;
		const frame = new THREE.Mesh(
			new THREE.BoxGeometry(0.08, 1.5, 2.1),
			new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
		);
		frame.position.set(ROOM.x + 2.64, 1.55, ROOM.z - 0.4);
		const daylight = new THREE.PointLight(0xfff2dd, 12, 9, 2);
		daylight.position.set(ROOM.x + 2, 1.7, ROOM.z - 0.4);
		this.#room.add(glass, frame, daylight);

		// a shelf for the router, and a table under the window, so the room is a room
		const woodMat = new THREE.MeshStandardMaterial({ color: 0xc8a882, roughness: 0.85 });
		const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.07, 0.5), woodMat);
		shelf.position.set(ROUTER.x, ROUTER.y - 0.14, ROUTER.z);
		const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), woodMat);
		table.position.set(ROOM.x + 1.7, 0.75, ROOM.z + 1.4);
		this.#room.add(shelf, table);

		this.#scene.add(this.#room);
	}

	/** The router on that shelf, which is where a request from home goes first. */
	#buildRouter() {
		const body = new THREE.Mesh(
			new THREE.BoxGeometry(0.62, 0.16, 0.42),
			new THREE.MeshStandardMaterial({ color: 0xf7f8fa, roughness: 0.6 })
		);
		const led = new THREE.Mesh(
			new THREE.SphereGeometry(0.035, 10, 10),
			new THREE.MeshBasicMaterial({ color: 0x3a9c64 })
		);
		led.position.set(0.2, 0.1, 0.1);
		// two little antennas, which is how everyone draws a router
		for (const x of [-0.22, 0.22]) {
			const a = new THREE.Mesh(
				new THREE.CylinderGeometry(0.022, 0.022, 0.42, 8),
				new THREE.MeshStandardMaterial({ color: 0x2b3440 })
			);
			a.position.set(ROUTER.x + x, ROUTER.y + 0.25, ROUTER.z - 0.1);
			a.rotation.z = x < 0 ? 0.3 : -0.3;
			this.#router.add(a);
		}
		body.position.copy(ROUTER);
		led.position.set(ROUTER.x + 0.2, ROUTER.y + 0.1, ROUTER.z + 0.1);
		// the lead that leaves the router, down the wall and into the floor
		const drop = new THREE.Mesh(
			new THREE.CylinderGeometry(0.032, 0.032, ROUTER.y - 0.1, 8),
			new THREE.MeshStandardMaterial({ color: 0x33404e, roughness: 0.75 })
		);
		drop.position.set(ROUTER.x + 0.26, (ROUTER.y - 0.1) / 2, ROUTER.z - 0.12);
		this.#router.add(body, led, drop);
		this.#scene.add(this.#router);
	}

	/** The tower down the street, the one the lesson asks about. */
	#buildTower() {
		const steel = new THREE.MeshStandardMaterial({
			color: 0xb8bec6,
			roughness: 0.55,
			metalness: 0.5
		});
		// three legs and a few crossbars, which reads as a lattice mast without being one
		for (let i = 0; i < 3; i++) {
			const a = (i / 3) * Math.PI * 2;
			const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, TOWER.height, 6), steel);
			leg.position.set(Math.cos(a) * 0.9, TOWER.height / 2, Math.sin(a) * 0.9);
			leg.rotation.z = -Math.cos(a) * 0.05;
			leg.rotation.x = Math.sin(a) * 0.05;
			this.#tower.add(leg);
		}
		for (let i = 1; i <= 5; i++) {
			const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.045, 6, 12), steel);
			ring.position.y = (TOWER.height / 6) * i;
			ring.rotation.x = Math.PI / 2;
			this.#tower.add(ring);
		}
		// the panels near the top, three of them facing out
		for (let i = 0; i < 3; i++) {
			const a = (i / 3) * Math.PI * 2 + 0.4;
			const panel = new THREE.Mesh(
				new THREE.BoxGeometry(0.28, 1.5, 0.7),
				new THREE.MeshStandardMaterial({ color: 0xf1f3f5, roughness: 0.7 })
			);
			panel.position.set(Math.cos(a) * 1.5, TOWER.height - 1.2, Math.sin(a) * 1.5);
			panel.lookAt(0, TOWER.height - 1.2, 0);
			this.#tower.add(panel);
		}
		this.#tower.position.set(TOWER.x, 0, TOWER.z);
		this.#scene.add(this.#tower);
	}

	/**
	 * The trench, the cable in it, and the chamber where one becomes the other.
	 *
	 * Two gauges, and the difference is the lesson. What leaves your router (or the foot of
	 * the mast) is YOUR line, thin, and it ends at a junction chamber a little way down the
	 * street. From that chamber on there is one thick duct, and that one is the ISP's. Both
	 * are built from the very points the request is placed on, so the request cannot be
	 * seen outside its own cable.
	 */
	#buildCable() {
		// Soil under the two stretches of land only. Run the length of the world it would
		// have filled the sea with earth.
		const soilMat = new THREE.MeshStandardMaterial({
			color: 0x6b6155,
			roughness: 1,
			side: THREE.BackSide
		});
		for (const [from, to] of [
			[14, SEA_FROM - 2],
			[SEA_TO + 2, SERVER_Z - 20]
		] as [number, number][]) {
			const soil = new THREE.Mesh(new THREE.BoxGeometry(36, 6, from - to), soilMat);
			soil.position.set(-6, CABLE_Y - 0.6, (from + to) / 2);
			this.#scene.add(soil);
		}

		// Both sides. The camera rides INSIDE this duct on land and BESIDE it at sea, and a
		// back facing tube is invisible from outside: the cable on the seabed, the one shot
		// that is entirely about the cable, would have been an empty stretch of water.
		const sheathMat = new THREE.MeshStandardMaterial({
			color: 0x2f3945,
			roughness: 0.8,
			side: THREE.DoubleSide
		});
		const coreMat = new THREE.MeshBasicMaterial({ color: 0x7fc4ff });

		for (const mode of ['wifi', 'cell'] as Mode[]) {
			const road = ROADS[mode];
			const group = this.#cables[mode];

			// your own line, from where it enters the ground to the chamber
			const lead = road.toTrunk.filter((p) => p.y < -0.6);
			if (lead.length >= 2) {
				const path = new THREE.CatmullRomCurve3(lead);
				group.add(
					new THREE.Mesh(new THREE.TubeGeometry(path, 60, 0.38, 10, false), sheathMat),
					new THREE.Mesh(new THREE.TubeGeometry(path, 60, 0.05, 6, false), coreMat)
				);
			}

			// the ISP's own cable, thicker, from the chamber to the building
			const trunk = road.trunk.filter((p) => p.y < -0.6);
			if (trunk.length >= 2) {
				const path = new THREE.CatmullRomCurve3(trunk);
				const fibre = new THREE.Mesh(new THREE.TubeGeometry(path, 110, 0.08, 6, false), coreMat);
				fibre.position.y = -0.3;
				group.add(
					new THREE.Mesh(new THREE.TubeGeometry(path, 110, 0.62, 12, false), sheathMat),
					fibre
				);
			}

			// the chamber itself, which is the hand over
			const j = JUNCTION[mode];
			const box = new THREE.Mesh(
				new THREE.BoxGeometry(2.4, 2, 2.4),
				new THREE.MeshStandardMaterial({ color: 0x8d8579, roughness: 1 })
			);
			box.position.set(j.x, j.y + 0.1, j.z);
			const rim = new THREE.Mesh(
				new THREE.BoxGeometry(2.7, 0.18, 2.7),
				new THREE.MeshStandardMaterial({ color: 0xa9a194, roughness: 0.9 })
			);
			rim.position.set(j.x, j.y + 1.1, j.z);
			group.add(box, rim);
		}

		// the climb out of the ground and in through the building wall, at duct gauge
		const riser = new THREE.CatmullRomCurve3(TRUNK_TAIL.slice(2, 6));
		const sheath = new THREE.Mesh(
			new THREE.TubeGeometry(riser, 50, 0.16, 8, false),
			new THREE.MeshStandardMaterial({ color: 0x33404e, roughness: 0.75 })
		);
		const core = new THREE.Mesh(
			new THREE.TubeGeometry(riser, 50, 0.06, 6, false),
			new THREE.MeshBasicMaterial({ color: 0x7fc4ff })
		);

		// and the lead that carries on inside, along the floor by the left hand row
		const inside = new THREE.CatmullRomCurve3([
			new THREE.Vector3(2.6, 1.35, ROOM_FRONT - 1.5),
			new THREE.Vector3(1.7, 0.24, ROOM_FRONT - 4.5),
			new THREE.Vector3(1.7, 0.24, ANSWERS_AT.z + 5.5),
			new THREE.Vector3(ANSWERS_AT.x - 0.55, 1, ANSWERS_AT.z + 1.1)
		]);
		const roomLead = new THREE.Mesh(
			new THREE.TubeGeometry(inside, 60, 0.07, 6, false),
			new THREE.MeshStandardMaterial({ color: 0x33404e, roughness: 0.75 })
		);

		// the cabinet the cable surfaces into, in front of the building
		const cabinet = new THREE.Mesh(
			new THREE.BoxGeometry(0.9, 1.5, 0.7),
			new THREE.MeshStandardMaterial({ color: 0xb9bec4, roughness: 0.7 })
		);
		cabinet.position.set(2.6, 0.75, TRENCH_END + 1);
		this.#scene.add(sheath, core, roomLead, cabinet);
	}

	/**
	 * The other end of the cable: a room ABOVE GROUND, full of machines.
	 *
	 * Above ground because that is where a data centre is. The room used to sit at the
	 * cable's own depth, which put it inside the trench, and the arrival read as more
	 * pipe. Now the cable climbs out of the ground, comes in through the wall, and the
	 * camera walks in after it with a row of machines either side.
	 */
	#buildServer() {
		const centre = 2.6;
		const back = SERVER_Z - 26;
		const depth = ROOM_FRONT - back;
		const mid = (ROOM_FRONT + back) / 2;

		const shell = new THREE.Mesh(
			new THREE.BoxGeometry(15, 5.4, depth),
			new THREE.MeshStandardMaterial({ color: 0x3b444f, roughness: 0.95, side: THREE.BackSide })
		);
		shell.position.set(centre, 2.7, mid);
		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(15, depth),
			new THREE.MeshStandardMaterial({ color: 0x59636e, roughness: 0.8 })
		);
		floor.rotation.x = -Math.PI / 2;
		floor.position.set(centre, 0.02, mid);
		this.#scene.add(shell, floor);

		// two rows of machines with a corridor between them, which is what a server room is
		const rackMat = new THREE.MeshStandardMaterial({ color: 0x1c232c, roughness: 0.6 });
		const trimMat = new THREE.MeshStandardMaterial({ color: 0x39434f, roughness: 0.5 });
		for (const side of [-1, 1]) {
			for (let i = 0; i < 7; i++) {
				const z = SERVER_Z - 1 - i * 2.6;
				const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 2.3), rackMat);
				rack.position.set(centre + side * 3.2, 1.7, z);
				const trim = new THREE.Mesh(new THREE.BoxGeometry(0.07, 3.4, 2.3), trimMat);
				trim.position.set(centre + side * 2.4, 1.7, z);
				this.#scene.add(rack, trim);

				// the lights on the front of each machine, facing the corridor
				for (let j = 0; j < 7; j++) {
					const mat = new THREE.MeshBasicMaterial({ color: 0x6fe3a0 });
					const led = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.07), mat);
					led.position.set(centre + side * 2.36, 2.95 - j * 0.4, z);
					led.rotation.y = (side * -Math.PI) / 2;
					this.#rackLights.push(mat);
					this.#scene.add(led);
				}
			}
		}

		// The one machine the request actually goes to, square on to the corridor so it is
		// something you stand in front of rather than something you drive past.
		const hero = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4, 1.6), rackMat);
		hero.position.copy(ANSWERS_AT);
		const face = new THREE.Mesh(
			new THREE.BoxGeometry(2.2, 3.6, 0.08),
			new THREE.MeshStandardMaterial({ color: 0x121820, roughness: 0.5 })
		);
		face.position.set(ANSWERS_AT.x, ANSWERS_AT.y, ANSWERS_AT.z + 0.83);
		this.#scene.add(hero, face);
		for (let j = 0; j < 9; j++) {
			const mat = new THREE.MeshBasicMaterial({ color: 0x6fe3a0 });
			const led = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.09), mat);
			led.position.set(ANSWERS_AT.x, ANSWERS_AT.y + 1.5 - j * 0.36, ANSWERS_AT.z + 0.88);
			this.#heroLights.push(mat);
			this.#scene.add(led);
		}

		// strip lights overhead, so the room is lit rather than merely called a room
		for (let i = 0; i < 6; i++) {
			const strip = new THREE.Mesh(
				new THREE.PlaneGeometry(1.2, 4.6),
				new THREE.MeshBasicMaterial({ color: 0xeaf4ff })
			);
			strip.rotation.x = Math.PI / 2;
			strip.position.set(centre, 5.15, ROOM_FRONT - 3 - i * 5);
			this.#scene.add(strip);
		}

		// The building itself, seen from the street. Its faces are FrontSide, so it is solid
		// from outside and invisible once the camera is in the room, which is how the shot
		// gets to walk in without a door being opened.
		const outside = new THREE.Mesh(
			new THREE.BoxGeometry(17, 6.6, depth + 2),
			new THREE.MeshStandardMaterial({ color: 0xd8d2c7, roughness: 0.9 })
		);
		outside.position.set(centre, 3.3, mid);
		const band = new THREE.Mesh(
			new THREE.BoxGeometry(17.2, 0.5, depth + 2.2),
			new THREE.MeshStandardMaterial({ color: 0x2e6fe0, roughness: 0.6 })
		);
		// clear of the room's own ceiling at 5.4, or it shows through as a blue sky indoors
		band.position.set(centre, 6.35, mid);
		const door = new THREE.Mesh(
			new THREE.PlaneGeometry(3.2, 2.6),
			new THREE.MeshStandardMaterial({ color: 0x16212b, roughness: 0.4 })
		);
		door.position.set(centre, 1.3, ROOM_FRONT + 1.02);
		this.#scene.add(outside, band, door);

		// close to the machine that answers, which is the thing the reader is looking at
		this.#serverLight.position.set(centre, 3.4, ANSWERS_AT.z + 4);
		this.#scene.add(this.#serverLight);
	}

	/**
	 * The cable the request drops into, drawn along the very road the packet takes.
	 *
	 * It was missing, and what the reader saw was a request stepping off a router and
	 * reappearing inside a big trunk cable with nothing joining the two. Drawing it from
	 * the same curve means the cable and the packet can never disagree about where the
	 * road runs.
	 */
	#buildBranch(mode: Mode) {
		const road = ROADS[mode];
		// Only the part above the trench: below it the duct built in `#buildCable` is the
		// cable, and drawing both would be two cables where the lesson has one.
		const above = road.toTrunk.filter((p) => p.y >= -1.2);
		const first = road.toTrunk.find((p) => p.y < -1.2);
		const path = new THREE.CatmullRomCurve3(first ? [...above, first] : above);
		const sheath = new THREE.Mesh(
			new THREE.TubeGeometry(path, 60, 0.075, 8, false),
			new THREE.MeshStandardMaterial({ color: 0x33404e, roughness: 0.75 })
		);
		const core = new THREE.Mesh(
			new THREE.TubeGeometry(path, 60, 0.03, 6, false),
			new THREE.MeshBasicMaterial({ color: 0x7fc4ff })
		);
		this.#cables[mode].add(sheath, core);
	}

	#buildPacket() {
		// Small on purpose. At the size it started, the request was a beach ball sitting on
		// a router the size of a paperback, and the room stopped reading as a room.
		const core = new THREE.Mesh(
			new THREE.SphereGeometry(0.075, 16, 16),
			new THREE.MeshBasicMaterial({ color: 0xffffff })
		);
		const halo = new THREE.Mesh(
			new THREE.SphereGeometry(0.17, 16, 16),
			new THREE.MeshBasicMaterial({ color: 0x2e6fe0, transparent: true, opacity: 0.36 })
		);
		this.#packet.add(core, halo, this.#packetLight);
		this.#packet.visible = false;
		this.#scene.add(this.#packet);
	}

	/* ── the phone in your hand ───────────────────────────────────────────── */

	#buildPhone() {
		const body = new THREE.Mesh(
			new THREE.BoxGeometry(0.15, 0.31, 0.012),
			new THREE.MeshStandardMaterial({ color: 0x1c242e, roughness: 0.45 })
		);

		const cv = document.createElement('canvas');
		cv.width = 360;
		cv.height = 740;
		this.#screenCanvas = cv;
		this.#screenTex = new THREE.CanvasTexture(cv);
		this.#screenTex.colorSpace = THREE.SRGBColorSpace;
		const screen = new THREE.Mesh(
			new THREE.PlaneGeometry(0.138, 0.296),
			new THREE.MeshBasicMaterial({ map: this.#screenTex })
		);
		screen.position.z = 0.0075;

		// a hand: a palm and four fingers, held to the same restraint as the street
		const skin = new THREE.MeshStandardMaterial({ color: 0xc99c78, roughness: 0.85 });
		const hand = new THREE.Group();
		const palm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.17, 0.05), skin);
		palm.position.set(0, -0.12, -0.045);
		hand.add(palm);
		// Fingers stay BEHIND the phone and only their tips come round its left edge, which
		// is what a hand holding a phone actually shows. Four of them laid across the face
		// were four fingertips poking through the glass, and set at the edge they read as
		// four loose sausages, so they are tips and nothing more.
		for (let i = 0; i < 4; i++) {
			const tip = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.022, 4, 8), skin);
			tip.position.set(-0.069, -0.035 - i * 0.04, -0.012);
			tip.rotation.z = Math.PI / 2;
			hand.add(tip);
		}
		// The thumb is the one finger that has a job here, so it is the one you can see.
		this.#thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.06, 4, 8), skin);
		this.#thumb.rotation.z = -0.35;
		hand.add(this.#thumb);

		this.#phone.add(body, screen, hand, this.#screenLight);
		this.#screenLight.position.set(0, 0, 0.05);
		// Held where a person holds it, a little right of centre and low in the frame.
		// It is parented to the camera, so this is a position ON SCREEN, not in the
		// street: hang it as low as a real hand would and it falls straight out of the
		// bottom of a 58 degree lens, which is exactly what happened the first time.
		this.#phone.position.set(0.035, -0.07, -0.55);
		this.#phone.rotation.set(0.16, -0.12, 0.02);
		this.#camera.add(this.#phone);
		this.#drawScreen('ask');
	}

	/** Draws the phone screen. Only called when the phase or the strings change. */
	#drawScreen(phase: 'ask' | 'sending' | 'done') {
		const g = this.#screenCanvas.getContext('2d');
		if (!g) return;
		const s = this.#state.screen;
		const W = this.#screenCanvas.width;
		const H = this.#screenCanvas.height;

		g.fillStyle = '#ffffff';
		g.fillRect(0, 0, W, H);

		// the address bar, which is the one thing every browser has in common
		g.fillStyle = '#f1efe9';
		g.fillRect(0, 0, W, 96);
		g.fillStyle = '#ffffff';
		roundRect(g, 22, 30, W - 44, 46, 23);
		g.fill();
		g.fillStyle = '#16212b';
		g.font = '600 22px system-ui, sans-serif';
		g.textAlign = 'center';
		g.fillText(s.site, W / 2, 60);

		if (phase === 'ask') {
			g.fillStyle = '#8a949d';
			g.font = '500 20px system-ui, sans-serif';
			g.fillText(s.site, W / 2, H / 2 - 40);
			roundRect(g, 54, H / 2, W - 108, 78, 24);
			g.fillStyle = '#2e6fe0';
			g.fill();
			g.fillStyle = '#ffffff';
			g.font = '700 28px system-ui, sans-serif';
			g.fillText(s.button, W / 2, H / 2 + 48);
		} else if (phase === 'sending') {
			g.strokeStyle = '#2e6fe0';
			g.lineWidth = 7;
			g.beginPath();
			g.arc(W / 2, H / 2, 46, -Math.PI / 2, Math.PI * 0.85);
			g.stroke();
			g.fillStyle = '#8a949d';
			g.font = '500 22px system-ui, sans-serif';
			g.fillText(s.sending, W / 2, H / 2 + 110);
		} else {
			// The page, arrived. Drawn as an actual page rather than announced with the words
			// "page loaded": the whole journey exists to deliver this, and delivering a label
			// that says a page arrived is not the same as the page arriving.
			const p = s.page;

			// the site's own header
			g.fillStyle = '#2e6fe0';
			g.font = '700 26px system-ui, sans-serif';
			g.textAlign = 'left';
			g.fillText('nimbus', 28, 138);
			g.fillStyle = '#c9d3dd';
			for (let i = 0; i < 3; i++) {
				roundRect(g, 300, 122 + i * 8, 32, 3, 2);
				g.fill();
			}

			// the hero, with Nim in it
			g.fillStyle = '#eaf1fc';
			roundRect(g, 22, 162, W - 44, 196, 22);
			g.fill();
			g.fillStyle = '#ffffff';
			g.beginPath();
			g.ellipse(W / 2, 268, 62, 38, 0, 0, Math.PI * 2);
			g.arc(W / 2 - 30, 248, 26, 0, Math.PI * 2);
			g.arc(W / 2, 236, 34, 0, Math.PI * 2);
			g.arc(W / 2 + 30, 248, 26, 0, Math.PI * 2);
			g.fill();
			// Nim's hat and eyes, the two marks that make the cloud a character
			g.fillStyle = '#dd9e36';
			g.beginPath();
			g.moveTo(W / 2 - 26, 218);
			g.quadraticCurveTo(W / 2, 190, W / 2 + 26, 218);
			g.fill();
			roundRect(g, W / 2 - 32, 214, 64, 9, 4);
			g.fill();
			g.fillStyle = '#16212b';
			g.beginPath();
			g.arc(W / 2 - 13, 240, 4.5, 0, Math.PI * 2);
			g.arc(W / 2 + 13, 240, 4.5, 0, Math.PI * 2);
			g.fill();

			// the headline and the line under it
			g.fillStyle = '#16212b';
			g.font = '700 30px system-ui, sans-serif';
			let y = wrap(g, p.title, 28, 404, W - 56, 38);
			g.fillStyle = '#5e6b76';
			g.font = '400 19px system-ui, sans-serif';
			y = wrap(g, p.body, 28, y + 18, W - 56, 27);

			// the call to action
			g.fillStyle = '#2e6fe0';
			roundRect(g, 28, y + 22, 190, 54, 27);
			g.fill();
			g.fillStyle = '#ffffff';
			g.font = '600 21px system-ui, sans-serif';
			g.textAlign = 'center';
			g.fillText(p.cta, 123, y + 56);
			g.textAlign = 'left';

			// two chapters below the fold, each a card with a mark and a title
			for (const [i, label] of [p.cardA, p.cardB].entries()) {
				// Clamped so a long headline in either language cannot push the second card
				// off the bottom of the screen.
				const top = Math.min(y + 100, H - 160) + i * 74;
				g.fillStyle = '#f4f2ee';
				roundRect(g, 28, top, W - 56, 60, 16);
				g.fill();
				g.fillStyle = '#2e6fe0';
				roundRect(g, 44, top + 18, 24, 24, 8);
				g.fill();
				g.fillStyle = '#16212b';
				g.font = '600 18px system-ui, sans-serif';
				g.fillText(label, 82, top + 36);
			}
		}
		g.textAlign = 'left';

		this.#screenTex.needsUpdate = true;
		this.#drawnPhase = phase;
		this.#drawnScreen = JSON.stringify(s);
	}

	/* ── state ────────────────────────────────────────────────────────────── */

	applyState(partial: Partial<JourneyState>) {
		this.#state = { ...this.#state, ...partial };
		const t = clamp01(this.#state.t);

		this.#place(t);

		const phase: 'ask' | 'sending' | 'done' =
			t < LEG.tap ? 'ask' : t < LEG.home - 0.03 ? 'sending' : 'done';
		if (phase !== this.#drawnPhase || JSON.stringify(this.#state.screen) !== this.#drawnScreen) {
			this.#drawScreen(phase);
		}

		// Rendered here and now, not on the next animation frame. Scroll is the only clock
		// this scene has, and a frame loop stops being called the moment the tab is not the
		// one in front, which left the canvas showing a leg the caption had long left.
		this.renderOnce();
	}

	/**
	 * Where the camera is, where the request is, and whether the phone is in shot.
	 *
	 * The camera FOLLOWS the request. It watched from the side once, from a set of fixed
	 * positions, and the honest reaction to that was "where is the signal, where am I".
	 * Now there are only three places the camera can be: behind your own eyes with the
	 * phone in your hand, a length behind the request while it travels, and standing in
	 * front of the machine while the machine works.
	 */
	#place(t: number) {
		const travelling = t > LEG.tap && t < LEG.home;
		const working = t >= LEG.server && t <= LEG.answer;
		const back = t > LEG.answer;

		// where along its road the request is, which is also the return read backwards
		// The way home is the way out read backwards, at the same pace. The mirror itself
		// lives in `legs.ts`, because the board beside the picture lights its stations off
		// the same number.
		const w = roadPosition(t);

		// your own eyes, holding the phone
		const eye = this.#eyeShot(Math.min(t, LEG.tap));

		if (!travelling) {
			this.#camera.position.copy(eye.pos);
			this.#look.copy(eye.look);
		} else {
			// A fixed LENGTH behind the request, not a fixed slice of the timeline. As a
			// slice, the same offset meant two metres on the long buried run and a hand's
			// width on the hop to the router, where the camera ended up inside the very
			// thing it was following and the screen was one blue blur.
			const here = this.#packetAt(clamp01(w));
			const step = back ? -0.004 : 0.004;
			const dir = this.#packetAt(clamp01(w + step)).sub(here);
			if (dir.lengthSq() < 1e-8) dir.set(0, 0, -1);
			dir.normalize();
			// A TALL vertical stretch, which in this scene means the mast and nothing else.
			// Following from behind there means hanging directly above the request looking
			// at the ground, which is a dark disc and nothing else, so the camera steps to
			// one side and watches it come down the outside of the mast. The short drop from
			// the router to the floor stays a chase: the room is three metres across, and a
			// camera stepped aside in there is a camera inside the shelf.
			if (Math.abs(dir.y) > 0.7 && here.y > 3) {
				this.#side.crossVectors(dir, UP);
				if (this.#side.lengthSq() < 1e-8) this.#side.set(1, 0, 0);
				this.#side.normalize();
				this.#camera.position
					.copy(here)
					.addScaledVector(this.#side, 8.5)
					.addScaledVector(UP, dir.y < 0 ? 3 : -3)
					.addScaledVector(dir, -1);
				this.#look.copy(here).addScaledVector(dir, 0.6);
			} else if (here.z < SEA_FROM && here.z > SEA_TO && here.y < -3) {
				// Out at sea the camera swings wide and rides beside the cable instead of
				// down its middle. From behind, a pipe on a seabed looks like every other
				// pipe; from out here the cable runs away to the horizon with the surface
				// above it, which is the only shot in this scene that shows how far the
				// water goes.
				this.#side.crossVectors(dir, UP);
				if (this.#side.lengthSq() < 1e-8) this.#side.set(1, 0, 0);
				this.#side.normalize();
				this.#camera.position
					.copy(here)
					.addScaledVector(this.#side, 7)
					.addScaledVector(UP, 3.2)
					.addScaledVector(dir, -5);
				this.#look.copy(here).addScaledVector(dir, 12);
			} else {
				// Where the cable runs along a floor, the camera rides ABOVE it and watches
				// the request run along it. Kept on the axis, as it is while riding the
				// buried duct, a lead of finger thickness becomes a black tube across the
				// middle of the room.
				const alongFloor = here.y > -1 && here.y < 0.8;
				this.#camera.position
					.copy(here)
					.addScaledVector(dir, alongFloor ? -3.2 : -2.4)
					.addScaledVector(UP, alongFloor ? 1.15 : 0.22);
				// Indoors there is a ceiling, and following a request DOWN puts the camera
				// the same distance UP. On the drop from the router it went straight through
				// the ceiling and looked back into the room from above it.
				if (here.y > -1 && here.y < 2.6) {
					this.#camera.position.y = Math.min(this.#camera.position.y, 2.3);
				}
				this.#look.copy(here).addScaledVector(dir, 2.5);
			}

			// Eased in and out of the hand, so leaving and landing are not cuts. Measured on
			// how far the request is from the phone rather than on the clock: on the clock
			// the landing blend began while the answer was still crossing the city, and the
			// camera was hauled back into the room with the request nowhere near it.
			const blend = smoothstep((w - LEG.tap) / 0.035);
			this.#camera.position.lerpVectors(eye.pos, this.#camera.position, blend);
			this.#look.lerpVectors(eye.look, this.#look, blend);

			// And while the machine has it, the camera draws back and stands in front of
			// that machine. Drawn back rather than cut to: at chase distance the rack
			// filled the frame and there was no room left to see it was a room.
			// Held longer on the way out of this shot than on the way in, which is the turn:
			// the camera stays put facing the machine while the answer sets off, swings
			// round to the way home, and only then starts following again.
			const stand = smoothstep((t - LEG.server) / 0.03) * (1 - smoothstep((t - LEG.answer) / 0.06));
			if (stand > 0) {
				this.#tmp.set(ANSWERS_AT.x, ANSWERS_AT.y + 0.35, ANSWERS_AT.z + 8.5);
				this.#camera.position.lerp(this.#tmp, stand);
				this.#look.lerp(ANSWERS_AT, stand);
			}
		}
		this.#camera.lookAt(this.#look);

		// The request itself, always in shot while it travels and never while the machine
		// has it: it has gone inside, and the lights on the front are what it is doing.
		this.#packet.visible = travelling && !working;
		if (this.#packet.visible) {
			this.#packet.position.copy(this.#packetAt(clamp01(w)));
			this.#packetLight.intensity = 9;
			// Sized against how far the camera has stepped away. The shots are not all taken
			// from the same distance any more, and a request that reads as a bright ball in
			// the cable was a speck beside a seventeen metre mast.
			const d = this.#camera.position.distanceTo(this.#packet.position);
			this.#packet.scale.setScalar(Math.max(1, Math.min(3.2, d / 2.6)));
		}

		// The phone is only in shot while you are the one holding it. Once the camera is
		// following the request, a hand floating through a fibre would be nonsense.
		this.#phone.visible = t < LEG.tap + 0.04 || t > LEG.home - 0.02;
		// The hand comes up into reading position at the very start, so nobody arrives at
		// a phone already held to the face.
		const lift = 1 - smoothstep(t / 0.06);
		const raise = t > LEG.home ? smoothstep((t - LEG.home) / 0.05) : 0;
		this.#phone.position.set(
			0.035 - raise * 0.02 + lift * 0.02,
			-0.07 + raise * 0.02 - lift * 0.08,
			-0.55 + raise * 0.06 + lift * 0.04
		);
		this.#phone.rotation.set(0.16 + lift * 0.26, -0.12 - lift * 0.07, 0.02 + lift * 0.05);

		// The thumb comes onto the button as the tap lands, and rests at the edge either
		// side of that moment. The press is the one thing in this scene the reader waits
		// for, so it happens on the frame the request is born on.
		const press = t < LEG.tap ? smoothstep(t / LEG.tap) : 1 - smoothstep((t - LEG.tap) / 0.06);
		this.#thumb.position.set(0.075 - press * 0.06, -0.1 + press * 0.075, 0.024);

		// Underground the sun is gone, so the camera brings its own light. How far under it
		// is read from the camera's own height rather than from the timeline, since the
		// shot climbs out of the trench into a lit building at the end of it.
		const under = clamp01((0.3 - this.#camera.position.y) / 2.2);
		const cam = this.#camera.position;
		const inSea = cam.z < SEA_FROM && cam.z > SEA_TO && cam.y < 0;
		// In a duct the camera carries the only light there is. In the sea it does not: the
		// water is lit from the surface, and a lamp on the lens there just washes it out.
		this.#tunnelLight.intensity = inSea ? 8 : under * 26;
		this.#tunnelLight.position.copy(cam);
		this.#screenLight.intensity = this.#phone.visible ? lerp(0.4, 1.8, under) : 0;
		const fog = this.#scene.fog as THREE.FogExp2;
		fog.density = inSea ? 0.017 : lerp(0.011, 0.05, under);
		fog.color.setHex(inSea ? 0x2b6f92 : under > 0.5 ? 0x121a22 : 0xdbe6f0);

		// Only one of the two first hops is the one in use, and only one of the two places
		// you can be standing in. The room is hidden on mobile data, otherwise the camera
		// would fly out of a room the reader was never in.
		const indoors = this.#state.mode === 'wifi';
		this.#room.visible = indoors;
		this.#router.visible = indoors;
		this.#tower.visible = !indoors;
		this.#cables.wifi.visible = indoors;
		this.#cables.cell.visible = !indoors;

		// The far end lights up as the request gets near it, so the arrival is something
		// the reader sees rather than something the caption claims.
		this.#serverLight.intensity =
			26 * smoothstep((t - LEG.cable) / 0.08) * (t < LEG.home ? 1 : 0.3);

		// the racks answer while the request is with them, and the one holding it works hardest
		const busy = t > LEG.cable && t < LEG.home;
		this.#rackLights.forEach((m, i) => {
			m.color.setHex(busy && (i + Math.floor(t * 60)) % 5 === 0 ? 0xffffff : 0x6fe3a0);
		});
		this.#heroLights.forEach((m, i) => {
			m.color.setHex(working && (i + Math.floor(t * 600)) % 3 === 0 ? 0xffffff : 0x6fe3a0);
		});
	}

	/** Your own eyes, at the start and at the end. */
	#eyeShot(u: number) {
		const shots = SHOTS[this.#state.mode];
		const a = shots[0];
		const b = shots[1];
		const k = smoothstep(b.t <= 0 ? 0 : u / b.t);
		return {
			pos: new THREE.Vector3(
				lerp(a.pos[0], b.pos[0], k),
				lerp(a.pos[1], b.pos[1], k),
				lerp(a.pos[2], b.pos[2], k)
			),
			look: new THREE.Vector3(
				lerp(a.look[0], b.look[0], k),
				lerp(a.look[1], b.look[1], k),
				lerp(a.look[2], b.look[2], k)
			)
		};
	}

	/**
	 * Where the request is at this point of the journey, one curve per leg.
	 *
	 * A curve per leg rather than one long one, because each leg belongs to one beat of
	 * the animation. As a single curve the request was three quarters of the way to the
	 * cable while the caption still said "as far as the router".
	 */
	#packetAt(t: number) {
		const c = this.#curves[this.#state.mode];
		if (t <= LEG.hop) return c.toHop.getPointAt(clamp01((t - LEG.tap) / (LEG.hop - LEG.tap)));
		if (t <= LEG.dive) return c.toTrunk.getPointAt(clamp01((t - LEG.hop) / (LEG.dive - LEG.hop)));
		return c.trunk.getPointAt(clamp01((t - LEG.dive) / (LEG.server - LEG.dive)));
	}

	resize() {
		const w = this.#canvas.clientWidth || 1;
		const h = this.#canvas.clientHeight || 1;
		this.#renderer.setSize(w, h, false);
		this.#camera.aspect = w / h;
		this.#camera.updateProjectionMatrix();
		this.renderOnce();
	}

	/** One frame. Called on every scroll and on every resize, and at no other time. */
	renderOnce() {
		this.#renderer.render(this.#scene, this.#camera);
	}

	dispose() {
		this.#scene.traverse((o) => {
			const mesh = o as THREE.Mesh;
			mesh.geometry?.dispose?.();
			const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
			if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
			else mat?.dispose?.();
		});
		this.#screenTex?.dispose();
		this.#renderer.dispose();
	}
}

/**
 * Draws text wrapped to a width, and returns the baseline it finished on.
 *
 * The page on the phone is written in two languages and the same box has to hold both,
 * so nothing on it is positioned by counting lines in the Indonesian.
 */
function wrap(
	g: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	max: number,
	lh: number
) {
	let line = '';
	let at = y;
	for (const word of text.split(' ')) {
		const next = line ? `${line} ${word}` : word;
		if (line && g.measureText(next).width > max) {
			g.fillText(line, x, at);
			line = word;
			at += lh;
		} else {
			line = next;
		}
	}
	if (line) g.fillText(line, x, at);
	return at;
}

function roundRect(
	g: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
) {
	g.beginPath();
	g.moveTo(x + r, y);
	g.arcTo(x + w, y, x + w, y + h, r);
	g.arcTo(x + w, y + h, x, y + h, r);
	g.arcTo(x, y + h, x, y, r);
	g.arcTo(x, y, x + w, y, r);
	g.closePath();
}
