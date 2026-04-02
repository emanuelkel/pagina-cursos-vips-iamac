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

interface CourseData {
  courseId: string
  courseTitle: string
  professorName: string
  count: number
}

interface TopCoursesChartProps {
  data: CourseData[]
}

function shortenTitle(title: string, max = 28): string {
  return title.length > max ? title.slice(0, max) + '…' : title
}

export function TopCoursesChart({ data }: TopCoursesChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Nenhum dado disponível para este período
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: shortenTitle(d.courseTitle),
    fullName: d.courseTitle,
    professor: d.professorName,
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
          width={160}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content={({ payload }: any) => {
            if (!payload?.length) return null
            const item = payload[0].payload
            return (
              <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow text-xs">
                <p className="font-semibold text-gray-900 mb-1">{item.fullName}</p>
                <p className="text-gray-500">{item.professor}</p>
                <p className="text-orange-500 font-bold mt-1">{item.cliques} cliques</p>
              </div>
            )
          }}
        />
        <Bar dataKey="cliques" radius={[0, 4, 4, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={index === 0 ? '#f97316' : index === 1 ? '#fb923c' : '#fdba74'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
