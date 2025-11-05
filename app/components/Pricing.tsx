import Price from "./Price";
import SignalLogo from "./SignalLogo";

export default function Pricing() {
  return (
    <div className="mt-12 md:mt-16 max-w-lg mx-auto text-center">
      {/* Branded price block: orange $297 + exploding "$600 value" */}
      <div className="mt-8">
        <Price />
      </div>
      <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
        <a
          href="#enroll"
          className="btn-void"
        >
          Join the Void
        </a>
        <SignalLogo />
      </div>
    </div>
  );
}
