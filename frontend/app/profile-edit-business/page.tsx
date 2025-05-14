"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { toast } from "@/app/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useRouter } from 'next/navigation';
import { Store } from "@/app/data/stores";

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
  const router = useRouter(); // Add this line
  const [submittingField, setSubmittingField] = useState<string | null>(null)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [storeData, setStoreData] = useState({
    store_name: "",
    address: "",
    latitude: "",
    longitude: "",
    phone: "",
    email: ""
  });

  const userForm = useForm<FormValues>({
    defaultValues: defaultUserValues,
    mode: "onBlur",
  })

  const businessForm = useForm<BusinessFormValues>({
    defaultValues: defaultBusinessValues,
    mode: "onBlur",
  })

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.replace('/signup');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email
      });

      // Also set form default values
      userForm.reset({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: ""
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    }
  };

  const fetchStoreData = async () => {
    try {
      const ownerID = localStorage.getItem('ownerID');
      if (!ownerID) {
        router.replace('/signup');
        return;
      }

      const response = await fetch('http://localhost:5000/api/stores');
      if (!response.ok) {
        throw new Error('Failed to fetch store data');
      }

      const stores: Store[] = await response.json();
      const ownerStore = stores.find((store: Store) => store.ownerID === parseInt(ownerID));

      if (ownerStore) {
        setStoreData({
          store_name: ownerStore.store_name,
          address: ownerStore.address,
          latitude: ownerStore.latitude.toString(),
          longitude: ownerStore.longitude.toString(),
          phone: ownerStore.phone,
          email: ownerStore.email
        });

        // Update business form with store data
        businessForm.reset({
          name: ownerStore.store_name,
          address: ownerStore.address,
          latitude: ownerStore.latitude.toString(),
          longitude: ownerStore.longitude.toString(),
          phone: ownerStore.phone,
          email: ownerStore.email
        });
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
      toast({
        title: "Error",
        description: "Failed to load store data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      await fetchStoreData();
    };
    loadData();
  }, []);

  const handleFieldSubmit = async (fieldName: string) => {
    setSubmittingField(fieldName);
    try {
        // Check if this is a user field or business field
        if (fieldName in userForm.getValues()) {
            // Handle user update
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User ID not found');

            const formData = userForm.getValues();
            const value = formData[fieldName as keyof FormValues];

            // Check for blank value
            if (!value || value.trim() === '') {
                toast({
                    title: "Error",
                    description: "Please enter a value before updating",
                    variant: "destructive",
                });
                return;
            }

            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    field: fieldName,
                    value: value
                })
            });

            if (!response.ok) throw new Error('Failed to update user data');

            const updatedUser = await response.json();
            setUserData({
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                email: updatedUser.email
            });

            // Updated success message for user fields
            toast({
                title: "Success",
                description: `${
                    fieldName === "firstName" ? "First Name" :
                    fieldName === "lastName" ? "Last Name" :
                    fieldName === "email" ? "Email Address" :
                    "Password"
                } updated successfully`,
            });
        } else {
            // Handle business update
            const ownerID = localStorage.getItem('ownerID');
            if (!ownerID) throw new Error('Owner ID not found');

            const formData = businessForm.getValues();
            const value = formData[fieldName as keyof BusinessFormValues];

            // Check for blank value
            if (!value || value.trim() === '') {
                toast({
                    title: "Error",
                    description: "Please enter a value before updating",
                    variant: "destructive",
                });
                return;
            }

            const stores = await fetch('http://localhost:5000/api/stores').then(res => res.json());
            const store = stores.find((s: Store) => s.ownerID === parseInt(ownerID));
            if (!store) throw new Error('Store not found');

            const response = await fetch(`http://localhost:5000/api/stores/${store.storeID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    field: fieldName,
                    value: formData[fieldName as keyof BusinessFormValues]
                })
            });

            if (!response.ok) throw new Error('Failed to update business data');

            const updatedStore = await response.json();
            setStoreData({
                store_name: updatedStore.store_name,
                address: updatedStore.address,
                latitude: updatedStore.latitude.toString(),
                longitude: updatedStore.longitude.toString(),
                phone: updatedStore.phone,
                email: updatedStore.email
            });

            // Updated success message for business fields
            toast({
                title: "Success",
                description: `${
                    fieldName === "name" ? "Store Name" :
                    fieldName === "address" ? "Store Address" :
                    fieldName === "latitude" ? "Store Latitude" :
                    fieldName === "longitude" ? "Store Longitude" :
                    fieldName === "phone" ? "Phone Number" :
                    "Business Email"
                } updated successfully`,
            });
        }

    } catch (error) {
        console.error('Update error:', error);
        toast({
            title: "Error",
            description: `There was a problem updating ${fieldName}.`,
            variant: "destructive",
        });
    } finally {
        setSubmittingField(null);
    }
};

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
                    <p className="text-white text-lg">
                      {userData.firstName} {userData.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Email</p>
                    <p className="text-white text-lg">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Account Type</p>
                    <p className="text-white text-lg">Business</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Info Card */}
            <Card className="max-w-2xl mx-auto bg-black/80 text-white border-yellow-400/30 shadow-2xl">
              <CardHeader className="border-b border-yellow-400/20 bg-black/40">
                <CardTitle className="text-2xl text-yellow-400">Store Info</CardTitle>
                <CardDescription className="text-gray-400">Current store information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white text-lg">{storeData.store_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white text-lg">{storeData.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Latitude</p>
                    <p className="text-white text-lg">{storeData.latitude}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Longitude</p>
                    <p className="text-white text-lg">{storeData.longitude}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone Number</p>
                  <p className="text-white text-lg">{storeData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Business Email</p>
                  <p className="text-white text-lg">{storeData.email}</p>
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
                        rules={{ 
                          required: key !== "password" ? `${key} is required` : false 
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              {key === "firstName"
                                ? "First Name"
                                : key === "lastName"
                                ? "Last Name"
                                : key === "email"
                                ? "Account Email"
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
                                `Update ${key === "firstName" 
                                  ? "First Name"
                                  : key === "lastName"
                                  ? "Last Name"
                                  : key === "email"
                                  ? "Account Email"
                                  : "Password"}`
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
                <CardTitle className="text-2xl text-yellow-400">Store Settings</CardTitle>
                <CardDescription className="text-gray-400">Update your store information</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <Form {...businessForm}>
                  {(Object.entries({
                    name: { 
                      label: "Store Name", 
                      placeholder: "Enter store name" 
                    },
                    address: { 
                      label: " Store Address", 
                      placeholder: "Enter store address" 
                    },
                    latitude: { 
                      label: "Latitude", 
                      placeholder: "e.g. 37.7749" 
                    },
                    longitude: { 
                      label: "Longitude", 
                      placeholder: "e.g. -122.4194" 
                    },
                    phone: { 
                      label: "Phone Number", 
                      placeholder: "e.g. +1 234 567 8900" 
                    },
                    email: {
                      label: "Business Email",
                      placeholder: "Enter store email",
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
