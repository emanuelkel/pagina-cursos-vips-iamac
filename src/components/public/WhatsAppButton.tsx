'use client'

import { useState } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'

interface WhatsAppButtonProps {
  courseId: string
}

export function WhatsAppButton({ courseId }: WhatsAppButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/track-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      if (!res.ok) throw new Error('Erro ao processar')

      const { whatsappUrl } = await res.json()
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    } catch {
      // Fallback silencioso
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors duration-200 shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4" />
      )}
      {loading ? 'Aguarde...' : 'Tenho interesse'}
    </button>
  )
}
