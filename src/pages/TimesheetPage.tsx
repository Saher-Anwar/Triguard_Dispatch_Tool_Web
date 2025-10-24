import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { TimesheetDataTable } from '@/components/timesheets/TimesheetDataTable'
import { useQuery } from '@tanstack/react-query'
import { getTimesheets, getUserTimesheets } from '@/api/timesheet'
import type { Timesheet } from '@/types'
import { useState } from 'react'

export function TimesheetPage() {
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null)
  const [timesheetFilter, setTimesheetFilter] = useState('all')

  const { data: timesheets = [], isLoading, isError } = useQuery({
    queryKey: ['timesheets', timesheetFilter],
    queryFn: timesheetFilter === 'all' ? getTimesheets : getUserTimesheets,
  })

  const handleTimesheetClick = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet)
    console.log('Timesheet clicked:', timesheet)
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Timesheets</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Timesheet
          </Button>
        </div>
      </div>

      {/* Filter Button Group */}
      <div className="flex items-center space-x-6">
        <ButtonGroup>
          <Button 
            variant={timesheetFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setTimesheetFilter('all')}
          >
            All Timesheets
          </Button>
          <Button 
            variant={timesheetFilter === 'my' ? 'default' : 'outline'}
            onClick={() => setTimesheetFilter('my')}
          >
            My Timesheets
          </Button>
        </ButtonGroup>
      </div>

      {/* Timesheets Data Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading timesheets...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load timesheets</p>
        </div>
      ) : (
        <TimesheetDataTable 
          timesheets={timesheets} 
          onTimesheetClick={handleTimesheetClick}
        />
      )}
    </div>
  )
}