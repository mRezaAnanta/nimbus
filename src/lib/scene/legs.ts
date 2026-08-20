/**
 * Where each leg of the journey ends, how long it takes, and where it stops to be
 * explained.
 *
 * It lives apart from `journey.ts` on purpose. The stage needs these numbers to run the
 * animation, and importing them from the scene would drag three.js into the page's first
 * load for the sake of a table. The scene is loaded on demand, this is not.
 */

export type Mode = 'wifi' | 'cell';

/** What the phone screen shows. It arrives already in the reader's language. */
export interface JourneyScreen {
	site: string;
	button: string;
	sending: string;
	/** The page that loads at the end, drawn as a page rather than announced as one. */
	page: { title: string; body: string; cta: string; cardA: string; cardB: string };
}

/**
 * Where each leg ends, as a position in the whole journey.
 *
 * Arriving at the machine is the HALF WAY point, and the numbers say so: the way there
 * takes as long as the way back, beat for beat, because the way back IS the way there
 * read in reverse.
 */
export const LEG = {
	/** The finger comes down on the button. */
	tap: 0.04,
	/** It has reached the router or the tower. */
	hop: 0.12,
	/** Below the pavement, in the cable. */
	dive: 0.17,
	/** Along the cable under the street. */
	cable: 0.26,
	/** Out under the sea, on the seabed. */
	sea: 0.36,
	/** At the machine, and half way. */
	server: 0.44,
	/** The machine has answered and the way home starts here. */
	answer: 0.52,
	/** Back in the hand. */
	home: 0.92
} as const;

/**
 * The animation as a script: fly this far, then hold here while Nim says her piece.
 *
 * The holds are the point. Without them the request crossed the city while a caption
 * inside the picture tried to keep up, and the reader had two voices explaining the same
 * thing at once, Nim's and the picture's. Now the picture stops, Nim talks, and the
 * picture goes on, so there is only ever one thing to read.
 *
 * `token` names the line Nim says at that stop, and `hold` is how long she gets. A step
 * with no hold flies straight into the next one.
 */
export type Step = {
	/** Where this leg ends, as a journey position. */
	to: number;
	/** How long the flight takes, in seconds. */
	seconds: number;
	/** Which of Nim's lines belongs to this stop. */
	token?: string;
	/** How long the picture waits there, in seconds. */
	hold?: number;
};

export const STEPS: Step[] = [
	// The flights are brisk and the stops are not. Slower flights read as a slow lesson,
	// and the reader is not learning anything in the seconds between two stops.
	{ to: LEG.tap, seconds: 1.8, token: 'atPhone', hold: 2.8 },
	{ to: LEG.hop, seconds: 2, token: 'atHop', hold: 3 },
	{ to: LEG.dive, seconds: 1.2 },
	{ to: LEG.cable, seconds: 2.2, token: 'inCable', hold: 2.8 },
	{ to: LEG.sea, seconds: 3, token: 'underSea', hold: 3.2 },
	{ to: LEG.server, seconds: 2, token: 'atServer', hold: 3 },
	// the machine works while the camera stands in front of it
	{ to: LEG.answer, seconds: 1.8 },
	// the way home, leg for leg and second for second the way out in reverse
	{ to: 0.6, seconds: 2 },
	{ to: 0.7, seconds: 3 },
	{ to: 0.79, seconds: 2.2 },
	{ to: 0.84, seconds: 1.2 },
	{ to: LEG.home, seconds: 2 },
	{ to: 1, seconds: 1.2, token: 'back', hold: 3.2 }
];

/** The whole thing, flights and holds together. */
export const JOURNEY_SECONDS = STEPS.reduce((a, s) => a + s.seconds + (s.hold ?? 0), 0);

const ease = (k: number) => {
	const c = Math.max(0, Math.min(1, k));
	return c * c * (3 - 2 * c);
};

/**
 * Where the journey is after this many seconds, and which line Nim is saying if it has
 * stopped to be explained.
 */
export function frameAt(seconds: number): { t: number; token: string | null } {
	let spent = 0;
	let from = 0;
	for (const step of STEPS) {
		if (seconds <= spent + step.seconds) {
			const k = step.seconds <= 0 ? 1 : (seconds - spent) / step.seconds;
			return { t: from + (step.to - from) * ease(k), token: null };
		}
		spent += step.seconds;
		const hold = step.hold ?? 0;
		if (hold > 0 && seconds <= spent + hold) return { t: step.to, token: step.token ?? null };
		spent += hold;
		from = step.to;
	}
	return { t: 1, token: null };
}

/**
 * Where the request is on its road, given where the animation is.
 *
 * The way home is the way out read backwards, so past the machine this counts down again.
 * Exported because the scene places the request with it and the board beside the picture
 * lights its stations with it, and two copies of this arithmetic would drift.
 */
export function roadPosition(t: number): number {
	return t > LEG.answer
		? LEG.server - ((t - LEG.answer) / (LEG.home - LEG.answer)) * (LEG.server - LEG.tap)
		: t;
}
