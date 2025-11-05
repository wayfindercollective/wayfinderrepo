export function Pricing() {
  return (
    <section id="pricing" className="bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Pricing</h2>
        <p className="mt-4 text-neutral-300">Six month program</p>

        <div className="mt-10 inline-block rounded-2xl border border-neutral-800 p-8">
          <div className="text-5xl font-extrabold">$297</div>
          <p className="mt-2 text-sm text-neutral-400 line-through">$600 value</p>
          <p className="mt-1 text-violet-400 font-semibold">Fifty percent discount</p>

          <a href="/checkout" className="mt-6 inline-block rounded-2xl bg-white px-8 py-4 text-black font-semibold">
            Enroll Now
          </a>
        </div>
      </div>
    </section>
  );
}
