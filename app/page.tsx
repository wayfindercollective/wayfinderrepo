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
        .text-orange { color: var(--void-orange); }
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
          transition: all 0.2s;
        }
        .btn-white { background: var(--void-white); color: var(--void-black); }
        .btn-white:hover { background: #e5e5e5; }
        .btn-cyan { background: var(--void-cyan); color: #001616; }
        .btn-cyan:hover { background: #00e6e6; }
        .btn-black { background: var(--void-black); color: var(--void-white); border: 1px solid var(--void-depth); }
        .btn-black:hover { background: var(--void-depth); }
        .gradient-bar {
          height: 4px;
          width: 100%;
          background: linear-gradient(90deg, var(--void-cyan), var(--void-magenta), var(--void-orange));
        }
        .glow-cyan {
          box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
        }
        .glow-magenta {
          box-shadow: 0 0 40px rgba(255, 0, 255, 0.3);
        }
        .bg-glow-cyan {
          background: rgba(0, 255, 255, 0.3);
        }
        .bg-glow-cyan-light {
          background: rgba(0, 255, 255, 0.2);
        }
        .bg-glow-magenta {
          background: rgba(255, 0, 255, 0.3);
        }
        .bg-glow-magenta-light {
          background: rgba(255, 0, 255, 0.2);
        }
        .border-cyan-light {
          border-color: rgba(0, 255, 255, 0.3);
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Hero */}
      <section className="bg-void text-void relative overflow-hidden">
        <div className="gradient-bar" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-cyan blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-magenta blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <p className="text-sm md:text-base tracking-wide text-neutral-300 mb-6">
              Void Underground
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Transform Your Charisma Through Action
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              Join a community-driven program with missions, tasks, and real-world practice. 
              Master the art of charisma through consistent action and learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center sm:text-left">
                <div className="text-4xl sm:text-5xl font-bold text-magenta">$297</div>
                <div className="text-sm text-neutral-400 line-through">$600 value</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg font-semibold text-cyan">50% Discount</div>
                <div className="text-sm text-neutral-400">6-month program</div>
              </div>
            </div>
            <a
              href="#pricing"
              className="btn btn-white"
            >
              Join the Void
            </a>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="bg-white text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-cyan-light blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-magenta-light blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            What You Get
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="panel p-8">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Community Missions</h3>
              <p className="text-neutral-300">
                Engage with like-minded individuals through structured missions that push you out of your comfort zone and into real-world charisma practice.
              </p>
            </div>
            <div className="panel p-8">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-4">Monthly Content</h3>
              <p className="text-neutral-300">
                Access $50 worth of premium content each month, including strategies, techniques, and insights from Charisma in the Void.
              </p>
            </div>
            <div className="panel p-8">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-4">Action-Oriented Tasks</h3>
              <p className="text-neutral-300">
                Don't just learn—apply. Complete practical tasks designed to build your charisma through hands-on experience and feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details Section */}
      <section className="bg-void text-void relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-cyan blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-magenta blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            The Program
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="panel p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-cyan">•</span>
                  Six Months of Content
                </h3>
                <p className="text-neutral-300 text-lg">
                  Get access to 6 months of premium charisma coaching content, normally $50/month. 
                  This bundle represents $600 of value for just $297—a 50% discount.
                </p>
              </div>
              <div className="panel p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-magenta">•</span>
                  Community-Driven Learning
                </h3>
                <p className="text-neutral-300 text-lg">
                  Join a vibrant community of individuals committed to improving their charisma. 
                  Share experiences, get feedback, and grow together.
                </p>
              </div>
              <div className="panel p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-cyan">•</span>
                  Missions & Tasks
                </h3>
                <p className="text-neutral-300 text-lg">
                  Participate in carefully designed missions and tasks that get you into action. 
                  Learning happens through doing, not just consuming content.
                </p>
              </div>
              <div className="panel p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-magenta">•</span>
                  From Charisma in the Void
                </h3>
                <p className="text-neutral-300 text-lg">
                  Created by the coach behind the popular YouTube channel "Charisma in the Void". 
                  Proven strategies and techniques that actually work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-white text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-cyan-light blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-magenta-light blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Why Void Underground?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most charisma programs focus on theory. We focus on action.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="panel p-8">
              <h3 className="text-2xl font-bold mb-4">Action Over Theory</h3>
              <p className="text-neutral-300">
                You won't just read about charisma—you'll practice it. Our missions and tasks 
                ensure you're actively developing your skills in real-world situations.
              </p>
            </div>
            <div className="panel p-8">
              <h3 className="text-2xl font-bold mb-4">Community Support</h3>
              <p className="text-neutral-300">
                Learn alongside others on the same journey. Share victories, get support during 
                challenges, and build lasting connections.
              </p>
            </div>
            <div className="panel p-8">
              <h3 className="text-2xl font-bold mb-4">Proven Content</h3>
              <p className="text-neutral-300">
                Based on the successful Charisma in the Void YouTube channel. These aren't 
                experimental ideas—they're tested strategies that deliver results.
              </p>
            </div>
            <div className="panel p-8">
              <h3 className="text-2xl font-bold mb-4">Exceptional Value</h3>
              <p className="text-neutral-300">
                $600 worth of premium content for just $297. That's 6 months of $50/month 
                programs bundled at a 50% discount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-void text-void relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-cyan blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-magenta blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Investment
            </h2>
            <p className="text-xl text-neutral-300">
              One-time payment for 6 months of premium access
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="panel p-12 text-center border-2 border-cyan-light">
              <div className="mb-8">
                <div className="text-6xl sm:text-7xl font-bold mb-2 text-magenta">$297</div>
                <div className="text-2xl text-neutral-400 line-through mb-2">$600 value</div>
                <div className="text-lg text-cyan font-semibold">50% Discount</div>
              </div>
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-cyan text-xl">✓</span>
                  <span>6 months of premium content</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan text-xl">✓</span>
                  <span>Access to community missions</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan text-xl">✓</span>
                  <span>Action-oriented tasks and exercises</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan text-xl">✓</span>
                  <span>Community support and feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan text-xl">✓</span>
                  <span>From Charisma in the Void</span>
                </div>
              </div>
              <a
                href="/checkout"
                className="btn btn-cyan"
              >
                Join the Void - $297
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-glow-cyan-light blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-glow-magenta-light blur-3xl"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your Charisma?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join Void Underground today and start your journey toward authentic, 
              magnetic charisma. Take action, not just notes.
            </p>
            <a
              href="#pricing"
              className="btn btn-black mb-8"
            >
              Join the Void - $297
            </a>
            <div className="text-sm text-gray-500">
              <p>6-month program • $600 value • One-time payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-void text-void border-t border-depth">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-neutral-400 mb-4">
              Void Underground • From Charisma in the Void
            </p>
            <p className="text-sm text-neutral-500">
              Transform your charisma through action, community, and proven strategies.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
