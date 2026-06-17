/* oxlint-disable tailwindcss/no-unknown-classes -- the marks' hooks (ash-glitch,
   ghost, base, swirl-group, topple, prm-drop, hsm-swirl) are defined in each
   mark's own inline <style> below, not in the Tailwind entry point, so the rule
   can't see them. Scoped to this file, which is all bespoke brand-mark markup. */
import type { CSSProperties } from "react"

/* Animated brand mark for the not-found page. Each deployment is one museum
 * (NEXT_PUBLIC_MUSEUM), so we pick the mark with a build-time `switch` on that env
 * var: Next inlines it as a literal, so the bundler folds the switch and tree-
 * shakes the other museums' marks and keyframes out of the not-found chunk (same
 * idiom as page.tsx) — a `museum.ref ===` runtime check couldn't be folded.
 *
 * Each mark's CSS rides in a plain inline <style> (server-rendered, no styled-jsx
 * client boundary) instead of the global stylesheet, so it loads only on this
 * route and only for the active museum. React renders <style> children as raw
 * text — no escaping — so the CSS is written as-is, including hsm's `>`
 * combinators; the leading css magic-comment just lets editors highlight it. */
export function NotFoundMark() {
	switch (process.env.NEXT_PUBLIC_MUSEUM) {
		case "ash":
			return <AshMark />
		case "oum":
			return <OumMark />
		case "hsm":
			return <HsmMark />
		case "prm":
			return <PrmMark />
	}
}

/* ash's "A", drawn once and stacked three times for the glitch (base + two ghost
 * channels). Filled via currentColor from the .ash-glitch CSS. */
const ashMark = (
	<>
		<path d="M36.967 33.575c-.922-1.942-1.73-3.594-1.73-3.594h7.345l-.687-1.509h-7.36L21.441 0 8.357 28.472h-7.5l-.689 1.509H23.66l-.688-1.509H10.21L17.605 12.4s9.816 21.273 9.866 21.395c1.802 4.37-.799 6.789-1.803 7.835h17.227s-2.556-.949-5.928-8.055" />
		<path d="M7.699 34.267 8.737 31.689H6.849l-.626 1.249C2.738 40.408 0 41.635 0 41.635h9.65c-1-1.041-3.699-3.028-1.951-7.368" />
	</>
)

/* ash's "A" glitches: three stacked copies — a clean base plus a warm and a cool
 * channel ghost — carry a chromatic split that tears into bands and jolts sideways
 * (clip-path + transform, steps() for hard digital cuts; GPU-cheap, no canvas).
 * Hover cranks --g to push it louder. Coloured via the foreground, not the dark-
 * mode-flipping /icons asset. Decorative; motion-safe only (else clean + still). */
