export const PROFIT_CENTER_FIELD_ID = "87b9669f62217dd75a5b8258da696fc3f76a9488"

export type ProfitCenter = {
  id: number
  label: string
}

export const PROFIT_CENTERS: readonly ProfitCenter[] = [
  { id: 9, label: "Estrategia, Innovación y Cultura" },
  { id: 11, label: "Gestión Tecnológica e I+D" },
  { id: 12, label: "Sostenibilidad" },
  { id: 272, label: "Productividad e IA" },
  { id: 10, label: "Innk" },
  { id: 44, label: "Upskill" },
] as const

export type ProfitCenterId = typeof PROFIT_CENTERS[number]['id']

export function getProfitCenterName(id: number | string): string {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id
  if (isNaN(numericId)) {
    console.warn("Invalid profit center ID:", id)
    return "General"
  }
  const profitCenter = PROFIT_CENTERS.find((center: ProfitCenter) => center.id === numericId)
  return profitCenter?.label || "General"
}

export function getProfitCenterId(name: string): number | null {
  const profitCenter = PROFIT_CENTERS.find((center: ProfitCenter) => center.label === name)
  return profitCenter?.id || null
}
