"use client";

import { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RRbsi4Dw9UtbL2HmemN06ONzdm0bUd4NDke0bo6R8UKkHpcJvT5lidPyJSoETcx0MKUFT6nrsE9uNmIhBt3sXgA004ykASqJ2');

// Styles for Stripe Elements
const cardElementOptions = {
  style: {
    base: {
      color: '#2A2A2A',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface StripeFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
  billingDetails: {
    name: string;
    email: string;
    address: {
      line1: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
}

// The actual form component that uses Stripe Elements
const StripeForm = ({ clientSecret, onSuccess, onError, billingDetails }: StripeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | undefined>();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setProcessing(true);
    setError(undefined);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('Confirming payment with client secret:', clientSecret);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      console.log('Payment result:', { error, paymentIntent });

      if (error) {
        console.error('Payment error from Stripe:', error);
        throw new Error(error.message || 'An error occurred with your payment');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);

        // Call onSuccess callback
        onSuccess(paymentIntent.id);

        // No automatic redirect - user must click the button manually
        console.log('Payment successful. User can click the button to view invoice.');
      } else {
        console.error('Payment not succeeded:', paymentIntent);
        throw new Error('Payment failed or is still processing');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred with your payment');
      onError(err.message || 'An error occurred with your payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border border-[#D9D9D9] p-4">
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="mt-1 flex items-center text-sm text-red-500">
          <ExclamationCircleIcon className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mt-4">
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`flex w-full items-center justify-center rounded-md ${
            processing ? 'bg-gray-300' : 'bg-[#D5FC51]'
          } px-8 py-4 font-medium text-[#2A2A2A] shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-70`}
        >
          {processing ? (
            <>
              <svg className="mr-2 h-5 w-5 animate-spin text-[#2A2A2A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </>
          ) : (
            'Complete Purchase'
          )}
        </button>
      </div>

      {/* Processing payment message */}
      {processing && (
        <div className="mt-4 rounded-md bg-green-50 p-4 text-center">
          <p className="text-sm text-green-800">
            <span className="font-medium">Processing your payment...</span> Please wait while we complete your transaction.
          </p>
        </div>
      )}

      <div className="mt-2 text-center text-xs text-gray-500">
        <p>For testing, use card number 4242 4242 4242 4242, any future expiry date, and any 3-digit CVV.</p>
      </div>
    </form>
  );
};

// Wrapper component that provides the Stripe context
export default function StripeElementsForm({
  clientSecret,
  onSuccess,
  onError,
  billingDetails
}: StripeFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <StripeForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        billingDetails={billingDetails}
      />
    </Elements>
  );
}
