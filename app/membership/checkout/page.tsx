"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  StarIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";


export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "basic";

  const [formData, setFormData] = useState(() => {
    // Check if we're in the browser and if there's saved form data
    if (typeof window !== 'undefined') {
      const savedFormData = localStorage.getItem('checkoutFormData');
      console.log('Initial load - saved form data:', savedFormData);

      if (savedFormData) {
        try {
          // Parse the saved data
          const parsedData = JSON.parse(savedFormData);
          console.log('Successfully loaded form data:', parsedData);
          return parsedData;
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }

    console.log('Using default form data');
    // Default form data if nothing is saved
    return {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      country: "United States",
      agreeToTerms: false
    };
  });

  // Check for navigation from invoice page and clear data when appropriate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('checkoutFormData');
      const fromInvoice = sessionStorage.getItem('fromInvoicePage');
      const paymentSuccessful = localStorage.getItem('paymentSuccessful');

      console.log('Component mounted - localStorage data:', savedData);

      // If we're not coming from the invoice page and payment wasn't just successful,
      // clear the form data to start fresh
      if (!fromInvoice && !paymentSuccessful) {
        localStorage.removeItem('checkoutFormData');
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          address: "",
          city: "",
          zipCode: "",
          country: "United States",
          agreeToTerms: false
        });
      }

      // Clear the navigation flag
      sessionStorage.removeItem('fromInvoicePage');
    }
  }, []);

  // Check for errors, payment success, or reset parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const paymentSuccessful = localStorage.getItem('paymentSuccessful');
      const checkoutError = localStorage.getItem('checkoutError');
      const urlParams = new URLSearchParams(window.location.search);
      const resetParam = urlParams.get('reset');
      const errorParam = urlParams.get('error');

      // If reset parameter is present, clear all stored data
      if (resetParam === 'true') {
        localStorage.removeItem('paymentSuccessful');
        localStorage.removeItem('checkoutError');
        sessionStorage.removeItem('invoiceNumber');
        sessionStorage.removeItem('billingInfo');
        sessionStorage.removeItem('checkoutFormData');

        // Reload the page without reset parameter
        const plan = urlParams.get('plan') || 'basic';
        window.location.href = `/membership/checkout?plan=${plan}`;
        return;
      }

      // Check for error message from payment page
      if (checkoutError || errorParam === 'missing_data') {
        const errorMessage = checkoutError || 'Please complete your personal information before proceeding to payment.';

        // Show error message
        const messageElement = document.createElement('div');
        messageElement.className = 'fixed inset-x-0 top-0 z-50 flex justify-center';
        messageElement.innerHTML = `
          <div class="mt-4 rounded-lg bg-red-50 p-4 shadow-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">
                  ${errorMessage}
                </p>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(messageElement);

        // Clear error after 5 seconds
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
          }
          localStorage.removeItem('checkoutError');
        }, 5000);
      }

      // Check for successful payment
      if (paymentSuccessful === 'true') {
        console.log('Payment was successful, checking for invoice number');
        const invoiceNumber = sessionStorage.getItem('invoiceNumber');

        if (invoiceNumber) {
          console.log('Found invoice number:', invoiceNumber);

          // Show a message that a payment was already successful
          const messageElement = document.createElement('div');
          messageElement.className = 'fixed inset-x-0 top-0 z-50 flex justify-center';
          messageElement.innerHTML = `
            <div class="mt-4 rounded-lg bg-yellow-50 p-4 shadow-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">
                    You have a successful payment. You will be redirected to the payment details page in 20 seconds.
                  </p>
                  <p class="mt-2 text-sm text-yellow-700">
                    <a href="/membership/payment?plan=${urlParams.get('plan') || 'basic'}" class="font-medium text-yellow-700 underline hover:text-yellow-600">
                      View your payment details now
                    </a>
                    or
                    <a href="/membership/checkout?plan=${urlParams.get('plan') || 'basic'}&reset=true" class="font-medium text-yellow-700 underline hover:text-yellow-600">
                      start a new purchase
                    </a>
                  </p>
                </div>
              </div>
            </div>
          `;
          document.body.appendChild(messageElement);

          // Automatically redirect to payment page after 20 seconds
          setTimeout(() => {
            const plan = urlParams.get('plan') || 'basic';
            window.location.href = `/membership/payment?plan=${plan}`;
          }, 20000);
        }
      }
    }
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get plan details based on the plan parameter
  const getPlanDetails = () => {
    switch(plan) {
      case "premium":
        return {
          name: "Premium",
          price: "49.99",
          features: [
            "All Basic features",
            "Group fitness classes",
            "Personalized workout plan",
            "Nutrition consultation"
          ]
        };
      case "elite":
        return {
          name: "Elite",
          price: "79.99",
          features: [
            "All Premium features",
            "Personal training sessions",
            "Advanced health monitoring",
            "Exclusive member events"
          ]
        };
      default:
        return {
          name: "Basic",
          price: "29.99",
          features: [
            "Access to gym floor",
            "Basic equipment usage",
            "Locker room access",
            "Free water station"
          ]
        };
    }
  };

  const planDetails = getPlanDetails();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    // Default behavior for other fields
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Update state
    setFormData(updatedFormData);

    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkoutFormData', JSON.stringify(updatedFormData));
      console.log('Saved to localStorage:', updatedFormData);

      // Verify it was saved correctly
      const savedData = localStorage.getItem('checkoutFormData');
      console.log('Verification - data in localStorage:', savedData);
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Card validation is now handled by Stripe Elements

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Save form data to session storage for the payment page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
          console.log('Form data saved to session storage for payment page');

          // Redirect to payment page
          window.location.href = `/membership/payment?plan=${plan}`;
        }
      } catch (error: any) {
        console.error('Error saving form data:', error);
        setIsSubmitting(false);

        setErrors(prev => ({
          ...prev,
          general: 'An error occurred while processing your information. Please try again.'
        }));
      }
    }
  };

  // These functions are now moved to the payment page

  // Success page is now handled in the payment page

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F9FA] pt-16">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-[#2A2A2A]">Complete Your Order</h1>
          <p className="mx-auto max-w-2xl text-[#2A2A2A]">You're just a few steps away from starting your fitness journey with our {planDetails.name} plan</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 hidden md:block">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5FC51] text-[#2A2A2A]">1</div>
              <span className="mt-2 text-sm font-medium text-[#2A2A2A]">Plan Selection</span>
            </div>
            <div className="h-1 w-24 bg-[#D5FC51]"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5FC51] text-[#2A2A2A]">2</div>
              <span className="mt-2 text-sm font-medium text-[#2A2A2A]">Checkout</span>
            </div>
            <div className="h-1 w-24 bg-[#D9D9D9]"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D9] text-[#2A2A2A]">3</div>
              <span className="mt-2 text-sm text-[#2A2A2A]">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-lg border border-[#D9D9D9] bg-white p-8 shadow-md">
              <h2 className="mb-6 text-xl font-bold text-[#2A2A2A]">Personal Information</h2>

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${errors.firstName ? 'border-red-500' : 'border-[#D9D9D9]'} bg-white p-3 pl-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${errors.lastName ? 'border-red-500' : 'border-[#D9D9D9]'} bg-white p-3 pl-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-[#D9D9D9]'} bg-white p-3 pl-10 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20`}
                    placeholder="john.doe@example.com"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {errors.email && (
                    <div className="mt-1 flex items-center text-sm text-red-500">
                      <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>



              <div className="mb-8 rounded-lg bg-[#F8F9FA] p-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 rounded-full bg-[#D5FC51] p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2A2A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2A2A2A]">Billing Address</h2>
                    <p className="text-sm text-gray-600">Please provide your billing address</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="address" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      className={`w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-[#D9D9D9]'} bg-white p-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20`}
                    />
                    {errors.address && (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                        {errors.address}
                      </div>
                    )}
                  </div>
                </div>

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className={`w-full rounded-md border ${errors.city ? 'border-red-500' : 'border-[#D9D9D9]'} bg-white p-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20`}
                    />
                    {errors.city && (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                        {errors.city}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    ZIP Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                      className={`w-full rounded-md border ${errors.zipCode ? 'border-red-500' : 'border-[#D9D9D9]'} bg-white p-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20`}
                    />
                    {errors.zipCode && (
                      <div className="mt-1 flex items-center text-sm text-red-500">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                        {errors.zipCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="country" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-md border border-[#D9D9D9] bg-white p-3 pr-10 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20"
                  >
                    <option value="Albania">Albania</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Canada">Canada</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Greece">Greece</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Hungary">Hungary</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Romania">Romania</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Turkey">Turkey</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              </div>

              <div className="mb-8 mt-8 rounded-lg border border-[#D5FC51] bg-[#F8F9FA] p-6">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-[#D9D9D9] text-[#D5FC51] focus:ring-[#D5FC51]"
                    />
                  </div>
                  <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-[#2A2A2A]">
                    I agree to the <Link href="/terms" className="font-medium text-[#2A2A2A] underline hover:text-[#D5FC51]">Terms and Conditions</Link> and <Link href="/privacy" className="font-medium text-[#2A2A2A] underline hover:text-[#D5FC51]">Privacy Policy</Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <div className="mt-2 flex items-center text-sm text-red-500">
                    <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                    {errors.agreeToTerms}
                  </div>
                )}
              </div>

              <div className="mb-6 rounded-lg bg-[#F8F9FA] p-4 text-center">
                <p className="text-sm text-gray-600">
                  After clicking "Continue to Payment", you will be taken to our secure payment page to enter your card details.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Link href={`/membership/${plan}`} className="flex items-center text-[#2A2A2A] hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Return to plan details
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center rounded-md bg-[#D5FC51] px-8 py-4 font-medium text-[#2A2A2A] shadow-md transition-all duration-200 hover:bg-[#c2e94a] hover:shadow-lg disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="mr-2 h-5 w-5 animate-spin text-[#2A2A2A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="mr-2 h-5 w-5" />
                      Continue to Payment
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div>
            <div className="sticky top-20 rounded-lg border-2 border-[#D5FC51] bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2A2A2A]">Order Summary</h2>
                <div className="rounded-full bg-[#D5FC51] px-3 py-1 text-xs font-bold text-[#2A2A2A]">
                  {planDetails.name} Plan
                </div>
              </div>

              <div className="mb-6 rounded-lg bg-[#F8F9FA] p-5">
                <div className="mb-3 flex items-center">
                  <div className="mr-3 rounded-full bg-[#D5FC51] p-2">
                    {planDetails.name === "Basic" ? (
                      <CheckIcon className="h-5 w-5 text-[#2A2A2A]" />
                    ) : planDetails.name === "Premium" ? (
                      <StarIcon className="h-5 w-5 text-[#2A2A2A]" />
                    ) : (
                      <SparklesIcon className="h-5 w-5 text-[#2A2A2A]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2A2A2A]">{planDetails.name} Membership</h3>
                    <p className="text-sm text-gray-600">Monthly subscription</p>
                  </div>
                </div>
                <ul className="ml-2 space-y-2 text-sm text-[#2A2A2A]">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="mr-2 h-5 w-5 flex-shrink-0 text-[#D5FC51]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 space-y-3 border-b border-[#D9D9D9] pb-6">
                <div className="flex justify-between">
                  <span className="text-[#2A2A2A]">Subtotal</span>
                  <span className="text-[#2A2A2A]">${planDetails.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2A2A2A]">Tax</span>
                  <span className="text-[#2A2A2A]">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2A2A2A]">Discount</span>
                  <span className="text-[#2A2A2A]">$0.00</span>
                </div>
              </div>

              <div className="mb-6 flex justify-between rounded-lg bg-[#D5FC51] bg-opacity-20 p-4">
                <span className="text-xl font-bold text-[#2A2A2A]">Total</span>
                <div className="text-right">
                  <span className="block text-xl font-bold text-[#2A2A2A]">${planDetails.price}/month</span>
                  <span className="text-xs text-gray-600">Billed monthly</span>
                </div>
              </div>

              <div className="rounded-lg bg-[#F8F9FA] p-4 text-sm text-[#2A2A2A]">
                <div className="flex items-start">
                  <div className="mr-3 rounded-full bg-[#2A2A2A] p-1">
                    <LockClosedIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Your membership will begin immediately after payment. You can cancel anytime from your account dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
