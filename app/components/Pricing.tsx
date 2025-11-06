import Price from "./Price";

export default function Pricing() {
  return (
    <div className="mt-12 md:mt-16 max-w-lg mx-auto text-center">
      {/* Branded price block: orange $297 + exploding "$600 value" */}
      <div className="mt-8">
        <Price />
      </div>
      <a
        href="#enroll"
        className="btn-void mt-10"
      >
        Join the Void
      </a>
    </div>
  );
}
