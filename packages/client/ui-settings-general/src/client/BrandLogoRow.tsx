/** General settings row for uploading, previewing and resetting the custom logo. */
import { useRef, useState, type ChangeEvent } from 'react'
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { BRAND_LOGO_ACCEPT, cropBrandLogo } from './brand-logo-crop.ts'
import css from './BrandLogoRow.module.css'

/** Accepted logo snapshot and persistence callback supplied by the settings owner. */
export interface BrandLogoRowInjected {
  hooks: { brandLogo: ObservableSnapshot<string> }
  setLogo(dataUrl: string | undefined): Promise<boolean>
}

type Face = PropsRuntime<'settings.general.item'> & PropsLocale<'settings'> & InjectFace<BrandLogoRowInjected>

/**
 * Render the logo row: size advice, live preview, upload and restore controls.
 * @param props - injected snapshot hook, writer and localized copy.
 * @returns the General Settings row.
 */
export function BrandLogoRow({ useBrandLogo, setLogo, t }: Face) {
  const src = useBrandLogo(value => value)
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [saved, setSaved] = useState(false)
  const custom = src.startsWith('data:')

  const onPick = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) return
    setBusy(true)
    setError(false)
    setSaved(false)
    void (async () => {
      try {
        const dataUrl = await cropBrandLogo(file)
        if (!await setLogo(dataUrl)) { setError(true); return }
        setSaved(true)
      } catch { setError(true) } finally { setBusy(false) }
    })()
  }

  const onReset = (): void => {
    setBusy(true)
    setError(false)
    setSaved(false)
    void (async () => {
      try {
        if (!await setLogo(undefined)) { setError(true); return }
        setSaved(true)
      } catch { setError(true) } finally { setBusy(false) }
    })()
  }

  return (
    <div className={css.row}>
      <div className={css.info}>
        <div className={css.title}>{t('brandLogo.title')}</div>
        <div className={css.description}>{t('brandLogo.description')}</div>
        <div className={css.recommendation}>{t('brandLogo.recommendation')}</div>
        {error && <div role="alert" className={css.error}>{t('brandLogo.error')}</div>}
        {saved && !error && <div role="status" className={css.saved}>{t('brandLogo.saved')}</div>}
      </div>
      <div className={css.control}>
        <img className={css.preview} src={src} alt="" aria-hidden="true" />
        <div className={css.actions}>
          <input ref={input} type="file" accept={BRAND_LOGO_ACCEPT} hidden onChange={onPick} />
          <button type="button" className={css.button} disabled={busy} onClick={() => { input.current?.click() }}>
            {busy ? t('brandLogo.busy') : t('brandLogo.upload')}
          </button>
          {custom && (
            <button type="button" className={css.button} disabled={busy} onClick={onReset}>
              {t('brandLogo.reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
