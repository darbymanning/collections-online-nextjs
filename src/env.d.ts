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
			/** Absolute URL(s) of the external sitemap (or sitemap index) advertised in
			 * `robots.txt`. Comma-separate to list several files. Generated and hosted
			 * outside this app — see docs/seo-options.md. */
			SITEMAP_URL?: string
			/** HTTP basic auth password — platform env only, not in varlock schema. */
			BASIC_AUTH_PASS?: string
		}
	}
}

declare module "varlock/env" {
	interface TypedEnvSchema {
		NEXT_PUBLIC_MUSEUM: Museum
		/** Absolute URL(s) of the external sitemap (or sitemap index) advertised in
		 * `robots.txt`. See docs/seo-options.md. */
		SITEMAP_URL?: string
		/** HTTP basic auth username — enables the gate when set with `BASIC_AUTH_PASS`. */
		BASIC_AUTH_USER?: string
	}
}

export {}
