/** Welcome acknowledgement stored in the plugin configuration. */
import type {} from '@deepseek-ai/dsh-settings'

import type { Volatile, Context } from '@deepseek-ai/cordis'

import z from '@deepseek-ai/schemastery'

/** Runtime preferences projected to the browser. */
export interface Config {
  /** Last acknowledged welcome notice version. */
  welcomeNoticeVersion: Volatile<string | undefined>
  /** Cropped custom logo as a data URL; unset restores the shipped artwork. */
  brandLogo: Volatile<string | undefined>
}

/** Live welcome and brand preferences. */
export const Config = z.object({
  welcomeNoticeVersion: z.string().volatile(),
  brandLogo: z.string().volatile(),
})

/** The browser consumes the configuration form projection.
 * @param ctx Plugin context used for optional settings presentation.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (child) => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)) })
}
