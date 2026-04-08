'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/admin/Modal'
import { getAssetUrl } from '@/lib/directus'
import Image from 'next/image'

interface Professor {
  id: number
  nome: string
  especialidade?: string
  whatsapp?: string
  foto?: string
  status: string
}

const empty = (): Omit<Professor, 'id'> => ({
  nome: '',
  especialidade: '',
  whatsapp: '',
  foto: undefined,
  status: 'published',
})

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Professor | null>(null)
  const [form, setForm] = useState(empty())
  const [saving, setSaving] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/professores')
    const data = await res.json()
    setProfessores(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openAdd() {
    setForm(empty())
    setEditing(null)
    setModal('add')
  }

  function openEdit(p: Professor) {
    setForm({ nome: p.nome, especialidade: p.especialidade ?? '', whatsapp: p.whatsapp ?? '', foto: p.foto, status: p.status })
    setEditing(p)
    setModal('edit')
  }

  async function uploadFoto(file: File) {
    setUploadingFoto(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const { id } = await res.json()
    setUploadingFoto(false)
    return id as string
  }

  async function save() {
    setSaving(true)
    const payload = { ...form }
    if (modal === 'add') {
      await fetch('/api/admin/professores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } else if (editing) {
      await fetch(`/api/admin/professores/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setSaving(false)
    setModal(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('Remover professor?')) return
    await fetch(`/api/admin/professores/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Professores</h2>
          <p className="text-sm text-gray-500">{professores.length} cadastrado(s)</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Professor
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Carregando...</div>
          ) : professores.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhum professor cadastrado</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Professor</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Especialidade</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">WhatsApp</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {professores.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          {p.foto ? (
                            <Image
                              src={getAssetUrl(p.foto, { width: 72, height: 72, fit: 'cover' })}
                              alt={p.nome}
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{p.nome}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{p.especialidade || '—'}</td>
                    <td className="py-3 px-4 text-gray-500">{p.whatsapp || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => remove(p.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
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
        <Modal title={modal === 'add' ? 'Novo Professor' : 'Editar Professor'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Especialidade</label>
              <input
                type="text"
                value={form.especialidade}
                onChange={e => setForm(f => ({ ...f, especialidade: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                placeholder="Ex: Cardiologista"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                placeholder="5588999999999"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Foto</label>
              <input
                type="file"
                accept="image/*"
                onChange={async e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const id = await uploadFoto(file)
                    setForm(f => ({ ...f, foto: id }))
                  }
                }}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
              />
              {uploadingFoto && <p className="text-xs text-gray-400 mt-1">Enviando foto...</p>}
              {form.foto && !uploadingFoto && <p className="text-xs text-green-600 mt-1">Foto carregada</p>}
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
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={saving || !form.nome || uploadingFoto}
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
