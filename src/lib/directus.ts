import { createDirectus, rest } from '@directus/sdk'
import type { Schema } from '@/types/directus'

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL!.replace(/\/$/, '')

export const directus = createDirectus<Schema>(directusUrl).with(rest())

export function getAssetUrl(fileId: string, params?: Record<string, string | number>): string {
  const url = new URL(`${directusUrl}/assets/${fileId}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }
  return url.toString()
}
