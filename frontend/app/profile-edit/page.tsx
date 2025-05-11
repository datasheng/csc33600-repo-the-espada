"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { toast } from "@/app/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface FormValues {
  firstName: string
  lastName: string
  email: string
}

const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
}

export default function ProfileEditForm() {
  const [submittingField, setSubmittingField] = useState<keyof FormValues | null>(null)

  const form = useForm<FormValues>({
    defaultValues,
    mode: "onBlur",
  })

  const handleFieldSubmit = async (fieldName: keyof FormValues) => {
    setSubmittingField(fieldName)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: `${fieldName} updated`,
        description: `Your ${fieldName} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `There was a problem updating ${fieldName}.`,
        variant: "destructive",
      })
    } finally {
      setSubmittingField(null)
    }
  }

  return (
    <Card className="border-red-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-red-600 to-black text-white">
        <CardTitle>Personal Information</CardTitle>
        <CardDescription className="text-white/80">
          Update your personal details below
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-6">
            {/* First Name */}
            <form
              onSubmit={form.handleSubmit(() => handleFieldSubmit("firstName"))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="firstName"
                rules={{
                  required: "First name is required",
                  minLength: { value: 2, message: "Must be at least 2 characters" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-700">First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your first name"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    <Button
                      type="submit"
                      disabled={submittingField === "firstName"}
                      className="mt-2 bg-red-600 text-white hover:bg-red-700"
                    >
                      {submittingField === "firstName" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update First Name"
                      )}
                    </Button>
                  </FormItem>
                )}
              />
            </form>

            {/* Last Name */}
            <form
              onSubmit={form.handleSubmit(() => handleFieldSubmit("lastName"))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="lastName"
                rules={{
                  required: "Last name is required",
                  minLength: { value: 2, message: "Must be at least 2 characters" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-700">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your last name"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    <Button
                      type="submit"
                      disabled={submittingField === "lastName"}
                      className="mt-2 bg-red-600 text-white hover:bg-red-700"
                    >
                      {submittingField === "lastName" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Last Name"
                      )}
                    </Button>
                  </FormItem>
                )}
              />
            </form>

            {/* Email */}
            <form
              onSubmit={form.handleSubmit(() => handleFieldSubmit("email"))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    <Button
                      type="submit"
                      disabled={submittingField === "email"}
                      className="mt-2 bg-red-600 text-white hover:bg-red-700"
                    >
                      {submittingField === "email" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Email"
                      )}
                    </Button>
                  </FormItem>
                )}
              />
            </form>
          </div>
        </Form>
      </CardContent>
      <CardFooter className="bg-white border-t border-red-100 flex justify-between">
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          Cancel
        </Button>
        <p className="text-red-500 text-sm">Last updated: May 10, 2025</p>
      </CardFooter>
    </Card>
  )
}