{/* Logo replaces text heading */}
import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <div className="voidLogo" aria-label="Void Underground">
        <Image
          src="/logoVoid.png"
          alt="Void Underground logo"
          width={1800}
          height={400}
          priority
        />
      </div>

      {/* keep your subheadline and paragraph below exactly as they were */}
      {/* example:
      <h2 className="mt-6 text-3xl md:text-4xl font-semibold">
        Transform Your Charisma Through Action
      </h2>
      ... */}
    </section>
  );
}
