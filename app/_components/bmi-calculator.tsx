"use client";

import { useState } from "react";
import {
  ArrowPathIcon,
  ScaleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function BMICalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters <= 0 || weightInKg <= 0) return;

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    // Determine BMI category
    if (bmiValue < 18.5) {
      setBmiCategory("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setBmiCategory("Normal weight");
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obesity");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setBmiCategory("");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
              gender === "male"
                ? "bg-[#2A2A2A] text-white"
                : "bg-[#D9D9D9] text-[#2A2A2A] hover:bg-[#D9D9D9]/80"
            }`}
            onClick={() => setGender("male")}
          >
            <UserIcon className="mr-2 inline-block h-5 w-5" /> Male
          </button>
          <button
            className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
              gender === "female"
                ? "bg-[#2A2A2A] text-white"
                : "bg-[#D9D9D9] text-[#2A2A2A] hover:bg-[#D9D9D9]/80"
            }`}
            onClick={() => setGender("female")}
          >
            <UserIcon className="mr-2 inline-block h-5 w-5" /> Female
          </button>
        </div>

        <div>
          <label
            htmlFor="height"
            className="mb-2 block text-sm font-medium text-[#2A2A2A]"
          >
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            placeholder="Enter your height in cm"
          />
        </div>

        <div>
          <label
            htmlFor="weight"
            className="mb-2 block text-sm font-medium text-[#2A2A2A]"
          >
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            placeholder="Enter your weight in kg"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={calculateBMI}
            className="flex-1 rounded-md bg-[#D5FC51] px-4 py-2 font-medium text-[#2A2A2A] transition-colors hover:opacity-90"
          >
            <ScaleIcon className="mr-2 inline-block h-5 w-5" /> Calculate BMI
          </button>
          <button
            onClick={resetCalculator}
            className="rounded-md border border-[#D9D9D9] bg-white px-4 py-2 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D9D9D9]/20"
          >
            <ArrowPathIcon className="mr-2 inline-block h-5 w-5" /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
        {bmi === null ? (
          <div className="text-center">
            <ScaleIcon className="mx-auto mb-4 h-16 w-16 text-[#D9D9D9]" />
            <h3 className="text-xl font-bold text-[#2A2A2A]">
              Your BMI Result
            </h3>
            <p className="mt-2 text-[#2A2A2A]">
              Fill in your details and click "Calculate BMI" to see your
              results.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#D5FC51]">
              <span className="text-4xl font-bold text-[#2A2A2A]">{bmi}</span>
            </div>
            <h3 className="text-xl font-bold text-[#2A2A2A]">{bmiCategory}</h3>
            <p className="mt-4 text-[#2A2A2A]">
              {bmiCategory === "Underweight"
                ? "You may need to gain some weight. Consult with our nutritionists."
                : bmiCategory === "Normal weight"
                  ? "Your BMI is within the healthy range. Keep it up!"
                  : bmiCategory === "Overweight"
                    ? "You may benefit from losing some weight. Check our fitness programs."
                    : "It's recommended to reduce your BMI. Our trainers can help you."}
            </p>
            <div className="mt-6 h-4 w-full rounded-full bg-[#D9D9D9]">
              <div
                className={`h-4 rounded-full ${
                  bmiCategory === "Underweight"
                    ? "w-1/4 bg-blue-500"
                    : bmiCategory === "Normal weight"
                      ? "w-2/4 bg-green-500"
                      : bmiCategory === "Overweight"
                        ? "w-3/4 bg-yellow-500"
                        : "w-full bg-red-500"
                }`}
              ></div>
            </div>
            <div className="mt-2 flex w-full justify-between text-xs text-[#2A2A2A]">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
