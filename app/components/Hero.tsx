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
          <a href="#pricing" className="inline-block rounded-2xl bg-white px-8 py-4 text-black font-semibold">
            Join the Void
          </a>
        </div>
      </div>
    </section>
  );
}