function AshMark() {
	return (
		<>
			<style>{/* css */ `
.ash-glitch {
	--g: 0.6;
	color: var(--color-foreground);
	/* keep the ghosts' multiply blend off the rest of the page */
	isolation: isolate;
}

.ash-glitch svg {
	fill: currentColor;
}

.ash-glitch .ghost {
	mix-blend-mode: multiply;
	opacity: 0.85;
	will-change: transform;
}

.ash-glitch .ghost-warm {
	color: #ff1f5a;
}

.ash-glitch .ghost-cool {
	color: #15cfe0;
}

@media (prefers-reduced-motion: no-preference) {
	.ash-glitch .ghost-warm {
		animation: ash-glitch-warm 1.5s steps(1) infinite;
	}

	.ash-glitch .ghost-cool {
		animation: ash-glitch-cool 1.9s steps(1) infinite;
	}

	.ash-glitch:hover {
		--g: 2.8;
	}

	/* the base only joins in (jolts + tears) once provoked */
	.ash-glitch:hover .base {
		animation: ash-glitch-base 0.5s steps(1) infinite;
	}

	.ash-glitch:hover .ghost-warm {
		animation-duration: 0.55s;
	}

	.ash-glitch:hover .ghost-cool {
		animation-duration: 0.62s;
	}
}

/* warm channel: a steady ~1px split (clip-path: inset(0) = whole mark) punctuated
 * by two big band-tears per loop */
@keyframes ash-glitch-warm {
	0% {
		transform: translateX(calc(var(--g) * -1px));
		clip-path: inset(0);
	}
	20% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(0);
	}
	38% {
		transform: translateX(calc(var(--g) * -5px));
		clip-path: inset(14% 0 62% 0);
	}
	46% {
		transform: translateX(calc(var(--g) * -1px));
		clip-path: inset(0);
	}
	64% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(0);
	}
	78% {
		transform: translateX(calc(var(--g) * 6px));
		clip-path: inset(58% 0 18% 0);
	}
	86% {
		transform: translateX(calc(var(--g) * -1px));
		clip-path: inset(0);
	}
	100% {
		transform: translateX(calc(var(--g) * -1px));
		clip-path: inset(0);
	}
}

/* cool channel: split the other way, tears on different rows/beats */
@keyframes ash-glitch-cool {
	0% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(0);
	}
	24% {
		transform: translateX(calc(var(--g) * 7px));
		clip-path: inset(40% 0 36% 0);
	}
	32% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(0);
	}
	54% {
		transform: translateX(calc(var(--g) * -1px));
		clip-path: inset(0);
	}
	70% {
		transform: translateX(calc(var(--g) * -7px));
		clip-path: inset(6% 0 74% 0);
	}
	80% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(0);
	}
	100% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(0);
	}
}

/* base: clean at rest; on hover it shudders and tears too, for full meltdown */
@keyframes ash-glitch-base {
	0%,
	100% {
		transform: translateX(0);
		clip-path: inset(0);
	}
	25% {
		transform: translateX(calc(var(--g) * 1.5px));
		clip-path: inset(38% 0 40% 0);
	}
	50% {
		transform: translateX(calc(var(--g) * -1.5px));
		clip-path: inset(0);
	}
	75% {
		transform: translateX(calc(var(--g) * 1px));
		clip-path: inset(70% 0 8% 0);
	}
}
`}</style>
			<div
				aria-hidden
				className="ash-glitch inline-grid *:col-start-1 *:row-start-1 *:h-24 *:w-auto"
			>
				<svg viewBox="0 0 43 42" className="base">
					{ashMark}
				</svg>
				<svg viewBox="0 0 43 42" className="ghost ghost-warm">
					{ashMark}
				</svg>
				<svg viewBox="0 0 43 42" className="ghost ghost-cool">
					{ashMark}
				</svg>
			</div>
		</>
	)
}

/* hsm's "404" filled with the brand circles: a mask clips them to the glyphs over
 * an amber base. The numbers hold still while the masked circles drift and orbit on
 * desynced loops, so colour flows inside the digits; where one moves off, the amber
 * base shows through, never the page. Glyph paths defined once, reused for fill +
 * mask. Pure CSS transforms (--s scales the travel). Decorative; motion-safe only. */
