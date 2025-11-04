export default function Page() {
  return (
    <main className="bg-black text-white">
      {/* Global CSS tokens and simple helpers (no styled-jsx) */}
      <style>{`
        :root {
          --void-black: #000000;
          --void-depth: #1B1B1B;
          --void-white: #FFFFFF;
          --void-cyan:  #00FFFF;  /* Cyan Glow */
          --void-magenta:#FF00FF; /* Magenta */
          --void-orange: #FA6400; /* Warning / energy */
          --void-neon:   #7FFF00; /* Optional highlight */
          --void-lime:   #77FF00; /* Aliveness / rebellion */
        }
        /* helpers */
        .bg-void { background: var(--void-black); }
        .text-void { color: var(--void-white); }
        .text-cyan { color: var(--void-cyan); }
        .text-magenta { color: var(--void-magenta); }
        .border-depth { border-color: var(--void-depth); }
        .panel {
          border: 1px solid var(--void-depth);
          background: var(--void-black);
          border-radius: 1rem;
        }
        .btn {
          border-radius: 1rem;
          padding: 0.9rem 2rem;
          font-weight: 700;
          display: inline-block;
        }
        .btn-white { background: var(--void-white); color: var(--void-black); }
        .btn-cyan  { background: var(--void-cyan); color: #001616; }
        .gradient-bar {
          height: 4px;
          width: 100%;
          background: linear-gradient(90deg, var(--void-cyan), var(--void-magenta), var(--void-orange));
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Hero */}
      <section className="bg-void text-void">
        <div className="gradient-bar" />
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          {/* Eyebrow */}
          <p className="text-sm md:text-base tracking-wide text-neutral-300">
            Void Underground
          </p>

          {/* Main headline (bigger than eyebrow) */}
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">
            Transform Your Charisma Through Action
          </h1>

          {/* Support line */}
          <p className="mt-5 text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto">
            Join a community driven program with missions, tasks, and real world practice. Master the art of charisma through consistent action and learning.
          </p>

          {/* CTA that jumps to pricing (no price here) */}
          <div className="mt-10">
            <a href="#pricing" className="btn btn-white">Join the Void</a>
          </div>
        </div>
      </section>

      {/* Pricing below the fold */}
      <section id="pricing" className="bg-void text-void">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Pricing</h2>
          <p className="mt-3 text-neutral-300">Six month program</p>

          <div className="panel mt-10 inline-block p-8">
            <div className="text-5xl font-extrabold text-magenta">$297</div>
            <p className="mt-2 text-sm text-neutral-400 line-through">$600 value</p>
            <p className="mt-1 font-semibold text-cyan">Fifty percent discount</p>

            <a href="/checkout" className="mt-6 btn btn-cyan">
              Join the Void
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
