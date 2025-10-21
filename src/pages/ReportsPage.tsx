import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatCard } from '@/components/reports/StatCard'
import { ChartPlaceholder } from '@/components/reports/ChartPlaceholder'
import { StatData } from '@/types'

const mockStats: StatData[] = [
  {
    label: 'Total Appointments',
    value: 127,
    change: '+12% from last week',
    changeType: 'positive'
  },
  {
    label: 'Completed',
    value: 89,
    change: '+8% from last week',
    changeType: 'positive'
  },
  {
    label: 'In Progress',
    value: 15,
    change: 'Currently active',
    changeType: 'neutral'
  },
  {
    label: 'Top Performer',
    value: 'Mike Johnson',
    change: '34 completions',
    changeType: 'neutral'
  }
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Reports</h1>
        <Select defaultValue="week">
          <SelectTrigger className="w-48 bg-card border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Chart Area */}
      <ChartPlaceholder 
        title="Performance Chart Visualization"
        description="Chart components will be added here when chart libraries are installed"
      />
    </div>
  )
}