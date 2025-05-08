"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { authLocalization } from "../../lib/auth-localization"
import { cn, getLocalizedError } from "../../lib/utils"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
}

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, { message: authLocalization.adminNameRequired }),
  email: z.string().min(1, { message: authLocalization.adminEmailRequired }).email({ 
    message: authLocalization.adminEmailInvalid 
  }),
  password: z.string().min(8, { 
    message: authLocalization.passwordMinLength 
  }),
  role: z.string().min(1, { message: authLocalization.adminRoleRequired })
})

type FormValues = z.infer<typeof formSchema>

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserDialogProps) {
  const { authClient, toast: renderToast } = useContext(AuthUIContext)
  
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user"
    }
  })
  
  const isSubmitting = form.formState.isSubmitting
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  async function createUser(values: FormValues) {
    try {
      // Process role field - convert comma-separated string to array if needed
      const roleValue = values.role.includes(",") 
        ? values.role.split(",").map(r => r.trim()) 
        : values.role
        
      await (authClient as any).admin.createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: roleValue,
      })

      renderToast({
        variant: "success",
        message: authLocalization.userCreatedSuccess,
      })

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
      onUserCreated()
    } catch (error) {
      console.error("Failed to create user:", error)
      renderToast({
        variant: "error",
        message: authLocalization.userCreatedError,
      })
      
      // Reset password field on error
      form.resetField("password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{authLocalization.createUser}</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(createUser)} className="space-y-4 py-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="user"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Default is "user". For multiple roles, separate with comma (e.g., "user,admin")
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {authLocalization.creatingUser}
                  </>
                ) : (
                  authLocalization.createUser
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
