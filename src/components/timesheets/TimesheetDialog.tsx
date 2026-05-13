import * as React from "react"
import { ChevronDownIcon, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { TimesheetData } from "@/types"

interface TimesheetSlot {
  id: string
  date: Date | undefined
  startTime: string
  endTime: string
  isDatePickerOpen: boolean
}

interface TimesheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (entries: TimesheetData[]) => void
}

export function TimesheetDialog({ open, onOpenChange, onSave }: TimesheetDialogProps) {
  const [slots, setSlots] = React.useState<TimesheetSlot[]>([
    {
      id: "1",
      date: undefined,
      startTime: "09:00",
      endTime: "17:00",
      isDatePickerOpen: false,
    },
  ])

  const addSlot = () => {
    const newSlot: TimesheetSlot = {
      id: Date.now().toString(),
      date: undefined,
      startTime: "09:00",
      endTime: "17:00",
      isDatePickerOpen: false,
    }
    setSlots([...slots, newSlot])
  }

  const removeSlot = (id: string) => {
    if (slots.length > 1) {
      setSlots(slots.filter(slot => slot.id !== id))
    }
  }

  const updateSlot = (id: string, updates: Partial<TimesheetSlot>) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ))
  }

  const handleDateSelect = (slotId: string, date: Date | undefined) => {
    updateSlot(slotId, { date, isDatePickerOpen: false })
  }

  const handleSave = () => {
    const validEntries: TimesheetData[] = slots
      .filter(slot => slot.date && slot.startTime && slot.endTime)
      .map(slot => ({
        id: slot.id,
        date: slot.date!.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        start_time: slot.startTime + ":00", // Add seconds
        end_time: slot.endTime + ":00", // Add seconds
      }))

    if (validEntries.length > 0) {
      onSave?.(validEntries)
      onOpenChange(false)
      // Reset form
      setSlots([{
        id: "1",
        date: undefined,
        startTime: "09:00",
        endTime: "17:00",
        isDatePickerOpen: false,
      }])
    }
  }

  const isFormValid = slots.every(slot => slot.date && slot.startTime && slot.endTime)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            New Timesheet Entry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Time Entries</h3>
              <Button
                onClick={addSlot}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
            </div>

            {slots.map((slot, index) => (
              <div key={slot.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Entry {index + 1}</span>
                  {slots.length > 1 && (
                    <Button
                      onClick={() => removeSlot(slot.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Picker */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor={`date-picker-${slot.id}`} className="px-1">
                      Date
                    </Label>
                    <Popover 
                      open={slot.isDatePickerOpen} 
                      onOpenChange={(open) => updateSlot(slot.id, { isDatePickerOpen: open })}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id={`date-picker-${slot.id}`}
                          className="w-full justify-between font-normal"
                        >
                          {slot.date ? slot.date.toLocaleDateString() : "Select date"}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={slot.date}
                          captionLayout="dropdown"
                          onSelect={(date) => handleDateSelect(slot.id, date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Start Time */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor={`start-time-${slot.id}`} className="px-1">
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      id={`start-time-${slot.id}`}
                      value={slot.startTime}
                      onChange={(e) => updateSlot(slot.id, { startTime: e.target.value })}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>

                  {/* End Time */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor={`end-time-${slot.id}`} className="px-1">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      id={`end-time-${slot.id}`}
                      value={slot.endTime}
                      onChange={(e) => updateSlot(slot.id, { endTime: e.target.value })}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save Timesheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}