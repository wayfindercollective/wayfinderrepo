import Price from "./Price";

export default function Pricing() {
  return (
    <div className="mt-16 max-w-lg mx-auto text-center">
      {/* Branded price block: orange $297 + exploding "$600 value" */}
      <div className="mt-8">
        <Price />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10" style={{ alignItems: 'center', alignContent: 'center' }}>
        <div className="btn-wrapper-float" style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}>
          <a
            id="pricing-enroll"
            href="https://bookmyeventnow.com/register?a=new&p=32"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-void mt-10 inline-block"
          >
            BUY NOW
          </a>
        </div>
      </div>
    </div>
  );
}
