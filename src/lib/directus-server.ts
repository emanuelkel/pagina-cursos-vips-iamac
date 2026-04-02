import { createDirectus, rest, staticToken } from '@directus/sdk'
import type { Schema } from '@/types/directus'

const directusUrl = process.env.DIRECTUS_URL!
const adminToken = process.env.DIRECTUS_ADMIN_TOKEN!

export const directusServer = createDirectus<Schema>(directusUrl)
  .with(staticToken(adminToken))
  .with(rest())

export function getServerAssetUrl(fileId: string, params?: Record<string, string | number>): string {
  const url = new URL(`${directusUrl}/assets/${fileId}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }
  return url.toString()
}