function HsmMark() {
	return (
		<>
			<style>{/* css */ `
.hsm-swirl {
	--s: 1;
}

.hsm-swirl .swirl-group > * {
	transform-box: fill-box;
	transform-origin: center;
	will-change: transform;
}

@media (prefers-reduced-motion: no-preference) {
	.hsm-swirl .swirl-group > *:nth-child(1) {
		animation: hsm-swirl-1 12s ease-in-out -3s infinite;
	}
	.hsm-swirl .swirl-group > *:nth-child(2) {
		animation: hsm-swirl-2 10s ease-in-out -6s infinite;
	}
	.hsm-swirl .swirl-group > *:nth-child(3) {
		animation: hsm-swirl-3 8s ease-in-out -2s infinite;
	}
	.hsm-swirl .swirl-group > *:nth-child(4) {
		animation: hsm-swirl-4 9s ease-in-out -5s infinite;
	}
	.hsm-swirl .swirl-group > *:nth-child(5) {
		animation: hsm-swirl-5 7s ease-in-out -1s infinite;
	}
}

/* each circle drifts on its own small closed loop (start == end so it's seamless),
 * the two small ellipses also breathe; offsets scale with --s */
@keyframes hsm-swirl-1 {
	0%,
	100% {
		transform: translate(0, 0);
	}
	33% {
		transform: translate(calc(var(--s) * 5px), calc(var(--s) * -3px));
	}
	66% {
		transform: translate(calc(var(--s) * -3px), calc(var(--s) * -6px));
	}
}

@keyframes hsm-swirl-2 {
	0%,
	100% {
		transform: translate(0, 0);
	}
	33% {
		transform: translate(calc(var(--s) * -4px), calc(var(--s) * 4px));
	}
	66% {
		transform: translate(calc(var(--s) * 4px), calc(var(--s) * 2px));
	}
}

@keyframes hsm-swirl-3 {
	0%,
	100% {
		transform: translate(0, 0);
	}
	25% {
		transform: translate(calc(var(--s) * 4px), calc(var(--s) * 3px));
	}
	50% {
		transform: translate(calc(var(--s) * 6px), calc(var(--s) * -3px));
	}
	75% {
		transform: translate(calc(var(--s) * 1px), calc(var(--s) * -4px));
	}
}

@keyframes hsm-swirl-4 {
	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}
	25% {
		transform: translate(calc(var(--s) * -5px), calc(var(--s) * 2px)) scale(1.06);
	}
	50% {
		transform: translate(calc(var(--s) * -2px), calc(var(--s) * 5px)) scale(1);
	}
	75% {
		transform: translate(calc(var(--s) * 3px), calc(var(--s) * 3px)) scale(0.96);
	}
}

@keyframes hsm-swirl-5 {
	0%,
	100% {
		transform: translate(0, 0) scale(1);
	}
	25% {
		transform: translate(calc(var(--s) * 5px), calc(var(--s) * -4px)) scale(1.1);
	}
	50% {
		transform: translate(calc(var(--s) * -4px), calc(var(--s) * -2px)) scale(0.94);
	}
	75% {
		transform: translate(calc(var(--s) * -2px), calc(var(--s) * 4px)) scale(1.05);
	}
}
`}</style>
			<svg viewBox="0 0 112 47" fill="none" aria-hidden className="hsm-swirl h-28 w-auto">
				<defs>
					<g id="hsm-num">
						<path d="M96.846 45.44V36.864H76.75V28.672L94.542 0.768005H106.062V29.44H111.822V36.864H106.062V45.44H96.846ZM84.494 29.44H96.846V10.688H96.27L84.494 29.44Z" />
						<path d="M55.9751 46.208C50.0017 46.208 45.5857 44.1813 42.7271 40.128C39.9111 36.0747 38.5031 30.4 38.5031 23.104C38.5031 15.808 39.9111 10.1333 42.7271 6.08C45.5857 2.02667 50.0017 0 55.9751 0C61.9484 0 66.3431 2.02667 69.1591 6.08C72.0177 10.1333 73.4471 15.808 73.4471 23.104C73.4471 30.4 72.0177 36.0747 69.1591 40.128C66.3431 44.1813 61.9484 46.208 55.9751 46.208ZM55.9751 38.656C58.8337 38.656 60.8177 37.6533 61.9271 35.648C63.0791 33.6427 63.6551 30.848 63.6551 27.264V18.944C63.6551 15.36 63.0791 12.5653 61.9271 10.56C60.8177 8.55467 58.8337 7.552 55.9751 7.552C53.1164 7.552 51.1111 8.55467 49.9591 10.56C48.8497 12.5653 48.2951 15.36 48.2951 18.944V27.264C48.2951 30.848 48.8497 33.6427 49.9591 35.648C51.1111 37.6533 53.1164 38.656 55.9751 38.656ZM55.9751 26.88C54.4817 26.88 53.4364 26.5813 52.8391 25.984C52.2844 25.3867 52.0071 24.6613 52.0071 23.808V22.4C52.0071 21.5467 52.2844 20.8213 52.8391 20.224C53.4364 19.6267 54.4817 19.328 55.9751 19.328C57.4684 19.328 58.4924 19.6267 59.0471 20.224C59.6444 20.8213 59.9431 21.5467 59.9431 22.4V23.808C59.9431 24.6613 59.6444 25.3867 59.0471 25.984C58.4924 26.5813 57.4684 26.88 55.9751 26.88Z" />
						<path d="M20.096 45.44V36.864H0V28.672L17.792 0.768005H29.312V29.44H35.072V36.864H29.312V45.44H20.096ZM7.744 29.44H20.096V10.688H19.52L7.744 29.44Z" />
					</g>
					<mask id="hsm-num-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse">
						<use href="#hsm-num" fill="#fff" />
					</mask>
				</defs>
				{/* amber base: the 404 reads as solid amber wherever no circle sits over it */}
				<use href="#hsm-num" fill="#F5A81C" />
				<g mask="url(#hsm-num-mask)" className="swirl-group">
					<circle cx="39.4" cy="31.44" r="45" fill="#B01F8C" />
					<circle cx="54.4" cy="21.44" r="41" fill="#EE7624" />
					<circle cx="71.4" cy="21.44" r="21" fill="#0471B9" />
					<ellipse cx="72.9" cy="20.44" rx="12.5" ry="12" fill="#F05022" />
					<ellipse cx="70.4" cy="18.94" rx="8" ry="8.5" fill="#70C497" />
				</g>
			</svg>
		</>
	)
}

