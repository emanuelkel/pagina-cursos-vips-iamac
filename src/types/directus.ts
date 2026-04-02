export interface Cidade {
  id: number
  nome: string
  slug: string
  whatsapp: string
  status: string
}

export interface Categoria {
  id: number
  nome: string
  slug?: string
  icone?: string
  descricao?: string
  ordem?: number
  status: string
}

export interface Professor {
  id: number
  nome: string
  foto?: string
  whatsapp?: string
  especialidade?: string
  bio?: string
  status: string
}

export interface Curso {
  id: number
  titulo: string
  descricao?: string
  banner_image?: string
  professor: Professor | number
  categoria: Categoria | number
  cidade: Cidade | number
  mensagem_whatsapp?: string
  status: string
  ordem?: number
  data_curso?: string
  duracao?: string
  nivel?: string
  vagas?: string
}

export interface Interesse {
  id: number
  curso: number
  professor?: number
  cidade?: number
  categoria?: number
  data_interesse: string
  mes_ano?: string
  user_agent?: string
}

export interface Schema {
  iamac_cidades: Cidade[]
  iamac_categorias: Categoria[]
  iamac_professores: Professor[]
  iamac_cursos: Curso[]
  iamac_interesses: Interesse[]
}
