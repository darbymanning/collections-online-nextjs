import type { Museum } from "$library/types"
import type { museumDirectory } from "$library/config"

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
			 * @see {@link museumDirectory} */
			NEXT_PUBLIC_MUSEUM: Museum
			/** HTTP basic auth username — platform env only, not in varlock schema. */
			BASIC_AUTH_USER?: string
			/** HTTP basic auth password — platform env only, not in varlock schema. */
			BASIC_AUTH_PASS?: string
		}
	}
}

declare module "varlock/env" {
	interface TypedEnvSchema {
		NEXT_PUBLIC_MUSEUM: Museum
	}
}

export {}
