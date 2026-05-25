"use client";
import { useState } from "react";
import Head from "next/head";

const Stepper = ({ currentStep, steps }: any) => {
  return (
    <div className="w-full mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step: any, index: number) => (
          <li
            key={index}
            className={`relative  flex items-center text-center ${
              index === 2 ? "" : "flex-1"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  currentStep >= index + 1
                    ? "bg-[#4ABD86] text-white"
                    : "bg-gray-200 text-gray-500"
                } transition-colors duration-300`}
              >
                {currentStep > index + 1 ? (
                  // Completed step icon (checkmark)
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : // Step-specific icon or number
                currentStep >= index + 1 ? (
                  step.icon
                ) : (
                  <span className="text-lg font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= index + 1 ? "text-[#4ABD86]" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connecting line (except for the last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-300 ml-2 mr-2">
                <div
                  className={`h-0.5 ${
                    currentStep > index + 1 ? "bg-[#4ABD86]" : "bg-gray-300"
                  } transition-all duration-300`}
                  style={{ width: currentStep > index + 1 ? "100%" : "0%" }}
                ></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
export default Stepper;
