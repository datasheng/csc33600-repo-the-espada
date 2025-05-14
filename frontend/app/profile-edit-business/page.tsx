"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { toast } from "@/app/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface BusinessFormValues {
  name: string
  address: string
  latitude: string
  longitude: string
  phone: string
  email: string
}

const defaultUserValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
}

const defaultBusinessValues: BusinessFormValues = {
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  phone: "",
  email: ""
}

export default function ProfileEditPage() {
  const [submittingField, setSubmittingField] = useState<string | null>(null)

  const userForm = useForm<FormValues>({
    defaultValues: defaultUserValues,
    mode: "onBlur",
  })

  const businessForm = useForm<BusinessFormValues>({
    defaultValues: defaultBusinessValues,
    mode: "onBlur",
  })

  const handleFieldSubmit = async (fieldName: string) => {
    setSubmittingField(fieldName)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: `${fieldName} updated`,
        description: `Your ${fieldName} has been updated successfully.`,
      })
    } catch {
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
    <>
      <Header />
      <main className="min-h-screen bg-[url('/hero-background.jpg')] bg-cover bg-fixed bg-center">
        <div className="min-h-screen w-full bg-white/[0.15] backdrop-blur-sm">
          <div className="container mx-auto px-4 py-24 space-y-10">
            {/* Profile Info Card */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Profile Details</CardTitle>
                <CardDescription className="text-gray-400">Your account information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white text-lg">John Doe</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white text-lg">johndoe@example.com</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white text-lg">Merchant</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Info Card */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Business Info</CardTitle>
                <CardDescription className="text-gray-400">Current business data</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white text-lg">The Espada</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white text-lg">123 Happy St, NYC, USA</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Latitude</p>
                    <p className="text-white text-lg">37.7749</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Longitude</p>
                    <p className="text-white text-lg">-122.4194</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white text-lg">+1 555 123 4567</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-lg">contact@email.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Edit Form */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Profile Settings</CardTitle>
                <CardDescription className="text-gray-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <Form {...userForm}>
                  {(["firstName", "lastName", "email", "password"] as (keyof FormValues)[]).map((key) => (
                    <form
                      key={key}
                      onSubmit={userForm.handleSubmit(() => handleFieldSubmit(key))}
                      className="space-y-4"
                    >
                      <FormField
                        control={userForm.control}
                        name={key}
                        rules={{ required: `${key} is required` }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              {key === "firstName"
                                ? "First Name"
                                : key === "lastName"
                                ? "Last Name"
                                : key === "email"
                                ? "Email Address"
                                : "Password"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type={key === "password" ? "password" : "text"}
                                placeholder={`Enter your ${key}`}
                                className="bg-gray-800/90 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                            <Button
                              type="submit"
                              disabled={submittingField === key}
                              className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                            >
                              {submittingField === key ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                `Update ${key}`
                              )}
                            </Button>
                          </FormItem>
                        )}
                      />
                    </form>
                  ))}
                </Form>
              </CardContent>
            </Card>

            {/* Business Edit Form */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Business Profile</CardTitle>
                <CardDescription className="text-gray-400">Update your business information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <Form {...businessForm}>
                  {(Object.entries({
                    name: { label: "Business Name", placeholder: "Enter business name" },
                    address: { label: "Address", placeholder: "Enter address" },
                    latitude: { label: "Latitude", placeholder: "e.g. 37.7749" },
                    longitude: { label: "Longitude", placeholder: "e.g. -122.4194" },
                    phone: { label: "Phone", placeholder: "e.g. +1 234 567 8900" },
                    email: {
                      label: "Business Email",
                      placeholder: "Enter email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    },
                  }) as [keyof BusinessFormValues, any][]).map(([key, config]) => (
                    <form
                      key={key}
                      onSubmit={businessForm.handleSubmit(() => handleFieldSubmit(key))}
                      className="space-y-4"
                    >
                      <FormField
                        control={businessForm.control}
                        name={key}
                        rules={{
                          required: `${config.label} is required`,
                          ...(config.pattern && { pattern: config.pattern }),
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">{config.label}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={config.placeholder}
                                className="bg-gray-800/90 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                            <Button
                              type="submit"
                              disabled={submittingField === key}
                              className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                            >
                              {submittingField === key ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                `Update ${config.label}`
                              )}
                            </Button>
                          </FormItem>
                        )}
                      />
                    </form>
                  ))}
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
