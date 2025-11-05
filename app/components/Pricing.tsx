import Price from "./Price";

export default function Pricing() {
  return (
    <div className="mt-12 md:mt-16 max-w-lg mx-auto text-center">
      {/* Branded price block: orange $297 + exploding "$600 value" */}
      <div className="mt-8">
        <Price />
      </div>
      <div className="flex items-center justify-center gap-4 mt-10">
        <img 
          src="/Master_Logo.jpg" 
          alt="Void Logo" 
          className="logo-no-bg h-12 w-auto"
        />
        <a
          href="#enroll"
          className="btn-void"
        >
          Join the Void
        </a>
      </div>
    </div>
  );
}
