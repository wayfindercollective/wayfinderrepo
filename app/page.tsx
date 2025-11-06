import HeroLogo from "./components/HeroLogo";
import Starfield from "@/components/Starfield";
import Pricing from "./components/Pricing";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section - Black */}
      <section className="relative text-white overflow-hidden">
        <Starfield />
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/30 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <HeroLogo />

            {/* Your tagline and paragraph below the logo can remain */}
            <h2 className="h2-void -mt-8 text-center opacity-90">
              Transform Your <span className="emphasis-word">Charisma</span> Through <span className="emphasis-word">Action</span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto mt-2">
              Join a community driven program with missions, tasks, and real world practice.
              Master the art of charisma through consistent action and learning.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section - White */}
      <section className="voidSection voidNavy">
        <div className="voidContainer">
          <div className="sectionTitleWrapper">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleOrange">
              What You Get
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="cardVoid text-white p-8">
              <h3 className="text-xl font-bold mb-4">Community Missions</h3>
              <p className="text-gray-300">
                Engage with like-minded individuals through structured missions that push you out of your comfort zone and into real-world charisma practice.
              </p>
            </div>
            <div className="cardVoid text-white p-8">
              <h3 className="text-xl font-bold mb-4">Monthly Content</h3>
              <p className="text-gray-300">
                Access $50 worth of premium content each month, including strategies, techniques, and insights from Charisma in the Void.
              </p>
            </div>
            <div className="cardVoid text-white p-8">
              <h3 className="text-xl font-bold mb-4">Action-Oriented Tasks</h3>
              <p className="text-gray-300">
                Don't just learn—apply. Complete practical tasks designed to build your charisma through hands-on experience and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="voidSection voidNavy">
        <div className="voidContainer">
          <Pricing />
        </div>
      </section>

      {/* Program Details Section - Black */}
      <section className="voidSection voidDark">
        <div className="voidContainer">
          <div className="sectionTitleWrapper">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-white sectionTitle sectionTitleMagenta">
              The Program
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                  <span className="text-red-500">•</span>
                  Six Months of Content
                </h3>
                <p className="text-gray-300 text-lg">
                  Get access to 6 months of premium charisma coaching content, normally $50/month. 
                  This bundle represents $600 of value for just $297—a 50% discount.
                </p>
              </div>
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                  <span className="text-purple-500">•</span>
                  Community-Driven Learning
                </h3>
                <p className="text-gray-300 text-lg">
                  Join a vibrant community of individuals committed to improving their charisma. 
                  Share experiences, get feedback, and grow together.
                </p>
              </div>
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                  <span className="text-red-500">•</span>
                  Missions & Tasks
                </h3>
                <p className="text-gray-300 text-lg">
                  Participate in carefully designed missions and tasks that get you into action. 
                  Learning happens through doing, not just consuming content.
                </p>
              </div>
              <div className="cardVoid p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                  <span className="text-purple-500">•</span>
                  From Charisma in the Void
                </h3>
                <p className="text-gray-300 text-lg">
                  Created by the coach behind the popular YouTube channel "Charisma in the Void". 
                  Proven strategies and techniques that actually work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY VOID UNDERGROUND — second navy band */}
      <section className="voidSection voidNavy">
        <div className="voidContainer">
          <div className="text-center mb-16">
            <div className="sectionTitleWrapper">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleOrange">
                Why Void Underground?
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Most charisma programs focus on theory. We focus on action.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="cardVoid text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Action Over Theory</h3>
              <p className="text-gray-300">
                You won't just read about charisma—you'll practice it. Our missions and tasks 
                ensure you're actively developing your skills in real-world situations.
              </p>
            </div>
            <div className="cardVoid text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Community Support</h3>
              <p className="text-gray-300">
                Learn alongside others on the same journey. Share victories, get support during 
                challenges, and build lasting connections.
              </p>
            </div>
            <div className="cardVoid text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Proven Content</h3>
              <p className="text-gray-300">
                Based on the successful Charisma in the Void YouTube channel. These aren't 
                experimental ideas—they're tested strategies that deliver results.
              </p>
            </div>
            <div className="cardVoid text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Exceptional Value</h3>
              <p className="text-gray-300">
                $600 worth of premium content for just $297. That's 6 months of $50/month 
                programs bundled at a 50% discount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Black */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/30 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-16">
            <div className="sectionTitleWrapper">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white sectionTitle sectionTitleCyan">
                Investment
              </h2>
            </div>
            <p className="text-xl text-gray-300">
              One-time payment for 6 months of premium access
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white text-black p-12 rounded-lg text-center border-4 border-red-500/30">
              <div className="mb-8">
                <div className="text-6xl sm:text-7xl font-bold mb-2">$297</div>
                <div className="text-2xl text-gray-600 line-through mb-2">$600 value</div>
                <div className="text-lg text-purple-600 font-semibold">50% Discount</div>
              </div>
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>6 months of premium content</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Access to community missions</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Action-oriented tasks and exercises</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Community support and feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>From Charisma in the Void</span>
                </div>
              </div>
              <a
                id="enroll"
                href="#"
                className="inline-block bg-black text-white px-12 py-4 rounded-lg font-semibold text-xl hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                Join the Void - $297
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Black */}
      <footer className="bg-black text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Void Underground • From Charisma in the Void
            </p>
            <p className="text-sm text-gray-500">
              Transform your charisma through action, community, and proven strategies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
