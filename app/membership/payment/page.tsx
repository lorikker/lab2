"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  CreditCardIcon,
  CheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import StripeElementsForm from "@/app/_components/stripe-elements-form";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "basic";
  const { data: session } = useSession();

  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

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

  // Load form data from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if payment was successful
      const paymentSuccessful = localStorage.getItem('paymentSuccessful');
      const urlParams = new URLSearchParams(window.location.search);
      const resetParam = urlParams.get('reset');

      // If reset parameter is present, clear payment successful flag
      if (resetParam === 'true') {
        localStorage.removeItem('paymentSuccessful');
        sessionStorage.removeItem('invoiceNumber');
        sessionStorage.removeItem('billingInfo');
        sessionStorage.removeItem('checkoutFormData');

        // Redirect to checkout page without reset parameter
        router.push(`/membership/checkout?plan=${plan}`);
        return;
      }

      if (paymentSuccessful === 'true') {
        console.log('Payment was successful, checking for invoice number');
        const invoiceNumber = sessionStorage.getItem('invoiceNumber');

        if (invoiceNumber) {
          console.log('Found invoice number:', invoiceNumber);
          setInvoiceNumber(invoiceNumber);
          setIsSuccess(true);
          setIsLoading(false);
          return;
        }
      }

      // If not successful, load form data
      const savedData = sessionStorage.getItem('checkoutFormData');

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          console.log('Loaded form data from sessionStorage:', parsedData);

          // Create payment intent
          createPaymentIntent(parsedData, planDetails, session);
        } catch (error) {
          console.error('Error parsing saved form data:', error);
          // Redirect back to checkout if data is invalid with an error message
          localStorage.setItem('checkoutError', 'There was an error processing your information. Please try again.');
          router.push(`/membership/checkout?plan=${plan}&error=invalid_data`);
        }
      } else {
        console.error('No form data found in session storage');
        // Redirect back to checkout if no data with an error message
        localStorage.setItem('checkoutError', 'Please complete your personal information before proceeding to payment.');
        router.push(`/membership/checkout?plan=${plan}&error=missing_data`);
      }

      setIsLoading(false);
    }
  }, [plan, router]);

  // Create payment intent
  const createPaymentIntent = async (formData: any, planDetails: any, currentSession?: any) => {
    try {
      setIsSubmitting(true);
      console.log('createPaymentIntent called with session:', currentSession);

      // Get price from planDetails
      const amount = parseFloat(planDetails.price);

      // Create payment intent on server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          plan: planDetails.name.toLowerCase(),
          userId: (currentSession && currentSession.user && currentSession.user.id) ? currentSession.user.id : 'e248a663-e3b6-4f03-bdaa-8cb9759b422b',
          billingInfo: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Error creating payment intent');
      }

      const { clientSecret } = await response.json();

      // Set the client secret in state to render the Stripe Elements form
      setClientSecret(clientSecret);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      setIsSubmitting(false);

      // More detailed error message
      let errorMessage = error.message || 'An error occurred while creating the payment intent';

      // Set error in localStorage and prepare to redirect
      localStorage.setItem('checkoutError', 'There was an error processing your payment. Please try again.');

      // First set the error in the current page in case redirect fails
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));

      // Redirect back to checkout after a short delay
      setTimeout(() => {
        router.push(`/membership/checkout?plan=${plan}&error=payment_intent_failed`);
      }, 1500);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log('Payment success callback with ID:', paymentIntentId);
    setIsSubmitting(false);

    // Create membership in database
    try {
      console.log('Creating membership in database...');
      const membershipResponse = await fetch('/api/process-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          userId: session?.user?.id || 'e248a663-e3b6-4f03-bdaa-8cb9759b422b',
          userName: session?.user?.name || 'Guest User',
          membershipType: planDetails.name.toLowerCase(),
          amount: parseFloat(planDetails.price),
          customerEmail: formData?.email || session?.user?.email || 'guest@example.com',
          billingInfo: formData,
        }),
      });

      if (membershipResponse.ok) {
        const membershipResult = await membershipResponse.json();
        console.log('Membership processed successfully:', membershipResult);

        // Show success message based on whether it's an extension or new membership
        if (membershipResult.message) {
          console.log(membershipResult.message);
        }
      } else {
        console.error('Failed to create membership');
      }
    } catch (error) {
      console.error('Error creating membership:', error);
    }

    setIsSuccess(true);

    // Generate a stable invoice number based on date
    const todayString = new Date().toISOString().split('T')[0];
    const today = new Date(todayString);
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const newInvoiceNumber = "INV-" + seed.toString().slice(-4).padStart(4, '0');

    console.log('Generated invoice number:', newInvoiceNumber);

    // Set the invoice number in state
    setInvoiceNumber(newInvoiceNumber);

    // Store invoice number and billing information in session storage for retrieval on invoice page
    if (typeof window !== 'undefined' && formData) {
      try {
        // Clear any existing invoice number first
        sessionStorage.removeItem('invoiceNumber');

        // Set the new invoice number
        sessionStorage.setItem('invoiceNumber', newInvoiceNumber);

        // Verify it was set correctly
        const storedInvoiceNumber = sessionStorage.getItem('invoiceNumber');
        console.log('Stored invoice number in session storage:', storedInvoiceNumber);

        // Store billing information
        const billingInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
          cardLast4: 'xxxx', // We don't have access to the card number with Stripe Elements
          paymentIntentId: paymentIntentId,
          invoiceNumber: newInvoiceNumber // Include invoice number in billing info as well
        };

        sessionStorage.setItem('billingInfo', JSON.stringify(billingInfo));
        localStorage.setItem('paymentSuccessful', 'true');

        console.log('Billing info stored in session storage:', billingInfo);

        // Show the manual redirect button
        const successActionsElement = document.getElementById('payment-success-actions');
        if (successActionsElement) {
          successActionsElement.style.display = 'block';

          // Hide the Stripe Elements form
          const stripeFormElement = document.querySelector('.StripeElement');
          if (stripeFormElement) {
            const formContainer = stripeFormElement.closest('form');
            if (formContainer) {
              formContainer.style.display = 'none';
            }
          }

          // Scroll to the success message
          successActionsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // No automatic redirect - user must click the button manually
        console.log('Payment successful. User can click the button to view invoice.');

        // Show a notification that payment was successful
        try {
          // Create a notification element
          const notificationElement = document.createElement('div');
          notificationElement.className = 'fixed bottom-4 right-4 z-50 rounded-lg bg-green-50 p-4 shadow-lg';
          notificationElement.innerHTML = `
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  Payment successful! Click the "View Invoice" button when you're ready.
                </p>
              </div>
            </div>
          `;
          document.body.appendChild(notificationElement);

          // Remove the notification after 5 seconds
          setTimeout(() => {
            if (notificationElement.parentNode) {
              notificationElement.parentNode.removeChild(notificationElement);
            }
          }, 5000);
        } catch (notificationError) {
          console.error('Error showing notification:', notificationError);
        }

        // We'll clear this flag after 5 minutes
        setTimeout(() => {
          localStorage.removeItem('paymentSuccessful');
          sessionStorage.removeItem('checkoutFormData');
        }, 5 * 60 * 1000); // 5 minutes
      } catch (error) {
        console.error('Error storing data in session storage:', error);
      }
    }
  };

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    setIsSubmitting(false);
    setErrors(prev => ({
      ...prev,
      payment: errorMessage
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F8F9FA] pt-16">
        <div className="container mx-auto max-w-4xl px-4 py-16">
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
              <div className="h-1 w-24 bg-[#D5FC51]"></div>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D5FC51] text-[#2A2A2A]">3</div>
                <span className="mt-2 text-sm font-medium text-[#2A2A2A]">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-[#D5FC51] bg-white p-8 shadow-lg">
            <div className="mb-10 flex flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-full bg-[#D5FC51] p-6">
                <CheckIcon className="h-16 w-16 text-[#2A2A2A]" />
              </div>
              <h1 className="mb-3 text-4xl font-bold text-[#2A2A2A]">Payment Successful!</h1>
              <p className="max-w-lg text-lg text-[#2A2A2A]">
                Thank you for joining FitnessHub with our {planDetails.name} plan. Your membership is now active.
              </p>

              <div className="mt-6 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-800">
                Order #FH-{invoiceNumber?.slice(-4) || '0000'}
              </div>
            </div>

            <div className="mb-10 overflow-hidden rounded-lg border border-[#D9D9D9]">
              <div className="bg-[#F8F9FA] px-6 py-4">
                <h2 className="text-xl font-bold text-[#2A2A2A]">Membership Details</h2>
              </div>
              <div className="divide-y divide-[#D9D9D9]">
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#2A2A2A]">Plan:</span>
                  <span className="font-medium text-[#2A2A2A]">{planDetails.name}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#2A2A2A]">Price:</span>
                  <span className="font-medium text-[#2A2A2A]">${planDetails.price}/month</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#2A2A2A]">Status:</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#2A2A2A]">Start date:</span>
                  <span className="font-medium text-[#2A2A2A]">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#2A2A2A]">Next billing date:</span>
                  <span className="font-medium text-[#2A2A2A]">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 rounded-lg bg-[#F8F9FA] p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-[#2A2A2A]">What's Next?</h3>
              <p className="mb-4 text-[#2A2A2A]">
                You can now access all the features of your {planDetails.name} membership. Visit your dashboard to get started.
              </p>
              <div className="mb-6 flex justify-center">
                <Link
                  href={`/membership/invoice?plan=${plan}&invoice=${invoiceNumber}`}
                  className="flex items-center rounded-md bg-[#D5FC51] px-10 py-5 text-lg font-medium text-[#2A2A2A] shadow-md transition-all duration-200 hover:bg-[#c2e94a] hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Invoice
                </Link>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="flex items-center rounded-md border border-[#2A2A2A] px-8 py-4 font-medium text-[#2A2A2A] transition-colors hover:bg-[#2A2A2A] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return to Home
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center rounded-md border border-[#2A2A2A] px-8 py-4 font-medium text-[#2A2A2A] transition-colors hover:bg-[#2A2A2A] hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>

              {/* Removed text and Start New Purchase button */}
            </div>


          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F8F9FA] pt-16">
        <div className="container mx-auto max-w-6xl px-4 py-12 text-center">
          <div className="animate-pulse">
            <div className="mx-auto h-8 w-64 rounded bg-gray-200"></div>
            <div className="mx-auto mt-4 h-4 w-32 rounded bg-gray-200"></div>
            <div className="mx-auto mt-12 h-64 w-full max-w-md rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8F9FA] pt-16">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-[#2A2A2A]">Complete Your Payment</h1>
          <p className="mx-auto max-w-2xl text-[#2A2A2A]">You're just one step away from starting your fitness journey with our {planDetails.name} plan</p>
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
            <div className="h-1 w-24 bg-[#D5FC51]"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9D9D9] text-[#2A2A2A]">3</div>
              <span className="mt-2 text-sm text-[#2A2A2A]">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg border border-[#D9D9D9] bg-white p-8 shadow-md">
              <div className="mb-6 flex items-center">
                <div className="mr-3 rounded-full bg-[#D5FC51] p-2">
                  <CreditCardIcon className="h-5 w-5 text-[#2A2A2A]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A2A2A]">Payment Information</h3>
                  <p className="text-sm text-gray-600">Enter your card details securely</p>
                </div>
              </div>

              {clientSecret ? (
                <div>
                  <StripeElementsForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    billingDetails={{
                      name: formData ? `${formData.firstName} ${formData.lastName}` : '',
                      email: formData ? formData.email : '',
                      address: {
                        line1: formData ? formData.address : '',
                        city: formData ? formData.city : '',
                        postal_code: formData ? formData.zipCode : '',
                        country: formData ? (formData.country === 'United States' ? 'US' : formData.country) : 'US',
                      }
                    }}
                  />

                  {errors.payment && (
                    <div className="mt-3 flex items-center text-sm text-red-500">
                      <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                      {errors.payment}
                    </div>
                  )}

                  {/* Manual redirect button that appears after payment is processed */}
                  <div id="payment-success-actions" style={{ display: 'none' }} className="mt-6 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Payment successful!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Your payment has been processed successfully. Click the "View Invoice" button below when you're ready.</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const invoiceNumber = sessionStorage.getItem('invoiceNumber') || '';

                              // Create the redirect URL
                              const redirectUrl = `/membership/invoice?plan=${plan}&invoice=${invoiceNumber}`;

                              // Try multiple redirect methods
                              try {
                                // Method 1: Using window.location.replace (more reliable than href)
                                window.location.replace(redirectUrl);

                                // Method 2: As a fallback, also try setting href after a small delay
                                setTimeout(() => {
                                  window.location.href = redirectUrl;
                                }, 100);

                                // Method 3: Create and click a link as another fallback
                                const link = document.createElement('a');
                                link.href = redirectUrl;
                                link.target = '_self';
                                link.style.display = 'none';
                                document.body.appendChild(link);
                                link.click();
                              } catch (err) {
                                console.error('Error during manual redirect:', err);
                                alert('Redirect failed. Please go to the invoice page manually.');
                              }
                            }}
                            className="rounded-md bg-[#D5FC51] px-8 py-4 text-base font-medium text-[#2A2A2A] shadow-md hover:bg-[#c2e94a] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-offset-2"
                          >
                            View Invoice
                          </button>

                          {/* Removed Start New Purchase button */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[#D5FC51]"></div>
                  <span className="ml-2 text-[#2A2A2A]">Loading payment form...</span>
                </div>
              )}

              <div className="mt-6 border-t border-[#D9D9D9] pt-6">
                <Link
                  href={`/membership/checkout?plan=${plan}`}
                  className="text-sm font-medium text-[#2A2A2A] hover:text-[#D5FC51]"
                >
                  &larr; Back to checkout
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-bold text-[#2A2A2A]">Order Summary</h2>

              <div className="mb-4 rounded-md bg-[#F8F9FA] p-3">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-[#D5FC51] p-1.5">
                    <CheckIcon className="h-4 w-4 text-[#2A2A2A]" />
                  </div>
                  <span className="font-medium text-[#2A2A2A]">{planDetails.name} Membership</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">Monthly subscription</p>
              </div>

              <ul className="mb-6 space-y-2">
                {planDetails.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="mr-2 h-5 w-5 flex-shrink-0 text-[#D5FC51]" />
                    <span className="text-sm text-[#2A2A2A]">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 border-t border-[#D9D9D9] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#2A2A2A]">Subtotal</span>
                  <span className="font-medium text-[#2A2A2A]">${planDetails.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[#2A2A2A]">Tax</span>
                  <span className="font-medium text-[#2A2A2A]">$0.00</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#D9D9D9] pt-4 text-lg font-bold">
                  <span className="text-[#2A2A2A]">Total</span>
                  <span className="text-[#2A2A2A]">${planDetails.price}/month</span>
                </div>
              </div>

              <div className="rounded-md bg-[#F8F9FA] p-4 text-sm text-gray-600">
                <p>Your membership will be billed monthly and you can cancel anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
