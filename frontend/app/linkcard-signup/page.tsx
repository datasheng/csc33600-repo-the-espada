"use client"

import React from 'react'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CreditCard, AlertTriangle } from "lucide-react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Button } from "@/app/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Separator } from "@/app/components/ui/separator"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useRouter } from "next/navigation"

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo - Brazzaville' },
  { code: 'CD', name: 'Congo - Kinshasa' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

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
  employerName: string
  jobTitle: string
  yearsEmployed: string
  annualIncome: string
  otherIncome: string
  bankName: string
  accountType: string
  termsAccepted: boolean
  ssn: string
  preferredCreditLimit: string
  country: string
}

export default function CreditCardSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("personal")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const router = useRouter()

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
      employerName: "",
      jobTitle: "",
      yearsEmployed: "",
      annualIncome: "",
      otherIncome: "",
      bankName: "",
      accountType: "",
      termsAccepted: false,
      ssn: "",
      preferredCreditLimit: "",
      country: "",
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

  const handleSubmitAttempt = () => {
    // Show confirmation dialog
    setShowConfirmation(true)
  }

  const handleNextSection = (currentTab: string) => {
    switch (currentTab) {
      case "personal":
        setActiveTab("address")
        setCurrentStep(2)
        break
      case "address":
        setActiveTab("financial")
        setCurrentStep(3)
        break
      case "financial":
        setActiveTab("review")
        setCurrentStep(4)
        break
      default:
        break
    }
  }

  const handlePreviousSection = (currentTab: string) => {
    switch (currentTab) {
      case "address":
        setActiveTab("personal")
        setCurrentStep(1)
        break
      case "financial":
        setActiveTab("address")
        setCurrentStep(2)
        break
      case "review":
        setActiveTab("financial")
        setCurrentStep(3)
        break
      default:
        break
    }
  }

  const resetForm = () => {
    form.reset() // Reset all form fields to default values
    setIsSubmitted(false)
    setCurrentStep(1)
    setActiveTab("personal")
    setFormErrors([])
    setShowConfirmation(false)
  }

  if (isSubmitted) {
    return (
      <>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4 mt-16">
            <div className="max-w-6xl mx-auto w-full">
              <Card className="w-full shadow-xl">
                <CardHeader className="text-center bg-gradient-to-r from-red-900 to-black">
                  <CardTitle className="text-2xl font-bold text-yellow-500">Application Submitted!</CardTitle>
                  <CardDescription className="text-gray-300">
                    Thank you for completing your LinkCard application. We've received your information and will review it shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
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
                  <div className="w-full flex gap-4">
                    <Button 
                      className="flex-1 bg-red-800 hover:bg-red-900 text-white" 
                      onClick={resetForm}
                    >
                      Submit Another Application
                    </Button>
                    <Button 
                      className="flex-1 border-red-800 text-red-800 hover:bg-red-50" 
                      variant="outline"
                      onClick={() => router.push('/')}
                    >
                      Back to Home
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  // Add this CSS animation at the top of your file, after the imports
  const bounceAnimation = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 pt-[80px] pb-[60px] px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="w-full shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-900 to-black border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">LinkCard Application</CardTitle>
                    <CardDescription className="text-gray-300">Apply for the GOLDLINKS credit card today</CardDescription>
                  </div>
                  <CreditCard className="h-10 w-10 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Application Progress</span>
                    <span className="text-sm text-gray-600">Step {currentStep} of 4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-800 h-2 rounded-full transition-all"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
                {formErrors.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-800 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-800" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Please correct the following errors:
                        </h3>
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                          {formErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="financial">Financial</TabsTrigger>
                        <TabsTrigger value="review">Review</TabsTrigger>
                      </TabsList>
                      <TabsContent value="personal">
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dateOfBirth"
                              rules={{ validate: validateDateOfBirth }}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel>Date of Birth</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  {!fieldState.error ? (
                                    <FormDescription>
                                      You must be at least 18 years old to apply.
                                    </FormDescription>
                                  ) : (
                                    <FormMessage 
                                      className="text-red-600 text-sm font-medium animate-bounce"
                                      style={{ animation: 'bounce 0.5s ease infinite' }}
                                    >
                                      You must be at least 18 years old to apply.
                                    </FormMessage>
                                  )}
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="address">
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
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
                                  <FormMessage className="text-red-600 text-sm" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] overflow-y-auto">
                                      {countries.map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                          {country.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-red-600 text-sm" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="financial">
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-red-800 border-b border-yellow-500/20 pb-2">
                            Financial Information
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="employmentStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employment Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="employed">Employed</SelectItem>
                                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                                      <SelectItem value="unemployed">Unemployed</SelectItem>
                                      <SelectItem value="retired">Retired</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="annualIncome"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Annual Income</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="$" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="ssn"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Social Security Number</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="XXX-XX-XXXX" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Your SSN is encrypted and secure
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="preferredCreditLimit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferred Credit Limit</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="$" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="review">
                        <div>
                          <h3 className="mb-4 text-lg font-medium text-red-800 border-b border-yellow-500/20 pb-2">
                            Review Your Application
                          </h3>
                          <div className="space-y-6">
                            {/* Personal Information Summary */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="font-medium mb-2">Personal Information</h4>
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <dt className="text-gray-600">Name:</dt>
                                <dd>{form.getValues("firstName")} {form.getValues("lastName")}</dd>
                                <dt className="text-gray-600">Email:</dt>
                                <dd>{form.getValues("email")}</dd>
                                <dt className="text-gray-600">Phone:</dt>
                                <dd>{form.getValues("phoneNumber")}</dd>
                              </dl>
                            </div>

                            {/* Address Information Summary */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="font-medium mb-2">Address Information</h4>
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <dt className="text-gray-600">Address:</dt>
                                <dd>
                                  {form.getValues("address1")}
                                  {form.getValues("address2") && <br />}
                                  {form.getValues("address2")}
                                </dd>
                                <dt className="text-gray-600">City, State:</dt>
                                <dd>{form.getValues("city")}, {form.getValues("state")} {form.getValues("zipCode")}</dd>
                                <dt className="text-gray-600">Country:</dt>
                                <dd>{form.getValues("country")}</dd>
                              </dl>
                            </div>

                            {/* Financial Information Summary */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="font-medium mb-2">Financial Information</h4>
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <dt className="text-gray-600">Employment:</dt>
                                <dd>{form.getValues("employmentStatus")}</dd>
                                <dt className="text-gray-600">Annual Income:</dt>
                                <dd>${form.getValues("annualIncome")}</dd>
                                <dt className="text-gray-600">Preferred Credit Limit:</dt>
                                <dd>${form.getValues("preferredCreditLimit")}</dd>
                              </dl>
                            </div>

                            <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                              <p className="text-sm text-gray-700">
                                Please review all information carefully before submitting. By submitting this application,
                                you certify that all information provided is accurate and complete.
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <CardFooter className="p-0 pt-4">
                        <div className="w-full flex gap-4">
                          {/* Show Previous button on address, financial, and review sections */}
                          {(activeTab === "address" || activeTab === "financial" || activeTab === "review") && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handlePreviousSection(activeTab)}
                              className="flex-1 border-red-800 text-red-800 hover:bg-red-50"
                            >
                              Previous Section
                            </Button>
                          )}
                          
                          {/* Show Next or Submit button */}
                          {activeTab !== "review" ? (
                            <Button
                              type="button"
                              onClick={() => handleNextSection(activeTab)}
                              className="flex-1 bg-red-800 hover:bg-red-900 text-white"
                            >
                              Next Section
                            </Button>
                          ) : (
                            <>
                              <Button
                                type="button" // Changed from type="submit"
                                className="flex-1 bg-red-800 hover:bg-red-900 text-white"
                                onClick={handleSubmitAttempt}
                                disabled={isSubmitting}
                              >
                                Review and Submit
                              </Button>
                              
                              {showConfirmation && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                                    <h3 className="text-lg font-bold text-red-800 mb-4">
                                      Confirm Application Submission
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                      Please confirm that all information provided is accurate and complete. 
                                      This application cannot be modified after submission.
                                    </p>
                                    <div className="flex gap-4">
                                      <Button
                                        type="submit"
                                        className="flex-1 bg-red-800 hover:bg-red-900 text-white"
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={isSubmitting}
                                      >
                                        {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 border-red-800 text-red-800 hover:bg-red-50"
                                        onClick={() => setShowConfirmation(false)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardFooter>
                    </Tabs>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
