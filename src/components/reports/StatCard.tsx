import { Card, CardContent } from '@/components/ui/card'
import type { StatData } from '@/types'
import { cn } from '@/lib/utils'

interface StatCardProps {
  stat: StatData
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </div>
          <div className="text-4xl font-bold">
            {stat.value}
          </div>
          {stat.change && (
            <div className={cn(
              "text-sm font-medium",
              stat.changeType === 'positive' && "text-emerald-500",
              stat.changeType === 'negative' && "text-red-500",
              stat.changeType === 'neutral' && "text-muted-foreground"
            )}>
              {stat.change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}