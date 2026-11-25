/** Output size of a cropped custom logo (2x the shipped 175x56 artwork). */
export const BRAND_LOGO_TARGET = { width: 350, height: 112 } as const

/** Largest accepted source file, in bytes. */
export const BRAND_LOGO_MAX_BYTES = 5 * 1024 * 1024

/** Formats offered by the hidden file input. */
export const BRAND_LOGO_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/bmp,image/avif'

/** Why an uploaded file could not be turned into a logo. */
export type BrandLogoCropError = 'format' | 'size' | 'decode'

/** Rejection carrying the reason so the row can show a localized message. */
export class BrandLogoError extends Error {
  constructor(readonly reason: BrandLogoCropError) {
    super(reason)
    this.name = 'BrandLogoError'
  }
}

/**
 * Centered cover-crop rectangle: fill the target without stretching, trimming
 * the overflow from both axes equally.
 * @param sourceWidth - intrinsic width of the source image.
 * @param sourceHeight - intrinsic height of the source image.
 * @param targetWidth - output width in px.
 * @param targetHeight - output height in px.
 * @returns the source rectangle to draw into the full target.
 */
export function coverCropRect(
  sourceWidth: number, sourceHeight: number,
  targetWidth = BRAND_LOGO_TARGET.width, targetHeight = BRAND_LOGO_TARGET.height,
): { x: number; y: number; width: number; height: number } {
  if (!Number.isFinite(sourceWidth) || !Number.isFinite(sourceHeight) || sourceWidth <= 0 || sourceHeight <= 0) {
    throw new BrandLogoError('decode')
  }
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight)
  const width = targetWidth / scale
  const height = targetHeight / scale
  return { x: (sourceWidth - width) / 2, y: (sourceHeight - height) / 2, width, height }
}

/**
 * Decode, center-crop and compress an uploaded image into a data URL.
 * WebP keeps transparency at a small size; browsers without WebP encoding
 * fall back to PNG. The URL is revocable-free after the bitmap is decoded.
 * @param file - selected image file.
 * @returns the cropped data URL suitable for an img src.
 */
export async function cropBrandLogo(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new BrandLogoError('format')
  if (file.size > BRAND_LOGO_MAX_BYTES) throw new BrandLogoError('size')
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = BRAND_LOGO_TARGET.width
    canvas.height = BRAND_LOGO_TARGET.height
    const context = canvas.getContext('2d')
    if (context === null) throw new BrandLogoError('decode')
    const rect = coverCropRect(image.naturalWidth, image.naturalHeight)
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height)
    const webp = canvas.toDataURL('image/webp', 0.9)
    return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/png')
  } catch (error) {
    if (error instanceof BrandLogoError) throw error
    throw new BrandLogoError('decode')
  } finally {
    URL.revokeObjectURL(url)
  }
}
