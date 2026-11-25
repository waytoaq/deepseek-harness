import { useSyncExternalStore } from 'react'
import type { IconProps } from './icons/props.ts'
import { BRAND_LOGO_DEFAULT_SRC, getBrandLogoSrc, subscribeBrandLogo } from './brand-logo-state.ts'

/** Native pixel size of the shipped artwork, used to preserve its aspect ratio. */
export const BRAND_LOGO_SIZE = { width: 175, height: 56 } as const

/** Default artwork path, exported for consumers that only need the fallback URL. */
export { BRAND_LOGO_DEFAULT_SRC as BRAND_LOGO_SRC }

/**
 * Render the deployment logo in place of the built-in fish mark.
 * @param props.size - height in px (default 24; width follows the artwork ratio).
 * @param props.className - extra class for layout placement.
 * @returns the decorative logo image.
 */
export function BrandLogo({ size = 24, className }: IconProps) {
  const src = useSyncExternalStore(subscribeBrandLogo, getBrandLogoSrc, getBrandLogoSrc)
  return (
    <img
      src={src}
      width={(size * BRAND_LOGO_SIZE.width) / BRAND_LOGO_SIZE.height}
      height={size}
      className={className}
      alt=""
      aria-hidden="true"
    />
  )
}
