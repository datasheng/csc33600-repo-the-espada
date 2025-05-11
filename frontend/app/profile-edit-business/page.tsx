"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { toast } from "@/app/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface FormValues {
  storeName: string
  email: string
  phoneNumber: string
  address: string
}

function BusinessProfileEditForm() {
  const [loadingField, setLoadingField] = useState<string | null>(null)

  const defaultValues: FormValues = {
    storeName: "",
    email: "",
    phoneNumber: "",
    address: "",
  }

  const form = useForm<FormValues>({
    defaultValues,
    mode: "onBlur",
  })

  const handleUpdate = async (field: keyof FormValues, value: string) => {
    setLoadingField(field)

    try {
      // Simulated API update call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Updated",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: `Could not update ${field}.`,
        variant: "destructive",
      })
    } finally {
      setLoadingField(null)
    }
  }

  return (
    <Card className="border-red-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-red-600 to-black text-white">
        <CardTitle>Business Profile</CardTitle>
        <CardDescription className="text-white/80">Edit your business information below</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-6">
            {/* Store Name */}
            <FormField
              control={form.control}
              name="storeName"
              rules={{ required: "Store name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-700">Store Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your store name" />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    disabled={loadingField === "storeName"}
                    onClick={() => handleUpdate("storeName", field.value)}
                    className="mt-2 bg-red-600 text-white hover:bg-red-700"
                  >
                    {loadingField === "storeName" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Store Name"
                    )}
                  </Button>
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-700">Business Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="Enter business email" />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    disabled={loadingField === "email"}
                    onClick={() => handleUpdate("email", field.value)}
                    className="mt-2 bg-red-600 text-white hover:bg-red-700"
                  >
                    {loadingField === "email" ? (
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

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} placeholder="Enter phone number" />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    disabled={loadingField === "phoneNumber"}
                    onClick={() => handleUpdate("phoneNumber", field.value)}
                    className="mt-2 bg-red-600 text-white hover:bg-red-700"
                  >
                    {loadingField === "phoneNumber" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Phone Number"
                    )}
                  </Button>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-red-700">Business Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter business address" />
                  </FormControl>
                  <FormMessage />
                  <Button
                    type="button"
                    disabled={loadingField === "address"}
                    onClick={() => handleUpdate("address", field.value)}
                    className="mt-2 bg-red-600 text-white hover:bg-red-700"
                  >
                    {loadingField === "address" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Address"
                    )}
                  </Button>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
      <CardFooter className="bg-white border-t border-red-100 flex justify-end">
        <p className="text-red-500 text-sm">Last updated: May 10, 2025</p>
      </CardFooter>
    </Card>
  )
}

export default function BusinessProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-8">Edit Business Profile</h1>
          <BusinessProfileEditForm />
        </div>
      </div>
    </div>
  )
}