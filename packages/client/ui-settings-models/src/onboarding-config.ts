/** Public page-bootstrap options shared by the Host and Client halves. */

import z from '@deepseek-ai/schemastery'

/** Onboarding options after schema defaults are applied. */
export interface Config {
  /** Offer the browser API-key step when no native shell owns credential onboarding. */
  credentialOnboarding: boolean
  /** Keep the shipped official provider rows off this deployment's Models page. */
  hideDefaultDeepSeek: boolean
}

/** Validate Host configuration and its public page-bootstrap payload. */
export const Config: z<Partial<Config>, Config> = z.object({
  credentialOnboarding: z.boolean().default(false),
  hideDefaultDeepSeek: z.boolean().default(true),
})

/** Built-in official routes hidden while hideDefaultDeepSeek is on. */
export const DEFAULT_DEEPSEEK_PROVIDERS: readonly string[] = ['deepseek-official', 'deepseek-account']

/** Page-global key carrying only the public onboarding options. */
export const ONBOARDING_CONFIG_GLOBAL = '__DSH_MODELS_ONBOARDING__'
