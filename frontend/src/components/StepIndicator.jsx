import { MdBolt } from "react-icons/md";

const StepIndicator = ({ currentStep, totalSteps, title }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-900 text-sm font-semibold uppercase tracking-wider">
            Step {currentStep} of {totalSteps}
          </p>
          <h3>{title}</h3>
        </div>

        <p className="text-blue-600 text-sm font-bold">
          {percentage}% Complete
        </p>
      </div>
      <div className="rounded-full bg-slate-200 h-2 w-full overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <MdBolt />
        <p className="text-xs font-medium italic">
          Your progress is saved automatically
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
