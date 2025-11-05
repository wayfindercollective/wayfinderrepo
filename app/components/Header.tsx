import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Image
              src="/void-logo.svg"
              alt="Void Underground"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>
          
          {/* Join the Void button on the right */}
          <div>
            <a
              href="#enroll"
              className="inline-block bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Join the Void
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
