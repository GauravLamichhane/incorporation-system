import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";

function App() {
  const [company, setCompany] = useState(() => {
    try {
      const stored = localStorage.getItem("company_data");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [step, setStep] = useState(() => {
    return localStorage.getItem("company_id") ? 2 : 1;
  });

  const handleStepOneComplete = (savedCompany) => {
    setCompany(savedCompany);
    setStep(2);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {step === 1 && (
          <StepOne company={company} onComplete={handleStepOneComplete} />
        )}
        {step === 2 && (
          <StepTwo
            company={company}
            onComplete={(data) => {
              setCompany(null);
              setStep(3);
            }}
            onPrevious={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Incorporation Submitted!
            </h2>
            <p className="text-slate-500">
              Your company has been successfully incorporated.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setCompany(null);
              }}
              className="mt-4 px-6 h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Start New Incorporation
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
