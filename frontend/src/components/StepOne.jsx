import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { createCompany, updateCompany } from "../api/companyAPI";
import StepIndicator from "./StepIndicator";
import {
  normalizeText,
  parsePositiveInt,
  parsePositiveNumber,
  validateNameLike,
} from "../utils/validation";

const inputClass =
  "h-12 px-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none transition w-full";
const inputErrorClass =
  "h-12 px-4 rounded-lg border border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition w-full";

const StepOne = ({ company, onComplete }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    number_shareholders: "",
    total_capital_invested: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!company) return;
    setFormData({
      company_name: company.company_name ?? "",
      number_shareholders: String(company.number_shareholders ?? ""),
      total_capital_invested: String(company.total_capital_invested ?? ""),
    });
  }, [company]);

  const validate = () => {
    const newErrors = {};
    const nameError = validateNameLike("Company name", formData.company_name, {
      minLength: 2,
    });
    if (nameError) newErrors.company_name = nameError;

    const shareholdersParsed = parsePositiveInt(formData.number_shareholders);
    if (shareholdersParsed.error)
      newErrors.number_shareholders = shareholdersParsed.error;

    const capitalParsed = parsePositiveNumber(formData.total_capital_invested);
    if (capitalParsed.error)
      newErrors.total_capital_invested = capitalParsed.error;

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const shareholdersParsed = parsePositiveInt(formData.number_shareholders);
      const capitalParsed = parsePositiveNumber(
        formData.total_capital_invested,
      );

      const payload = {
        company_name: normalizeText(formData.company_name),
        number_shareholders: shareholdersParsed.value,
        total_capital_invested: capitalParsed.value,
      };

      const response = company?.id
        ? await updateCompany(company.id, payload)
        : await createCompany(payload);
      const savedCompany = response.data;

      localStorage.setItem("company_id", savedCompany.id);
      localStorage.setItem("company_data", JSON.stringify(savedCompany));

      onComplete(savedCompany);
    } catch (error) {
      console.error("Error saving company:", error);
      const responseData = error?.response?.data;
      if (responseData && typeof responseData === "object") {
        const mappedErrors = Object.fromEntries(
          Object.entries(responseData).map(([key, value]) => [
            key,
            Array.isArray(value) ? String(value[0]) : String(value),
          ]),
        );
        setErrors(mappedErrors);
      } else {
        setErrors({ api: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <StepIndicator currentStep={1} totalSteps={2} title="Basic Information" />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Company Information
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide basic company details to begin incorporation.
        </p>
      </div>

      {errors.api && (
        <p className="mt-3 text-sm text-red-600 font-medium">{errors.api}</p>
      )}

      <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="e.g. Acme Global Solutions Ltd."
            className={errors.company_name ? inputErrorClass : inputClass}
          />
          {errors.company_name && (
            <p className="text-xs text-red-500">{errors.company_name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Number of Shareholders
            </label>
            <input
              type="number"
              name="number_shareholders"
              value={formData.number_shareholders}
              onChange={handleChange}
              min="1"
              placeholder="1"
              className={
                errors.number_shareholders ? inputErrorClass : inputClass
              }
            />
            {errors.number_shareholders && (
              <p className="text-xs text-red-500">
                {errors.number_shareholders}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Total Capital Invested
            </label>
            <input
              type="number"
              name="total_capital_invested"
              value={formData.total_capital_invested}
              onChange={handleChange}
              placeholder="10000"
              min="0"
              step="0.01"
              className={
                errors.total_capital_invested ? inputErrorClass : inputClass
              }
            />
            {errors.total_capital_invested && (
              <p className="text-xs text-red-500">
                {errors.total_capital_invested}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1 px-6 h-12 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Next"}
            {!loading && <MdKeyboardArrowRight className="w-5 h-5 shrink-0" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepOne;
