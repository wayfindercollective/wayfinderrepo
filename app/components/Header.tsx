import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-white tracking-wider group-hover:text-gray-300 transition-colors">
              VOID
            </span>
          </Link>

          {/* Join the Void Button */}
          <a
            href="#enroll"
            className="inline-block bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Join the Void
          </a>
        </div>
      </div>
    </header>
  );
}
