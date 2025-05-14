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

interface BusinessFormValues {
  name: string
  address: string
  latitude: string
  longitude: string
  phone: string
  email: string
}

const currentBusinessData = {
  name: "The Espada",
  address: "123 Hello St, NY , USA",
  latitude: "37.7749",
  longitude: "-122.4194",
  phone: "+1 123 123 4567",
  email: "test@email.com"
}

const defaultValues: BusinessFormValues = {
  ...currentBusinessData
}

export default function BusinessProfileForm() {
  const [submittingField, setSubmittingField] = useState<keyof BusinessFormValues | null>(null)

  const form = useForm<BusinessFormValues>({
    defaultValues,
    mode: "onBlur",
  })

  const handleFieldSubmit = async (fieldName: keyof BusinessFormValues) => {
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
            {/* Display Current Business Data */}
            <Card className="max-w-2xl mx-auto mb-8 bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Business Info</CardTitle>
                <CardDescription className="text-gray-400">
                  Your Current Business Data
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white text-lg">{currentBusinessData.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white text-lg">{currentBusinessData.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Latitude</p>
                    <p className="text-white text-lg">{currentBusinessData.latitude}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Longitude</p>
                    <p className="text-white text-lg">{currentBusinessData.longitude}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white text-lg">{currentBusinessData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-lg">{currentBusinessData.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Form to Update Fields */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Update Business Info</CardTitle>
                <CardDescription className="text-gray-400">
                  Edit individual fields below
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <Form {...form}>
                  <div className="space-y-6">
                    {(
                      Object.entries({
                        name: { label: "Business Name", placeholder: "Enter business name", required: true },
                        address: { label: "Address", placeholder: "Enter address", required: true },
                        latitude: { label: "Latitude", placeholder: "e.g. 37.7749", required: true },
                        longitude: { label: "Longitude", placeholder: "e.g. -122.4194", required: true },
                        phone: { label: "Phone Number", placeholder: "e.g. +1 234 567 8900", required: true },
                        email: {
                          label: "Email Address",
                          placeholder: "Enter email",
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        },
                      }) as [keyof BusinessFormValues, any][]
                    ).map(([key, config]) => (
                      <form
                        key={key}
                        onSubmit={form.handleSubmit(() => handleFieldSubmit(key))}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name={key}
                          rules={{
                            required: config.required ? `${config.label} is required` : false,
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
