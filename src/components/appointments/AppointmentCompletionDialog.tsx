import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getDispositions } from '@/api/disposition'
import { completeAppointment } from '@/api/appointment'
import type { Appointment, Disposition } from '@/types'
import { toast } from 'sonner'

interface AppointmentCompletionDialogProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function AppointmentCompletionDialog({ 
  appointment, 
  open, 
  onOpenChange,
  onComplete 
}: AppointmentCompletionDialogProps) {
  const [selectedDisposition, setSelectedDisposition] = useState<Disposition | null>(null)
  const [note, setNote] = useState('')
  const queryClient = useQueryClient()

  // Fetch dispositions
  const { data: dispositions = [], isLoading: dispositionsLoading } = useQuery({
    queryKey: ['dispositions'],
    queryFn: getDispositions,
    enabled: open,
  })

  // Mutation for completing appointment
  const { mutate: complete, isPending } = useMutation({
    mutationFn: () => {
      if (!appointment || !selectedDisposition) {
        throw new Error('Missing appointment or disposition')
      }
      return completeAppointment(appointment.id, selectedDisposition, note)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment completed successfully')
      handleClose()
      onComplete()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to complete appointment')
    },
  })

  const handleClose = () => {
    setSelectedDisposition(null)
    setNote('')
    onOpenChange(false)
  }

  const handleSave = () => {
    if (!selectedDisposition) {
      toast.error('Please select a disposition')
      return
    }
    complete()
  }

  const handleDispositionChange = (dispositionCode: string) => {
    const disposition = dispositions.find((d: Disposition) => d.code === dispositionCode)
    setSelectedDisposition(disposition || null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Complete Appointment</DialogTitle>
          <DialogDescription>
            Please select a disposition and add any completion notes for this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Disposition Selection */}
          <div className="space-y-2">
            <Label htmlFor="disposition">Disposition</Label>
            <Select onValueChange={handleDispositionChange} disabled={dispositionsLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a disposition" />
              </SelectTrigger>
              <SelectContent>
                {dispositions.map((disposition: Disposition) => (
                  <SelectItem key={disposition.code} value={disposition.code}>
                    {disposition.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="note">Completion Notes</Label>
            <Textarea
              id="note"
              placeholder="Add any notes about the appointment completion..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedDisposition || isPending}
          >
            {isPending ? 'Completing...' : 'Complete Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}