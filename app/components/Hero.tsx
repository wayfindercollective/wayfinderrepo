export default function Hero() {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        {/* Eyebrow */}
        <p className="text-sm md:text-base tracking-wide text-neutral-300">
          Void Underground
        </p>

        {/* Main headline */}
        <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">
          Transform Your <span className="emphasis-word">Charisma</span> Through <span className="emphasis-word">Action</span>
        </h1>

        {/* Support line */}
        <p className="mt-5 text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto">
          Join a community driven program with missions, tasks, and real world practice. Master the art of charisma through consistent action and learning.
        </p>

        {/* CTA that jumps to pricing section */}
        <div className="mt-10">
          <button
            className="ui inline-flex items-center justify-center rounded-2xl px-6 py-3
                       bg-black text-white border border-white/10 shadow-md
                       transition duration-200 ease-out
                       hover:-translate-y-0.5 hover:shadow-xl hover:text-cyan-300
                       focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          >
            Join the Void
          </button>
        </div>
      </div>
    </section>
  );
}
