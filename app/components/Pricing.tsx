import Price from "./Price";

export default function Pricing() {
  return (
    <div className="mt-12 md:mt-16 max-w-lg mx-auto text-center">
      {/* Branded price block: orange $297 + exploding "$600 value" */}
      <div className="mt-8">
        <Price />
      </div>
      <button
        className="ui inline-flex items-center justify-center rounded-2xl px-6 py-3 mt-10
                   bg-black text-white border border-white/10 shadow-md
                   transition duration-200 ease-out
                   hover:-translate-y-0.5 hover:shadow-xl hover:text-cyan-300
                   focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
      >
        Join the Void
      </button>
    </div>
  );
}