/* oum's swift keels over on load — a wink that the bird fell off its perch. It
 * tips with gathering speed, overshoots past 90° and jiggles to a stop on its
 * side. Coloured via the brand navy, not the dark-mode-flipping /icons asset.
 * Decorative; motion-safe only (else it sits level). */
function OumMark() {
	return (
		<>
			<style>{/* css */ `
.topple {
	transform-origin: center;
}

@media (prefers-reduced-motion: no-preference) {
	.topple {
		animation: topple 1.2s linear 0.4s both;
	}
}

@keyframes topple {
	0% {
		transform: rotate(0deg);
		animation-timing-function: cubic-bezier(0.6, 0, 0.9, 0.2);
	}
	55% {
		transform: rotate(96deg);
		animation-timing-function: ease-out;
	}
	70% {
		transform: rotate(84deg);
		animation-timing-function: ease-in;
	}
	83% {
		transform: rotate(92deg);
		animation-timing-function: ease-out;
	}
	93% {
		transform: rotate(88deg);
		animation-timing-function: ease-in;
	}
	100% {
		transform: rotate(90deg);
	}
}
`}</style>
			<svg viewBox="-1 2 74 52" aria-hidden className="h-24 w-auto text-secondary topple">
				<path
					fill="currentColor"
					d="M64.779 17.616a2.4 2.4 0 0 0-.548-.377 2.875 2.875 0 0 0-1.891-2.643 2.6 2.6 0 0 0-.446-.12 3 3 0 0 0-1.006-1.255 2.96 2.96 0 0 0-2.053-.538c-.357.043-.7.15-1.012.316a3 3 0 0 0-.404.263 3.04 3.04 0 0 0-1.754-.04 3 3 0 0 0-1.588 1.077 2.9 2.9 0 0 0-.443.845c-.021.071-.042.137-.055.207q-.077.006-.15.021c-1.233.154-2.27 1.103-2.555 2.242a2 2 0 0 0-.06.283c-.093-.048-2.605-1.442-6.46-2.067-1.368-.22-7.518-1.3-13.151 1.277-2.797 1.28-2.71 5.164-5.615 5.094-1.913-.05-.791-1.885-.791-1.885s-.681.27-.69 1.254c-.014 1.816 1.453 2.072 2.648 1.991 2.057-.143 2.503-3.08 5.626-4.452 2.83-1.245 5.589-1.782 9.584-1.782 3.996 0 5.426.941 6.678 1.577 1.906.963 3.243 4.511 3.243 4.511q-.22-.694-.367-1.415c-.466-2.418.006-4.296 1.237-5a2.64 2.64 0 0 1 2.337-.144 2.379 2.379 0 0 1 3.799-.37 2.106 2.106 0 0 1 2.64.9c.266.466.333.99.23 1.476a1.81 1.81 0 0 1 1.164 1.26 2.735 2.735 0 0 0-.552-.098 3.06 3.06 0 0 0-1.291-1.193 3 3 0 0 0-1.901-.247 2.9 2.9 0 0 0-1.071.456c-.038-.03-.082-.059-.12-.088-1.028-.698-2.433-.675-3.402-.01a2.94 2.94 0 0 0-1.294 2.731 2.646 2.646 0 0 1 3.11-1.942c.838.175 1.5.726 1.844 1.442a2.382 2.382 0 0 1 3.092 2.245 2.11 2.11 0 0 1 1.383 2.425 2.1 2.1 0 0 1-.804 1.258 1.83 1.83 0 0 1-1.396 2.716c-2.345.33-1.725 3.55.777 3.037a2.65 2.65 0 0 0 1.906-1.754c.293-.108.57-.265.809-.465.725-.592 1.11-1.557.986-2.464a2.6 2.6 0 0 0-.157-.646 2.9 2.9 0 0 0 .674-2.09 2.9 2.9 0 0 0-.343-1.145 3 3 0 0 0-.256-.383l.043-.15a3 3 0 0 0 .142-.178c.543-.75.624-1.76.267-2.576.148-.28.252-.58.298-.885.15-.925-.2-1.905-.891-2.502m-32.823 9.735s-.586 1.477.774 3.453c4.049 5.88 11.39 8.35 12.12 7.368.162-.215.304-.618-1.637-1.853 1.706.837 3.054 1.11 3.319.673.204-.332.216-.687-1.305-1.616 1.593.582 2.778.61 3.069.27.38-.446-.213-1.346-1.798-1.968 1.669.484 2.248.334 2.479-.123.367-.738-1.502-1.572-1.502-1.572s1.247.51 1.523-.02c.288-.554-1.147-1.603-1.626-1.947-1.321-.95-2.212-1.127-2.546-1.24a.8.8 0 0 1 .033.567c-.133.384-.596.602-1.182.614h.002c2.866 2.078-.481 5.98-3.78 4.58-8.35-3.54-7.755-7.665-7.755-7.665zM8.48 13.57c2.14-1.178 1.259-3.879 1.247-3.923-1.573.621-3.175 1.28-3.935 2.917-.742 1.59-.437 3.534.517 4.962 1.39 2.087 2.59 1.771 2.62 1.69-1.288-.5-3.6-3.914-.45-5.646m3.644-2.236c1.548-1.367 2.312-1.54 3.343-2.286.93-.678 1.138-1.2 1.402-1.785.566-1.25 1.787-1.174 1.787-1.174a1.214 1.214 0 1 0 1.459 1.19q0-.157-.04-.3c.55.205 1.112.316 2.165.96 1.788 1.088 1.082 4.116 1.082 4.116s.93-2.125-.152-4.293c-.667-1.333-1.551-1.677-3.493-2.455-1.466-.587-1.85-2.372-2.153-3.626l-.071.957c-.048.503-.448 1.236-.713 1.83-.38.766-2.16 3.16-5.873 4.994.088.265.166.657.149.967-.036.637-.342.837-.498 1.822-.206 1.304-.111 3.187-.105 3.247.033-.016.163-2.795 1.71-4.164m5.559 1.406c1.042-1.626 3.9-1.632 3.9-1.632s-2.795-.9-4.768.451c-2.068 1.416-2.273 2.77-3.883 3.863-1.152.784-3.595 1.173-3.595 1.173s3.742 1.493 5.618-.024c1.194-.967 1.259-1.534 2.728-3.83m7.569 23.745c.93-.578.028-1.534.028-1.534s1.572.618 2.359.171c.577-.332.534-1.31.534-1.31s.003.703-1.498.857c-1.5.16-2.365-.704-2.365-.704s.657 1.354.437 1.604c-.233.266-.583.551-2.398.068-2.588-.693-6.822-4.04-6.82-8.492.004-3.179 2.885-5.696 4.903-6.808 2.477-1.367 5.532-2.4 7.113-4.918 1.026-1.633 1.686-3.178 1.932-4.982q.079-.596.1-1.234c.027-.934-.058-1.839-.363-2.726-.474-1.37-1.077-2.715-2.05-3.807C26.036 1.4 24.61.387 23.038.136c-3.245-.518-4.205.61-4.72.584 2.869-.133 4.775.26 6.362 2.573 1.48 2.16 2.39 7.262.739 9.366-1.645 2.103-4.448 3.796-6.55 5.283-1.606 1.136-2.841 2.11-3.79 3.876-3.015 5.63-.46 10.361 3.91 13.583 0 0 1.099.661 2.198 1.108 1.096.452 3.037.613 4.067-.025m16.459 9.755c-.054.404.19 4.125-2.844 4.601-.573.066-2.37-.094-3.204.606-1.085-.203-1.99-.265-2.22-1-.33-1.056 1.567-4.773 3.013-5.563l-.04-.014c.684-.476 1.623-1.005 2.476-1.453q.527.137 1.028.281c.3.232.945.873 1.79 2.516.003.007.003.02.009.026zm4.22-2.742c-2.775 0-8.877-3.602-11.393-3.682-2.512-.083-4.638 1.392-7.441 1.315-2.315-.06-3.525-1.12-4.078-1.676.414.624 1.947 1.921 3.605 2.334 1.73.43 3.732.667 5.519.66.719 0 1.416.038 2.095.103.149.454.219 1.002.14 1.638-.094.295-.305.726-.58 1.233a34 34 0 0 1-.984 1.674c-.947 1.528-1.982 3.022-2.11 3.056-2.38.713-4.14.61-4.14.61-2.08.103-1.86.59-2.263.684-1.343-.42-2.413.152-2.397.994l27.595-.018c-.623-1.582-2.255-1.187-2.571-1.134-1.025-.87-3.21-.29-4.105-.476-.174-.685 1.233-2.892 2.06-4.093.062-.092.863-1.3 1.093-1.666.048-.006.093-.007.139-.014 7.523-1.04 9.032-5.924 9.195-6.985-.551.556-2.66 5.443-9.38 5.443"
				/>
			</svg>
		</>
	)
}

