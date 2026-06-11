import type { Museum } from "$library/types"

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			/** Active GLAM Oxford museum site for this deployment.
			 *
			 * - `ash` — Ashmolean Museum
			 * - `oum` — Oxford University Museum of Natural History
			 * - `prm` — Pitt Rivers Museum
			 * - `hsm` — History of Science Museum
			 *
			 * @see {@link Museum}
			 * @see {@link museums} */
			MUSEUM: Museum
		}
	}
}

export {}
