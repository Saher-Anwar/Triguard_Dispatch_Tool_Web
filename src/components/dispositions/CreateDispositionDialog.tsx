import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createDisposition } from "@/api/disposition"
import type { Disposition } from "@/types"

export function CreateDispositionDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const queryClient = useQueryClient()

  const createDispositionMutation = useMutation({
    mutationFn: ({ code, description }: { code: string; description: string }) =>
      createDisposition(code, description),
    onMutate: async ({ code, description }) => {
      await queryClient.cancelQueries({ queryKey: ['dispositions'] })
      const previousDispositions = queryClient.getQueryData<Disposition[]>(['dispositions'])
      
      // Optimistically add the new disposition
      const newDisposition: Disposition = {
        code,
        description,
      }
      
      queryClient.setQueryData<Disposition[]>(['dispositions'], (old) =>
        old ? [...old, newDisposition] : [newDisposition]
      )
      
      return { previousDispositions }
    },
    onSuccess: (data) => {
      toast.success(`Success: ${JSON.stringify(data)}`)
      setIsOpen(false)
      resetForm()
    },
    onError: (error, _variables, context) => {
      if (context?.previousDispositions) {
        queryClient.setQueryData(['dispositions'], context.previousDispositions)
      }
      toast.error(`Failure: ${error.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositions'] })
    },
  })

  const resetForm = () => {
    setCode("")
    setDescription("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim() || !description.trim()) {
      toast.error("Both code and description are required")
      return
    }

    createDispositionMutation.mutate({
      code: code.trim(),
      description: description.trim(),
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const isFormValid = code.trim() && description.trim()

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-sm md:text-base">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Disposition</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[95vw] sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Create New Disposition</DialogTitle>
            <DialogDescription className="text-sm">
              Enter a code and description for the new disposition.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Code Input */}
            <div className="space-y-2">
              <Label htmlFor="disposition-code">Code</Label>
              <Input
                id="disposition-code"
                type="text"
                placeholder="Enter disposition code..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="disposition-description">Description</Label>
              <Input
                id="disposition-description"
                type="text"
                placeholder="Enter disposition description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={!isFormValid || createDispositionMutation.isPending}
            >
              {createDispositionMutation.isPending ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}