/* prm's four frames, each with its own fall set in the markup: start height/drift
 * (--dx/--dy), spin, resting lean (--tilt), impact overshoot (--kick) and landing
 * stagger (--delay). x/y/width/height are the settled positions (rects inset by
 * half the 3px stroke to sit flush); the animation only adds the drop on top. */
const prmPieces = [
	{
		x: 7.5,
		y: 56.41,
		w: 52.43,
		h: 22.09,
		fill: "#64889d",
		vars: "--dx:-28px;--dy:-300px;--spin:-250deg;--tilt:-2deg;--kick:5deg;--delay:0s",
	},
	{
		x: 67.93,
		y: 56.41,
		w: 22.09,
		h: 22.09,
		fill: "#95754a",
		vars: "--dx:22px;--dy:-340px;--spin:200deg;--tilt:3deg;--kick:6deg;--delay:0.16s",
	},
	{
		x: 98.02,
		y: 56.41,
		w: 22.09,
		h: 22.09,
		fill: "#c67c3d",
		vars: "--dx:-20px;--dy:-320px;--spin:-290deg;--tilt:-3deg;--kick:6deg;--delay:0.32s",
	},
	{
		x: 128.11,
		y: 26.07,
		w: 22.09,
		h: 52.43,
		fill: "#718155",
		vars: "--dx:24px;--dy:-380px;--spin:170deg;--tilt:1.5deg;--kick:3deg;--delay:0.48s",
	},
] as const

