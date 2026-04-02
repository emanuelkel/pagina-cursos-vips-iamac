import type { Categoria, Cidade, Curso } from '@/types/directus'

const BASE_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!.replace(/\/$/, '')

export async function getCidades(): Promise<Cidade[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/items/iamac_cidades?filter[status][_eq]=published&sort=nome`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const { data } = await res.json()
    return data ?? []
  } catch {
    return []
  }
}

export async function getCategorias(): Promise<Categoria[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/items/iamac_categorias?filter[status][_eq]=published&sort=ordem,nome`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const { data } = await res.json()
    return data ?? []
  } catch {
    return []
  }
}

export async function getCursosByCidade(cidadeSlug: string): Promise<Curso[]> {
  try {
    const fields = [
      'id', 'titulo', 'descricao', 'banner_image',
      'mensagem_whatsapp', 'ordem', 'data_curso', 'duracao', 'nivel', 'vagas',
      'categoria.id', 'categoria.nome', 'categoria.slug', 'categoria.icone',
      'professor.id', 'professor.nome', 'professor.foto', 'professor.whatsapp',
      'cidade.id', 'cidade.nome', 'cidade.slug', 'cidade.whatsapp',
    ].join(',')

    const url = `${BASE_URL}/items/iamac_cursos`
      + `?fields=${fields}`
      + `&filter[cidade][slug][_eq]=${cidadeSlug}`
      + `&filter[status][_eq]=published`
      + `&sort=ordem,titulo`

    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const { data } = await res.json()
    return data ?? []
  } catch {
    return []
  }
}
