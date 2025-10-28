import { Check, User as UserIcon, Mail, MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { User } from '@/types'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            {user.role && (
              <p className="text-sm text-muted-foreground">{user.role.name}</p>
            )}
            {user.status && (
              <p className="text-xs text-muted-foreground">{user.status}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="profile">
            <AccordionTrigger>Profile</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {user.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
                {user.profile?.age && (
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">Age: {user.profile.age}</span>
                  </div>
                )}
                {user.profile?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{user.profile.address}</span>
                  </div>
                )}
                {user.profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{user.profile.phone}</span>
                  </div>
                )}
                {user.profile?.department && (
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">Department: {user.profile.department}</span>
                  </div>
                )}
                {/* Display any other profile fields that aren't handled above */}
                {user.profile && Object.entries(user.profile)
                  .filter(([key]) => !['age', 'address', 'phone', 'department'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">
                        {String(value)}
                      </span>
                    </div>
                  ))
                }
                {(!user.profile || Object.keys(user.profile).length === 0) && (
                  <div className="text-sm text-muted-foreground italic">
                    No profile information available
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="permissions">
            <AccordionTrigger>Permissions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {user.permissions.length > 0 ? (
                  user.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{permission.description}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    No permissions assigned
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}