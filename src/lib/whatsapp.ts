export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function buildCourseMessage(courseTitle: string, professorName: string, customTemplate?: string): string {
  if (customTemplate) {
    return customTemplate
      .replace('{title}', courseTitle)
      .replace('{professor}', professorName)
  }
  return `Olá! Tenho interesse no curso "${courseTitle}" com ${professorName}`
}
