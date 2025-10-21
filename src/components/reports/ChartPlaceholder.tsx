import { BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ChartPlaceholderProps {
  title: string
  description?: string
}

export function ChartPlaceholder({ title, description }: ChartPlaceholderProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}