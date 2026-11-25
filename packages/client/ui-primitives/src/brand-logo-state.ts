/** Logo artwork shipped with the Web frontend, used until a custom logo is set. */
export const BRAND_LOGO_DEFAULT_SRC = './logo.jpg'

/** Shared custom-artwork state; client plugins may live in separate module bundles. */
interface BrandLogoState {
  src: string | null
  listeners: Set<() => void>
}

interface BrandLogoScope {
  __DSH_BRAND_LOGO_STATE__?: BrandLogoState
}

const scope = globalThis as typeof globalThis & BrandLogoScope

function state(): BrandLogoState {
  const existing = scope.__DSH_BRAND_LOGO_STATE__
  if (existing !== undefined) return existing
  const created: BrandLogoState = { src: null, listeners: new Set() }
  scope.__DSH_BRAND_LOGO_STATE__ = created
  return created
}

/** Current logo URL, falling back to the shipped artwork. */
export function getBrandLogoSrc(): string {
  return state().src ?? BRAND_LOGO_DEFAULT_SRC
}

/** The custom logo data URL, or null while the shipped artwork is in use. */
export function getCustomBrandLogo(): string | null {
  return state().src
}

/** Replace the artwork shown by every brand seat on the page. */
export function setCustomBrandLogo(src: string | null): void {
  const current = state()
  if (current.src === src) return
  current.src = src
  for (const listener of [...current.listeners]) listener()
}

/** Subscribe to logo changes (useSyncExternalStore contract). */
export function subscribeBrandLogo(listener: () => void): () => void {
  const current = state()
  current.listeners.add(listener)
  return () => { current.listeners.delete(listener) }
}

/** Observable snapshot view of the current logo URL, for slot injection. */
export const brandLogoSnapshot = {
  getSnapshot: getBrandLogoSrc,
  subscribe: subscribeBrandLogo,
}
