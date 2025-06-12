"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Inicializimi i Stripe me publishable key
const stripePromise = loadStripe(
  "pk_test_51RRbsi4Dw9UtbL2HmemN06ONzdm0bUd4NDke0bo6R8UKkHpcJvT5lidPyJSoETcx0MKUFT6nrsE9uNmIhBt3sXgA004ykASqJ2",
);

interface SimplePaymentProcessorProps {
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  plan: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (errorMessage: string) => void;
}

export default function SimplePaymentProcessor({
  amount,
  currency = "usd",
  customerName,
  customerEmail,
  plan,
  onSuccess,
  onError,
}: SimplePaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Krijimi i payment intent kur komponenti montohet
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsProcessing(true);

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            customerName,
            customerEmail,
            plan,
          }),
        });

        if (!response.ok) {
          throw new Error("Gabim në krijimin e payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);

        // Procesimi i pagesës me Stripe
        processPayment(data.clientSecret);
      } catch (error: any) {
        console.error("Gabim:", error);
        setIsProcessing(false); // Reset processing state on error
        onError(
          error.message || "Ndodhi një gabim gjatë procesimit të pagesës",
        );
      }
    };

    createPaymentIntent();
  }, [amount, currency, customerName, customerEmail, plan]);

  // Funksioni për procesimin e pagesës
  const processPayment = async (clientSecret: string) => {
    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe nuk u inicializua");
      }

      // Validate that card input elements exist
      const cardNumberElement = document.getElementById(
        "cardNumber",
      ) as HTMLInputElement;
      const expiryDateElement = document.getElementById(
        "expiryDate",
      ) as HTMLInputElement;
      const cvvElement = document.getElementById("cvv") as HTMLInputElement;

      if (!cardNumberElement || !expiryDateElement || !cvvElement) {
        throw new Error(
          "Të dhënat e kartës nuk janë të disponueshme. Ju lutemi plotësoni të gjitha fushat e kartës.",
        );
      }

      // Validate card inputs have values
      if (
        !cardNumberElement.value ||
        !expiryDateElement.value ||
        !cvvElement.value
      ) {
        throw new Error("Ju lutemi plotësoni të gjitha fushat e kartës.");
      }

      // Parse expiry date
      const expiryParts = expiryDateElement.value.split("/");
      if (expiryParts.length !== 2) {
        throw new Error("Formati i datës së skadimit duhet të jetë MM/YY");
      }

      const expMonth = parseInt(expiryParts[0]);
      const expYear = parseInt("20" + expiryParts[1]);

      if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
        throw new Error("Data e skadimit e kartës nuk është e vlefshme");
      }

      // Përdorimi i të dhënave të kartës nga forma juaj
      const cardElement = {
        number: cardNumberElement.value.replace(/\s/g, ""),
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvvElement.value,
      };

      // Konfirmimi i pagesës
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as any,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Gabim në procesimin e pagesës",
        );
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        onSuccess(result.paymentIntent.id);
      } else {
        throw new Error("Pagesa nuk u kompletua");
      }
    } catch (error: any) {
      console.error("Gabim në procesimin e pagesës:", error);
      onError(error.message || "Ndodhi një gabim gjatë procesimit të pagesës");
    } finally {
      setIsProcessing(false);
    }
  };

  return null; // Ky komponent nuk ka UI, vetëm logjikë
}
