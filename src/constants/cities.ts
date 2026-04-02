export const VALID_CITY_SLUGS = ['juazeiro-do-norte', 'petrolina'] as const

export type CitySlug = (typeof VALID_CITY_SLUGS)[number]

export const CITY_DISPLAY = {
  'juazeiro-do-norte': {
    name: 'Juazeiro do Norte',
    state: 'CE',
    description: 'Unidade Juazeiro do Norte - Ceará',
  },
  petrolina: {
    name: 'Petrolina',
    state: 'PE',
    description: 'Unidade Petrolina - Pernambuco',
  },
} as const

export function isCitySlug(slug: string): slug is CitySlug {
  return VALID_CITY_SLUGS.includes(slug as CitySlug)
}
