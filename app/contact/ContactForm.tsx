"use client";

import { useState } from "react";
import { Button } from "../_components/button";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | "sending" | "success" | "error">(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    if (!email || !subject || !message) {
      setErrorMessage("Please fill all required fields.");
      setStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to send message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-[#2A2A2A]">Get in Touch</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Your Name (optional):"
          value={name}
          setValue={setName}
          disabled={status === "sending"}
        />
        <InputField
          label="Your Email Address *:"
          type="email"
          required
          value={email}
          setValue={setEmail}
          disabled={status === "sending"}
        />
        <InputField
          label="Subject *:"
          required
          value={subject}
          setValue={setSubject}
          disabled={status === "sending"}
        />

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-[#2A2A2A]">
            Your Message *:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={status === "sending"}
            placeholder="Please describe your inquiry or feedback here..."
            rows={5}
            className="rounded-md border border-[#D9D9D9] px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          disabled={status === "sending"}
          className="mt-2 bg-[#D5FC51] text-[#2A2A2A] hover:bg-[#D5FC51]/80 disabled:opacity-70"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </Button>

        {status === "success" && (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            ✅ Thank you! Your message has been sent.
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            ❌ Error: {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
};

function InputField({
  label,
  value,
  setValue,
  type = "text",
  required = false,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-[#2A2A2A]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        disabled={disabled}
        className="rounded-md border border-[#D9D9D9] px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
      />
    </div>
  );
}
