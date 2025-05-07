"use client"

import { MoreHorizontal } from "lucide-react"
import { useContext, useState } from "react"

import { authLocalization } from "../../lib/auth-localization"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface UserActionMenuProps {
  userId: string
  status: "active" | "banned"
  onBan: () => void
  onUnban: () => void
  onRemove: () => void
}

export function UserActionMenu({
  userId,
  status,
  onBan,
  onUnban,
  onRemove,
}: UserActionMenuProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "active" ? (
            <DropdownMenuItem onClick={onBan}>
              Ban
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onUnban}>
              Unban
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setShowRemoveDialog(true)} className="text-red-600">
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onRemove()
                setShowRemoveDialog(false)
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
