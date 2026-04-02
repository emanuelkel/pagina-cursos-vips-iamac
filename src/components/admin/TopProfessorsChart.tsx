'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ProfessorData {
  professorId: string
  professorName: string
  topCourse: string
  count: number
}

interface TopProfessorsChartProps {
  data: ProfessorData[]
}

export function TopProfessorsChart({ data }: TopProfessorsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Nenhum dado disponível para este período
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: d.professorName,
    topCourse: d.topCourse,
    cliques: d.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content={({ payload }: any) => {
            if (!payload?.length) return null
            const item = payload[0].payload
            return (
              <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow text-xs">
                <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                {item.topCourse && <p className="text-gray-500">{item.topCourse}</p>}
                <p className="text-orange-500 font-bold mt-1">{item.cliques} cliques</p>
              </div>
            )
          }}
        />
        <Bar dataKey="cliques" radius={[0, 4, 4, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={index === 0 ? '#1a1a1a' : index === 1 ? '#333333' : '#666666'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
