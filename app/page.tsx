export default function Page() {
  return (
    <main className="bg-[color:var(--void-black)] text-[color:var(--void-white)]">
      {/* Global color tokens and a few helpers */}
      <style jsx global>{`
        :root {
          --void-black: #000000;
          --void-depth: #1B1B1B;
          --void-white: #FFFFFF;
          --void-cyan:  #00FFFF;   /* Cyan Glow */
          --void-magenta:#FF00FF;  /* Magenta */
          --void-orange: #FA6400;  /* Warning energy */
          --void-neon:   #7FFF00;  /* Optional highlight */
          --void-lime:   #77FF00;  /* Aliveness rebellion */
        }
        .btn {
          border-radius: 1rem;
          padding: 0.9rem 2rem;
          font-weight: 700;
        }
        .btn-white {
          background: var(--void-white);
          color: var(--void-black);
        }
        .btn-cyan {
          background: var(--void-cyan);
          color: #001616;
        }
        .panel {
          border-radius: 1rem;
          border: 1px solid var(--void-depth);
          background: #000000;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Hero */}
      <section className="relative">
        {/* Thin accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[color:var(--void-cyan)] via-[color:var(--void-magenta)] to-[color:var(--void-orange)]" />

        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          {/* Eyebrow smaller than headline */}
          <p className="text-sm md:text-base tracking-wide text-neutral-300">
            Void Underground
          </p>

          {/* Main headline that now pops more */}
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">
            Transform Your Charisma Through Action
          </h1>

          {/* Support line */}
          <p className="mt-5 text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto">
            Join a community driven program with missions, tasks, and real world practice. Master the art of charisma through consistent action and learning.
          </p>

          {/* CTA that jumps to pricing section. No price in hero */}
          <div className="mt-10">
            <a href="#pricing" className="btn btn-white">Join the Void</a>
          </div>
        </div>
      </section>

      {/* Pricing below the fold */}
      <section id="pricing" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Pricing</h2>
        <p className="mt-3 text-neutral-300">Six month program</p>

        <div className="panel mt-10 inline-block p-8">
          <div className="text-5xl font-extrabold text-[color:var(--void-magenta)]">$297</div>
          <div className="mt-4 text-neutral-400 line-through">$600 value</div>
          <div className="mt-6 text-neutral-300">One-time payment</div>
          <div className="mt-8">
            <a href="#" className="btn btn-white">Join the Void</a>
          </div>
        </div>
      </section>
    </main>
  );
}