/* custom properties aren't in React's CSSProperties type, so parse the inline var
 * string into a style object the type accepts */
function pieceStyle(vars: string): CSSProperties {
	return Object.fromEntries(vars.split(";").map((rule) => rule.split(":"))) as CSSProperties
}

/* prm's mark topples out of the sky: each frame drops from far above the viewBox,
 * tumbles under gravity, slams down with a squash, bounces twice and settles into a
 * row — a heap of fallen blocks, not the tidy logo. Staggered delays land them
 * left-to-right, as if knocking into one another. Pivots about each centre (fill-
 * box); overflow stays visible so they fall in from above. Decorative; motion-safe
 * only (else the settled row). */
function PrmMark() {
	return (
		<>
			<style>{/* css */ `
.prm-drop {
	transform-box: fill-box;
	transform-origin: center;
}

@media (prefers-reduced-motion: no-preference) {
	.prm-drop {
		animation: prm-drop 1.5s both;
		animation-delay: var(--delay, 0s);
	}
}

@keyframes prm-drop {
	0% {
		transform: translate(var(--dx, 0), var(--dy, -320px)) rotate(var(--spin, 0deg)) scale(1);
		animation-timing-function: cubic-bezier(0.45, 0, 0.9, 0.35);
	}
	/* first hard impact — squash flat against the floor, overshoot past the lean */
	50% {
		transform: translate(0, 0) rotate(calc(var(--tilt, 0deg) - var(--kick, 5deg)))
			scale(1.08, 0.9);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.3, 1);
	}
	/* bounce up, stretch tall, swing the lean back the other way */
	64% {
		transform: translate(0, -16px) rotate(calc(var(--tilt, 0deg) + var(--kick, 5deg)))
			scale(0.97, 1.03);
		animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.4);
	}
	/* second, smaller impact */
	78% {
		transform: translate(0, 0) rotate(calc(var(--tilt, 0deg) - 2deg)) scale(1.04, 0.96);
		animation-timing-function: cubic-bezier(0.16, 0.84, 0.3, 1);
	}
	88% {
		transform: translate(0, -5px) rotate(calc(var(--tilt, 0deg) + 1deg)) scale(1);
		animation-timing-function: ease-in;
	}
	100% {
		transform: translate(0, 0) rotate(var(--tilt, 0deg)) scale(1);
	}
}
`}</style>
			<svg viewBox="0 0 158 84" aria-hidden className="h-28 w-auto overflow-visible">
				{prmPieces.map((piece) => (
					<g key={piece.fill} className="prm-drop" style={pieceStyle(piece.vars)}>
						<rect
							x={piece.x}
							y={piece.y}
							width={piece.w}
							height={piece.h}
							fill="none"
							stroke={piece.fill}
							strokeWidth={3}
						/>
					</g>
				))}
			</svg>
		</>
	)
}
