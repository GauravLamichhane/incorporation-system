import { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import StepIndicator from "./StepIndicator";
import { addShareholders } from "../api/companyAPI";
import { normalizeText, validateNameLike } from "../utils/validation";

const inputClass =
  "h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none transition w-full";
const inputErrorClass =
  "h-12 px-4 rounded-lg border border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition w-full";

const StepTwo = ({ company, onComplete, onPrevious }) => {
  const [shareholders, setShareholders] = useState(
    Array.from({ length: company.number_shareholders }, () => ({
      first_name: "",
      last_name: "",
      nationality: "",
    })),
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState("");

  const handleChange = (index, e) => {
    const updated = [...shareholders];
    updated[index][e.target.name] = e.target.value;
    setShareholders(updated);
    if (apiError) setApiError("");
    const updatedErrors = [...errors];
    if (updatedErrors[index]) {
      updatedErrors[index][e.target.name] = "";
      setErrors(updatedErrors);
    }
  };

  const validate = () => {
    const newErrors = shareholders.map((s) => {
      const err = {};
      const firstNameError = validateNameLike("First name", s.first_name, {
        minLength: 2,
      });
      if (firstNameError) err.first_name = firstNameError;
      const lastNameError = validateNameLike("Last name", s.last_name, {
        minLength: 2,
      });
      if (lastNameError) err.last_name = lastNameError;
      const nationalityError = validateNameLike("Nationality", s.nationality, {
        minLength: 2,
      });
      if (nationalityError) err.nationality = nationalityError;
      return err;
    });
    return newErrors.some((err) => Object.keys(err).length > 0)
      ? newErrors
      : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const payload = shareholders.map((s) => ({
        first_name: normalizeText(s.first_name),
        last_name: normalizeText(s.last_name),
        nationality: normalizeText(s.nationality),
      }));
      const response = await addShareholders(company.id, payload);
      localStorage.removeItem("company_id");
      localStorage.removeItem("company_data");
      onComplete(response.data);
    } catch (error) {
      console.error("Error adding shareholders:", error);
      const responseData = error?.response?.data;
      if (Array.isArray(responseData)) {
        const mapped = responseData.map((row) => {
          const err = {};
          if (row?.first_name?.[0]) err.first_name = String(row.first_name[0]);
          if (row?.last_name?.[0]) err.last_name = String(row.last_name[0]);
          if (row?.nationality?.[0])
            err.nationality = String(row.nationality[0]);
          return err;
        });
        setErrors(mapped);
      } else if (responseData && typeof responseData === "object") {
        setApiError(
          String(
            responseData.error ?? "Something went wrong. Please try again.",
          ),
        );
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <StepIndicator
        currentStep={2}
        totalSteps={2}
        title="Finalizing Incorporation: Shareholder Details"
      />
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Shareholder Information
        </h1>
        <p className="text-slate-500 mt-2">
          Enter details for all {company.number_shareholders} shareholders of{" "}
          <span className="font-semibold text-slate-900">
            {company.company_name}
          </span>
          .
        </p>
      </div>

      {apiError && (
        <p className="text-sm text-red-600 font-medium">{apiError}</p>
      )}

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {shareholders.map((shareholder, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <IoPerson className="text-blue-600 text-xl" />
              <h3 className="text-lg font-semibold text-slate-800">
                Shareholder {index + 1}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={shareholder.first_name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g. Gaurav"
                  className={
                    errors[index]?.first_name ? inputErrorClass : inputClass
                  }
                />
                {errors[index]?.first_name && (
                  <p className="text-xs text-red-500">
                    {errors[index].first_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={shareholder.last_name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g. Lamichhane"
                  className={
                    errors[index]?.last_name ? inputErrorClass : inputClass
                  }
                />
                {errors[index]?.last_name && (
                  <p className="text-xs text-red-500">
                    {errors[index].last_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={shareholder.nationality}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g. Nepali"
                  className={
                    errors[index]?.nationality ? inputErrorClass : inputClass
                  }
                />
                {errors[index]?.nationality && (
                  <p className="text-xs text-red-500">
                    {errors[index].nationality}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onPrevious}
            disabled={loading}
            className="flex items-center justify-center gap-1 h-12 px-6 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <MdKeyboardArrowLeft className="w-5 h-5 shrink-0" />
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1 h-12 px-8 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
            {!loading && <MdKeyboardArrowRight className="w-5 h-5 shrink-0" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepTwo;
