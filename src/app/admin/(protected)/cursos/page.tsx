'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/admin/Modal'

interface Option { id: number; nome: string }

interface Curso {
  id: number
  titulo: string
  status: string
  data_curso?: string
  professor: Option | number
  categoria: Option | number
  cidade: Option | number
}

interface CursoForm {
  titulo: string
  descricao: string
  professor: string
  categoria: string
  cidade: string
  data_curso: string
  duracao: string
  nivel: string
  vagas: string
  mensagem_whatsapp: string
  banner_image: string
  status: string
  ordem: number
}

const emptyForm = (): CursoForm => ({
  titulo: '', descricao: '', professor: '', categoria: '', cidade: '',
  data_curso: '', duracao: '', nivel: '', vagas: '', mensagem_whatsapp: '',
  banner_image: '', status: 'published', ordem: 0,
})

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [professores, setProfessores] = useState<Option[]>([])
  const [categorias, setCategorias] = useState<Option[]>([])
  const [cidades, setCidades] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Curso | null>(null)
  const [form, setForm] = useState<CursoForm>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [cursosRes, profRes, catRes, cidRes] = await Promise.all([
      fetch('/api/admin/cursos'),
      fetch('/api/admin/professores'),
      fetch('/api/admin/categorias'),
      fetch('/api/dashboard/cidades'),
    ])
    const [c, p, cat, cid] = await Promise.all([cursosRes.json(), profRes.json(), catRes.json(), cidRes.json()])
    setCursos(Array.isArray(c) ? c : [])
    setProfessores(Array.isArray(p) ? p : [])
    setCategorias(Array.isArray(cat) ? cat : [])
    setCidades(Array.isArray(cid) ? cid : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm(emptyForm())
    setEditing(null)
    setModal('add')
  }

  async function openEdit(curso: Curso) {
    const res = await fetch(`/api/admin/cursos/${curso.id}`)
    const data = await res.json()
    setForm({
      titulo: data.titulo ?? '',
      descricao: data.descricao ?? '',
      professor: data.professor ? String(typeof data.professor === 'object' ? data.professor.id : data.professor) : '',
      categoria: data.categoria ? String(typeof data.categoria === 'object' ? data.categoria.id : data.categoria) : '',
      cidade: data.cidade ? String(typeof data.cidade === 'object' ? data.cidade.id : data.cidade) : '',
      data_curso: data.data_curso ?? '',
      duracao: data.duracao ?? '',
      nivel: data.nivel ?? '',
      vagas: data.vagas ?? '',
      mensagem_whatsapp: data.mensagem_whatsapp ?? '',
      banner_image: data.banner_image ?? '',
      status: data.status ?? 'published',
      ordem: data.ordem ?? 0,
    })
    setEditing(curso)
    setModal('edit')
  }

  async function uploadBanner(file: File) {
    setUploadingBanner(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const { id } = await res.json()
    setUploadingBanner(false)
    return id as string
  }

  async function save() {
    setSaving(true)
    const payload: Record<string, unknown> = {
      titulo: form.titulo,
      descricao: form.descricao || undefined,
      professor: form.professor ? Number(form.professor) : undefined,
      categoria: form.categoria ? Number(form.categoria) : undefined,
      cidade: form.cidade ? Number(form.cidade) : undefined,
      data_curso: form.data_curso || undefined,
      duracao: form.duracao || undefined,
      nivel: form.nivel || undefined,
      vagas: form.vagas || undefined,
      mensagem_whatsapp: form.mensagem_whatsapp || undefined,
      banner_image: form.banner_image || undefined,
      status: form.status,
      ordem: form.ordem,
    }
    if (modal === 'add') {
      await fetch('/api/admin/cursos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } else if (editing) {
      await fetch(`/api/admin/cursos/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setSaving(false)
    setModal(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('Remover curso?')) return
    await fetch(`/api/admin/cursos/${id}`, { method: 'DELETE' })
    load()
  }

  function getLabel(field: Option | number | undefined, list: Option[]) {
    if (!field) return '—'
    const id = typeof field === 'object' ? field.id : field
    return list.find(x => x.id === id)?.nome ?? '—'
  }

  const set = (key: keyof CursoForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cursos</h2>
          <p className="text-sm text-gray-500">{cursos.length} cadastrado(s)</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
          ) : cursos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhum curso cadastrado</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Título</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Professor</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Categoria</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Cidade</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Data</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {cursos.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900 max-w-[200px] truncate">{c.titulo}</td>
                      <td className="py-3 px-4 text-gray-500">{getLabel(c.professor, professores)}</td>
                      <td className="py-3 px-4 text-gray-500">{getLabel(c.categoria, categorias)}</td>
                      <td className="py-3 px-4 text-gray-500">{getLabel(c.cidade, cidades)}</td>
                      <td className="py-3 px-4 text-gray-500">{c.data_curso || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => remove(c.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {modal && (
        <Modal title={modal === 'add' ? 'Novo Curso' : 'Editar Curso'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
              <input type="text" value={form.titulo} onChange={set('titulo')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400" placeholder="Título do curso" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Professor</label>
                <select value={form.professor} onChange={set('professor')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400">
                  <option value="">Selecionar...</option>
                  {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                <select value={form.categoria} onChange={set('categoria')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400">
                  <option value="">Selecionar...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
              <select value={form.cidade} onChange={set('cidade')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400">
                <option value="">Selecionar...</option>
                {cidades.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
              <textarea value={form.descricao} onChange={set('descricao')} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none" placeholder="Descrição do curso" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                <input type="text" value={form.data_curso} onChange={set('data_curso')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400" placeholder="Ex: 15/03/2025" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Duração</label>
                <input type="text" value={form.duracao} onChange={set('duracao')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400" placeholder="Ex: 8 horas" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nível</label>
                <select value={form.nivel} onChange={set('nivel')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400">
                  <option value="">Selecionar...</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vagas</label>
                <input type="text" value={form.vagas} onChange={set('vagas')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400" placeholder="Ex: 20" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={async e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const id = await uploadBanner(file)
                    setForm(f => ({ ...f, banner_image: id }))
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
              />
              {uploadingBanner && <p className="text-xs text-gray-400 mt-1">Enviando banner...</p>}
              {form.banner_image && !uploadingBanner && <p className="text-xs text-green-600 mt-1">Banner carregado</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ordem</label>
                <input type="number" value={form.ordem} onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={set('status')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400">
                  <option value="published">Publicado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving || !form.titulo || uploadingBanner}
                className="flex-1 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
