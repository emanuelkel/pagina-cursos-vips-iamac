'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/admin/Modal'

interface Categoria {
  id: number
  nome: string
  slug?: string
  icone?: string
  descricao?: string
  ordem?: number
  status: string
}

const empty = (): Omit<Categoria, 'id'> => ({
  nome: '',
  slug: '',
  icone: '',
  descricao: '',
  ordem: 0,
  status: 'published',
})

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [form, setForm] = useState(empty())
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categorias')
    const data = await res.json()
    setCategorias(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm(empty())
    setEditing(null)
    setModal('add')
  }

  function openEdit(c: Categoria) {
    setForm({ nome: c.nome, slug: c.slug ?? '', icone: c.icone ?? '', descricao: c.descricao ?? '', ordem: c.ordem ?? 0, status: c.status })
    setEditing(c)
    setModal('edit')
  }

  async function save() {
    setSaving(true)
    const payload = { ...form, slug: form.slug || toSlug(form.nome) }
    if (modal === 'add') {
      await fetch('/api/admin/categorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } else if (editing) {
      await fetch(`/api/admin/categorias/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setSaving(false)
    setModal(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('Remover categoria?')) return
    await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
          <p className="text-sm text-gray-500">{categorias.length} cadastrada(s)</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
          ) : categorias.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhuma categoria cadastrada</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Ícone</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Slug</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Ordem</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-2xl">{c.icone || '—'}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{c.nome}</td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">{c.slug || '—'}</td>
                    <td className="py-3 px-4 text-gray-500">{c.ordem ?? '—'}</td>
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
          )}
        </CardContent>
      </Card>

      {modal && (
        <Modal title={modal === 'add' ? 'Nova Categoria' : 'Editar Categoria'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                placeholder="Ex: Emergência"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ícone (emoji)</label>
              <input
                type="text"
                value={form.icone}
                onChange={e => setForm(f => ({ ...f, icone: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                placeholder="🏥"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none"
                placeholder="Descrição da categoria"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ordem</label>
                <input
                  type="number"
                  value={form.ordem ?? 0}
                  onChange={e => setForm(f => ({ ...f, ordem: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                >
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
                disabled={saving || !form.nome}
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
