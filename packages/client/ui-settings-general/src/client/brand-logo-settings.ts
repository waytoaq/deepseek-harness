/** Wiring between the persisted logo preference and the shared brand state. */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the ctx.configForms Context merge (client bundle purity).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { brandLogoSnapshot, setCustomBrandLogo } from '@deepseek-ai/dsh-client-ui-primitives'
import { BrandLogoRow, type BrandLogoRowInjected } from './BrandLogoRow.tsx'

/** Profile entry owning the volatile custom-logo field. */
const BRAND_LOGO_NAMESPACE = 'ui-settings-general'

/**
 * Mirror the persisted logo into the shared client state and register its row.
 * @param ctx - client plugin context.
 * @param locale - namespace of the General section dictionaries.
 */
export function registerBrandLogoRow(ctx: ClientContext, locale: 'settings'): void {
  const form = ctx.configForms.get<{ brandLogo?: string }>(BRAND_LOGO_NAMESPACE)
  const sync = (): void => {
    const value = form.getSnapshot().value?.brandLogo
    setCustomBrandLogo(typeof value === 'string' && value !== '' ? value : null)
  }
  ctx.effect(() => {
    const off = form.subscribe(sync)
    sync()
    return off
  }, 'ui-settings-general: brand logo mirror')
  const injected = (): BrandLogoRowInjected => ({
    hooks: { brandLogo: brandLogoSnapshot },
    setLogo: async (dataUrl) => {
      try {
        const accepted = dataUrl === undefined
          ? await form.unset('brandLogo')
          : await form.set('brandLogo', dataUrl)
        if (accepted) setCustomBrandLogo(dataUrl ?? null)
        return accepted
      } catch {
        return false
      }
    },
  })
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item', id: 'brand-logo', order: 20, locale, inject: injected,
  }, BrandLogoRow))
}
