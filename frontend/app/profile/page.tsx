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

const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
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
    <>
      <Header />
      <main className="min-h-screen bg-[url('/hero-background.jpg')] bg-cover bg-fixed bg-center">
        <div className="min-h-screen w-full bg-white/[0.15] backdrop-blur-sm">
          <div className="container mx-auto px-4 py-24">
            {/* Profile Details Card */}
            <Card className="max-w-2xl mx-auto mb-8 bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Profile Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Your account information
                </CardDescription>
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
                    <p className="text-white text-lg">Shopper</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Profile Settings Card */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Profile Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
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
                            <FormLabel className="text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your first name"
                                className="bg-gray-800/90 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                            <Button
                              type="submit"
                              disabled={submittingField === "firstName"}
                              className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
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
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your last name"
                                className="bg-gray-800/90 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                            <Button
                              type="submit"
                              disabled={submittingField === "lastName"}
                              className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
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
                            <FormLabel className="text-gray-300">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800/90 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                            <Button
                              type="submit"
                              disabled={submittingField === "email"}
                              className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
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

                    {/* Password */}
                    <form
                      onSubmit={form.handleSubmit(() => handleFieldSubmit("password"))}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        rules={{
                          required: "Password is required",
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">New Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Enter new password"
                                className="bg-gray-800/90 border-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                            <Button
                              type="submit"
                              disabled={submittingField === "password"}
                              className="mt-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                            >
                              {submittingField === "password" ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                "Update Password"
                              )}
                            </Button>
                          </FormItem>
                        )}
                      />
                    </form>
                  </div>
                </Form>
              </CardContent>
              <CardFooter className="bg-black/40 border-t border-yellow-400/20" />
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}