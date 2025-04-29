"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CreditCard } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Separator } from "@/app/components/ui/separator"

type fieldValues = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  employmentStatus: string
  annualIncome: string
  cardType: string
  termsAccepted: boolean
}

export default function CreditCardSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<fieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      employmentStatus: "",
      annualIncome: "",
      termsAccepted: false,
    },
    mode: "onBlur", // Validation triggered on blur
  })

  const validateFirstName = (value: string) => value.length >= 2 || "First name must be at least 2 characters."
  const validateLastName = (value: string) => value.length >= 2 || "Last name must be at least 2 characters."
  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value) || "Please enter a valid email address."
  const validatePhoneNumber = (value: string) => value.length >= 10 || "Please enter a valid phone number."
  const validateDateOfBirth = (value: string) => {
    const today = new Date()
    const birthDate = new Date(value)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 18 || "You must be at least 18 years old to apply."
  }

  function onSubmit(values: fieldValues) {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center bg-gradient-to-r from-red-900 to-black">
          <CardTitle className="text-2xl font-bold text-yellow-500">Application Submitted!</CardTitle>
          <CardDescription className="text-gray-300">
            Thank you for your credit card application. We've received your information and will review it shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-black/5 border border-yellow-500/30 p-6 text-center">
            <p className="text-lg text-red-800">
              Your application reference number:{" "}
              <span className="font-bold text-black">APP-{Math.floor(Math.random() * 1000000)}</span>
            </p>
            <p className="mt-2 text-sm text-gray-700">
              We'll send you an email with the status of your application within 2-3 business days.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-red-800 hover:bg-red-900 text-white" onClick={() => setIsSubmitted(false)}>
            Submit Another Application
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-red-900 to-black border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Credit Card Application</CardTitle>
            <CardDescription className="text-gray-300">Apply for a GOLDLINKS credit card today</CardDescription>
          </div>
          <CreditCard className="h-10 w-10 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-medium text-red-800 border-b border-yellow-500/20 pb-2">
                Personal Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ validate: validateFirstName }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ validate: validateLastName }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ validate: validateEmail }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{ validate: validatePhoneNumber }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  rules={{ validate: validateDateOfBirth }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>You must be at least 18 years old to apply.</FormDescription>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-red-800 border-b border-yellow-500/20 pb-2">
                Address Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apt, Suite, etc." {...field} />
                      </FormControl>
                      <FormDescription>Leave blank if not applicable.</FormDescription>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., NY" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" /> {/* Error message in red */}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="p-0 pt-4">
              <Button
                type="submit"
                className="w-full bg-red-800 hover:bg-red-900 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
