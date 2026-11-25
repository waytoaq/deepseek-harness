import { BrandLogo } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SidebarBrandMarkOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'

/**
 * Render the deployment logo (`apps/web/public/logo.jpg`) at the height the sidebar requests.
 * @param props - Host-supplied mark presentation.
 * @returns the logo image.
 */
export function OfficialBrandMark({ size }: SidebarBrandMarkOwnerProps) {
  return <BrandLogo size={size} />
}

/**
 * Occupy the name slot without drawing a wordmark beside the wide logo.
 * @returns nothing.
 */
export function OfficialBrandName() {
  return null
}
