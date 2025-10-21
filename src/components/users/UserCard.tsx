import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { User } from '@/types'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {user.permissions.map((permission, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{permission}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}