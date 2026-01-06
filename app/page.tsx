"use client";

import { useEffect } from "react";
import Script from "next/script";
import Image from "next/image";
import EmbeddedCheckoutSection from "@/components/EmbeddedCheckout";

export default function LandingPage() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const header = document.querySelector("#header");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const top =
          targetEl.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          8;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });
    };
  }, []);

  useEffect(() => {
    // Video autoplay and unmute logic
    const video = document.getElementById(
      "autoscroll-video"
    ) as HTMLVideoElement;
    const overlay = document.getElementById("video-overlay");
    if (!video || !overlay) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => {
            console.error("Autoplay failed:", error);
          });
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    observer.observe(video);

    const handleOverlayClick = () => {
      if (video.muted) {
        video.muted = false;
        overlay.classList.add("opacity-0", "pointer-events-none");
      }
    };

    const handlePlay = () => {
      if (!video.muted) {
        overlay.classList.add("opacity-0", "pointer-events-none");
      }
    };

    const handlePause = () => {
      if (video.muted) {
        overlay.classList.remove("opacity-0", "pointer-events-none");
      }
    };

    overlay.addEventListener("click", handleOverlayClick);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      observer.disconnect();
      overlay.removeEventListener("click", handleOverlayClick);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    // Bottom video autoplay with sound when 10% visible
    const video = document.getElementById("bottom-video") as HTMLVideoElement;
    if (!video) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.muted = false;
          video.play().catch(() => {
            // Fallback: play muted if autoplay with sound is blocked by browser
            video.muted = true;
            video.play().catch(() => {});
          });
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-page bg-ivory text-charcoal font-sans antialiased">
      {/* FontAwesome Script */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
        strategy="afterInteractive"
      />
      {/* Stripe Buy Button Script */}
      <Script
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
      />

      <header
        id="header"
        className="w-full py-3 px-3 md:py-6 md:px-8 lg:px-16 flex justify-between items-center bg-ivory/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <h1 className="text-base sm:text-xl md:text-2xl font-serif font-semibold text-charcoal whitespace-nowrap">
          Succession Story
        </h1>
        <div className="flex items-center gap-1 sm:gap-3">
          <a
            href="/login"
            className="text-charcoal font-sans text-[10px] sm:text-xs md:text-sm font-medium px-2 sm:px-4 md:px-6 py-2 md:py-3 hover:text-charcoal/70 transition-colors duration-300 whitespace-nowrap"
          >
            Login
          </a>
          <a
            href="#founder-offer"
            className="bg-charcoal text-ivory font-sans text-[10px] sm:text-xs md:text-sm font-medium px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-opacity-90 transition-colors duration-300 whitespace-nowrap"
          >
            Write My Story
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="hero"
          className="relative min-h-[600px] md:h-[720px] text-center flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
        >
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/Hero Background.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />

          <div id="hero-content" className="relative z-10 max-w-4xl mx-auto">
            <h1
              id="i7zf4"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium text-gray-400 leading-tight"
            >
              Your Will explains the&nbsp;<i id="i4nbr">What</i>.<br />
            </h1>
            <h1
              id="ixvq04"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium text-white leading-tight mt-2"
            >
              Your Succession Story explains the <i id="iuf45e">Why</i>.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-white/90">
              A priceless companion to your will or trust. Create a legacy
              letter to tell your family what they need to hear when you&apos;re
              not here to answer their questions. We write your heartfelt
              message in minutes, in your voice.
            </p>
            <a
              href="#founder-offer"
              className="inline-block bg-white text-gray-900 font-sans font-medium mt-10 px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105"
            >
              Create My Succession Story Now
            </a>
          </div>
        </section>

        {/* Why it Matters Section */}
        <section id="why-it-matters" className="py-16 md:py-24 bg-white">
          <div
            id="why-it-matters-content"
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
              Why it Matters
            </h2>
            <h3 className="mt-4 font-serif text-xl md:text-2xl lg:text-3xl text-charcoal/70">
              Your Wealth Has a Story. It&apos;s Time to Tell It.
            </h3>
            <p
              id="ioduf"
              className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed max-w-3xl mx-auto"
            >
              You&apos;ve built an incredible legacy. <br />
              But your family may not always know <u>why</u> you made the
              choices you did.
              <br />
              <br />
              What shaped you. What you learned.
              <br />
              <br />
              Succession Story is <i>your </i>story. <br />
              Share your wisdom, your values, and the love behind your
              decisions.&nbsp;
            </p>
          </div>
        </section>

        {/* Embedded Checkout Section */}
        <EmbeddedCheckoutSection />

        {/* The Missing Piece Section */}
        <section id="the-missing-piece" className="py-16 md:py-24 bg-ivory">
          <div
            id="the-missing-piece-content"
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4"
          >
            <div className="h-64 md:h-96 overflow-hidden rounded-lg relative">
              <Image
                src="/missing_piece.jpg"
                alt="A closed, elegant leather-bound notebook resting on a polished wooden desk, with soft, natural light coming from a window. Minimalist, luxury aesthetic."
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
                The Missing Piece
              </h2>
              <h3 className="mt-4 font-serif text-xl md:text-2xl lg:text-3xl text-charcoal/70">
                Most families struggle with the silence that follows a loss.
              </h3>
              <p
                id="imbei"
                className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed"
              >
                Wills say <i>what </i>happens. They rarely explain
                <i> why</i>.<br />
                <br />
                That silence leaves room for hurt, confusion, and assumptions,
                even in loving families.&nbsp;
                <br />
                <br />
                Avoid the misunderstanding.
              </p>
            </div>
          </div>
        </section>

        {/* Simple Solution Section */}
        <section id="simple-solution" className="py-16 md:py-24 bg-white">
          <div
            id="simple-solution-content"
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
              A Simple Solution
            </h2>
            <h3 className="mt-4 font-serif text-xl md:text-2xl lg:text-3xl text-charcoal/70">
              Let Your Story Outlive You
            </h3>
            <p
              id="iwo5l"
              className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed max-w-3xl mx-auto"
            >
              Succession Story is a simple, guided digital tool that helps you
              write a personal letter to accompany your formal estate plan.{" "}
              <br />
              <br />
              It&apos;s not a legal document—it&apos;s an emotional one. <br />
              <br />
              In less than an hour, our thoughtful prompts will help you
              articulate the &quot;why&quot; behind your decisions, share
              cherished memories, and offer guidance for the future.
            </p>
            <a
              href="#founder-offer"
              className="mt-10 inline-block bg-charcoal text-ivory font-sans font-medium px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105"
            >
              Tell My Story
            </a>
          </div>
        </section>

        {/* Imagine This Section */}
        <section id="imagine-this" className="py-16 md:py-24 bg-ivory">
          <div
            id="imagine-this-content"
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
              Imagine This
            </h2>
            <h3 className="mt-4 font-serif text-xl md:text-2xl lg:text-3xl text-charcoal/70">
              A message they will return to again and again.
            </h3>
            <p className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed max-w-3xl mx-auto">
              In a very difficult time, having just lost you. They open a letter
              written in your <br /> voice. They hear your values. They feel
              your love. They understand your intentions. They know the story
              behind your decisions. They feel connected to the meaning behind
              your legacy.
              <br />
              <br />
              <span className="font-semibold">
                No confusion. No unspoken words. <br /> <br /> Just clarity.
                Peace. <br /> <br /> Your story, lasting forever.
              </span>
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white">
          <div id="how-it-works-content" className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
                How It Works
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="space-y-8 md:space-y-10">
                <div id="step-1" className="flex items-start">
                  <div className="text-3xl md:text-4xl font-serif text-taupe mr-4 md:mr-6">
                    1.
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-charcoal">
                      Answer a Few Thoughtful Questions
                    </h4>
                    <p className="mt-2 text-sm md:text-base text-charcoal/80">
                      Our guided tool gently walks you through a simple
                      questionnaire. No writing skills needed. You just choose
                      from curated options and share short reflections about
                      your life, values, and intentions.
                    </p>
                  </div>
                </div>
                <div id="step-2" className="flex items-start">
                  <div className="text-3xl md:text-4xl font-serif text-taupe mr-4 md:mr-6">
                    2.
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-charcoal">
                      Perfect Your Tone
                    </h4>
                    <p className="mt-2 text-sm md:text-base text-charcoal/80">
                      We take your answers and shape them into a beautifully
                      written message that sounds like you. You can adjust the
                      tone or wording with ease, so your succession story feels
                      honest, warm, and true to your voice.
                    </p>
                  </div>
                </div>
                <div id="step-3" className="flex items-start">
                  <div className="text-3xl md:text-4xl font-serif text-taupe mr-4 md:mr-6">
                    3.
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold text-charcoal">
                      Share or Save Your Story
                    </h4>
                    <p className="mt-2 text-sm md:text-base text-charcoal/80">
                      Receive a polished, printable PDF that is ready to share
                      immediately or store with your estate documents. Your
                      message becomes a lasting source of clarity and comfort
                      when it is needed most.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="video-placeholder-container"
                className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mt-8 md:mt-0 relative overflow-hidden"
              >
                <video
                  id="autoscroll-video"
                  src="/video.mp4"
                  className="absolute inset-0 w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  controls
                />
                <div
                  id="video-overlay"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-500"
                >
                  <i className="fa-solid fa-volume-xmark text-ivory text-5xl md:text-6xl"></i>
                  <p className="mt-4 text-sm md:text-base text-ivory font-medium">
                    Click to Play Sound
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Most Important Words Section */}
        <section
          id="most-important-words"
          className="py-16 md:py-24 bg-taupe text-center text-black"
          style={{
            backgroundImage: "url('/bg-most_important.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <div
            id="most-important-words-content"
            className="max-w-3xl mx-auto px-4"
          >
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-snug">
              The Most Important Words are Often the Ones We Put Off.
            </h2>
            <p
              id="ixmkx4"
              className="mt-6 text-base leading-[2.5] md:text-lg opacity-90"
            >
              You don&apos;t need the perfect moment or the perfect draft.{" "}
              <br /> <br />
              You simply need a guided way to begin. This tool helps you finish
              something deeply meaningful, quickly and easily.
            </p>
          </div>
          <a
            href="#founder-offer"
            className="mt-10 inline-block bg-ivory text-charcoal font-sans font-medium px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-taupe transition-colors duration-300 transform hover:scale-105"
          >
            Start My Succession Story Now!
          </a>
        </section>

        {/* What This Gives You Section */}
        <section id="what-this-gives-you" className="py-16 md:py-24 bg-ivory">
          <div
            id="what-this-gives-you-content"
            className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4"
          >
            <div className="text-left order-2 md:order-1">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
                What This Gives You
              </h2>
              <ul className="mt-8 space-y-3 md:space-y-4 text-base md:text-lg text-charcoal/80">
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-taupe mr-3 md:mr-4 mt-1.5"></i>
                  A sense of completion
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-taupe mr-3 md:mr-4 mt-1.5"></i>
                  A feeling of peace and emotional order
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-taupe mr-3 md:mr-4 mt-1.5"></i>
                  Confidence that your family will understand your intentions
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-taupe mr-3 md:mr-4 mt-1.5"></i>
                  A way to share your wisdom while it can still guide them
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-taupe mr-3 md:mr-4 mt-1.5"></i>
                  A legacy that feels personal, not transactional
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-taupe mr-3 md:mr-4 mt-1.5"></i>
                  The comfort of knowing the most important message will be
                  delivered
                </li>
              </ul>
            </div>
            <div className="h-64 md:h-96 overflow-hidden rounded-lg order-1 md:order-2 relative">
              <Image
                src="/gives_you.jpg"
                alt="A minimalist wall clock with a simple design against a softly lit neutral wall, evoking a sense of timelessness and calm. Luxury aesthetic."
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Wealth to Meaning Section */}
        <section id="wealth-to-meaning" className="py-16 md:py-24 bg-white">
          <div
            id="wealth-to-meaning-content"
            className="max-w-4xl mx-auto px-4"
          >
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
                The Shift From Wealth to <br className="hidden md:block" />
                Meaningful Wealth
              </h2>
            </div>
            <div className="mt-12 text-base md:text-lg text-charcoal/80 leading-relaxed space-y-6 text-center">
              <p id="ibuq8l">
                Even though you&apos;ve worked with your attorneys and advisors
                to complete your trust or estate plan, you may feel that
                something is missing.
              </p>
              <p id="i8mphk">
                You&apos;ve done the responsible work that any successful person
                is expected to do. But even with all of that in place, you might
                wonder,
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4 italic text-charcoal/70 text-sm md:text-base">
                <li>
                  How long will my business run with my values after I&apos;m
                  gone?
                </li>
                <li id="ibqfa5">
                  Will my children question or argue about what I leave behind?
                </li>
                <li>
                  Will they sell the home I built with my own hands, just to
                  divide the money?
                </li>
                <li>
                  Who will tell them the story of my life if I don&apos;t?
                </li>
                <li>Will they know why I worked so hard?</li>
              </ul>
              <p id="iab4qi">
                As you create your Succession Story, you begin to organize the
                emotional and intellectual part of your legacy that has lived
                inside you for years.
              </p>
              <p id="i08rma" className="font-semibold">
                Once you&apos;re done, you&apos;ll feel heard.
                <br /> You&apos;ll feel understood.
                <br /> You&apos;ll have peace of mind.
                <br /> You&apos;ll feel confident that your family will carry
                forward the wisdom behind your success, not just the assets that
                came from it. At least, they&apos;ll know that&apos;s what you
                want.
              </p>
              <p className="text-center pt-6 font-serif text-xl md:text-2xl text-charcoal">
                <u>Level up</u> your estate plan. <br />
                <br />
                Don&apos;t make the mistake of stopping at the paperwork.
              </p>
              <a
                href="#founder-offer"
                className="mt-10 inline-block text-center bg-charcoal text-ivory font-sans font-medium px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-opacity-90 transition-transform duration-300 transform hover:scale-105"
              >
                Write My Legacy For Me
              </a>
            </div>
          </div>
        </section>

        {/* Founder Note Section */}
        <section id="founder-note" className="py-16 md:py-24 bg-ivory">
          <div
            id="founder-note-content"
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-12 px-4"
          >
            <div className="w-full md:w-64 lg:w-80 h-auto flex-shrink-0 rounded-lg shadow-lg overflow-hidden relative aspect-[3/4]">
              <Image
                src="/founder.jpg"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
                A Note from the Founder
              </h2>
              <p className="mt-4 text-base md:text-lg text-charcoal/80 leading-relaxed italic">
                &quot;As a succession attorney for high net worth individuals,
                I&apos;ve seen countless families navigate the complexities of
                inheritance. The sentiment that comes up from families who have
                lost loved ones is, &quot;I wish I could ask them what they
                meant.&quot;
                <br />
                <br /> I&apos;ve heard it from children trying to understand a
                parent&apos;s decisions, from spouses seeking clarity, and from
                entire families looking for direction that no document could
                provide. <br /> <br /> A will explains distribution. A trust
                outlines structure. But neither can speak for the person who is
                gone.
                <br /> <br /> I created Succession Story because I have seen
                firsthand how deeply families long for the words that were never
                written. I wanted to give people the chance to leave the message
                they wish they had received from those before them.
                <br />
                <br />I am not just a lawyer. I am a daughter, a granddaughter,
                a wife, and a mother. In each of these roles, the meaning of
                &quot;legacy&quot; and &quot;generational wealth&quot; has grown
                clearer to me.
                <br /> <br /> Wealth alone does not hold a family together.
                Clarity does. Connection does. The &quot;why&quot; behind our
                decisions does.
                <br /> <br /> I encourage every client I work with to share
                their intentions now, while they can.
                <br />
                <br />
                Start your Succession Story, now. We&apos;ll write it for you.
                You can be done with it today, and your family will feel the
                impact for generations. That&apos;s true generational wealth.
                <br /> <br /> Romy Frazier, Esq.
              </p>
            </div>
          </div>
        </section>

        {/* Don't Wait Section */}
        <section
          id="dont-wait-2"
          className="py-16 md:py-24 bg-charcoal text-ivory text-center"
        >
          <div id="dont-wait-content-2" className="max-w-3xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Don&apos;t Wait Until it&apos;s Too Late
            </h2>
            <p className="mt-6 text-base md:text-lg opacity-90 leading-relaxed">
              There are conversations we imagine we will have someday. Messages
              we think we will write when life slows down. Things we want our
              family to know, assuming there will always be time. <br /> <br />
              But life does not follow our plans. <br /> <br />
              The moments we intend to create can slip quietly into the
              background. And the words we mean to say can remain unsaid
              forever.
            </p>
            <p className="mt-8 font-semibold text-lg md:text-xl">
              Don&apos;t wait for the perfect moment.
              <br /> <br />
              Don&apos;t wait for more time.
              <br /> <br />
              Don&apos;t wait until your family is left wishing they could ask
              just one more question.
            </p>
            <p className="mt-8 text-lg md:text-xl opacity-90">
              Give them the clarity they will need. <br /> <br />
              Give yourself the peace you deserve.
              <br /> <br /> Start now.
            </p>
            <a
              href="#founder-offer"
              className="mt-10 inline-block bg-ivory text-charcoal font-sans font-medium px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg hover:bg-taupe transition-colors duration-300 transform hover:scale-105"
            >
              Create My Succession Story Now
            </a>
          </div>
        </section>

        {/* Legacy for All Section */}
        <section id="legacy-for-all" className="py-16 md:py-24 bg-taupe/30">
          <div
            id="legacy-for-all-content"
            className="max-w-6xl mx-auto text-center px-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal mb-12 md:mb-16">
              Succession Stories ... Shared
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/b6928b1ff3-5f14b58975b1d2ee8653.png"
                  alt="handwritten letter excerpt on cream paper showing personal message about family values and business legacy, elegant script font, warm lighting"
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-4 blur-[1.5px]"
                />
                <p className="text-xs md:text-sm text-charcoal/70 italic">
                  &quot;To my children: The business was never about the money.
                  Sure, money is the way we measure. But, the main goal was to
                  employ people. It was about creating work that people could
                  count on, year after year. What meant the most to me was
                  knowing that families relied on us, that we were part of their
                  stability. That responsibility shaped every decision I
                  made&quot;
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/edfa5d937f-76da4d6ffa1e2ba295bf.png"
                  alt="typewritten letter excerpt on vintage paper about life lessons and wisdom, classic serif font, soft natural lighting"
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-4 blur-[1.5px]"
                />
                <p className="text-xs md:text-sm text-charcoal/70 italic">
                  When I was pregnant, I often saw bright red cardinals by my
                  window, which reminded me of my dad. Someone told me that
                  cardinals represent the presence of a loved one who has passed
                  away. When I went into labor a few days later, my delivery
                  room happened to have a huge, beautiful mural of a cardinal,
                  across the entire wall. I knew my dad was with me. I hope that
                  you will feel me with you, always.
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/78f547d41e-360d242a7e8bd017efb5.png"
                  alt="elegant handwritten note on quality stationery about charitable giving and community values, flowing script, warm ambient light"
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-4 blur-[1.5px]"
                />
                <p className="text-xs md:text-sm text-charcoal/70 italic">
                  &quot;I can hear the sweet sound of my aunt&apos;s voice
                  whenever I think, &quot;Whether that Gucci bag looks real or
                  not depends who is wearing it, and how they wear it...&quot;
                  It makes me laugh because I know it&apos;s true. I loved her
                  insights, and she was the richest person I knew for a long
                  time. Rich in many ways. She taught me about generosity. She
                  bought me my graduation dress, and the price tag on it was
                  more than if I totaled up every other dress in my
                  closet.&quot;
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/65d8b3b6e3-08a7c89f663e9d7d2c99.png"
                  alt="personal letter excerpt on fine paper about family traditions and memories, handwritten style, gentle lighting"
                  className="w-full h-48 md:h-64 object-cover rounded-lg mb-4 blur-[1.5px]"
                />
                <p className="text-xs md:text-sm text-charcoal/70 italic">
                  &quot;Remember the summers at the lake house and the peace we
                  found there. That place carries the story of our family. Honor
                  what it gave us. Preserve the legacy and keep the house if you
                  can. It is more than a property. It is where we became us. It
                  would mean the world if you would continue to take your kids
                  and grandkids there and measure their height on the bark of
                  the oak tree like we did with you all.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Legacy for All 2 Section */}
        <section id="legacy-for-all-2" className="py-16 md:py-24 bg-white">
          <div
            id="legacy-for-all-content-2"
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
              Legacy Isn&apos;t Just for Parents
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed max-w-3xl mx-auto">
              Legacy is not limited to raising children. It is shaped by the
              relationships you invested in, the stability you created for
              yourself, and the moments of kindness, generosity, and support you
              offered to the people around you.
              <br /> <br /> If you&apos;re here reading this, you&apos;re
              probably the reliable sibling, the thoughtful friend, the mentor
              at work, or the person everyone turns to for grounded decisions.
              You have a big family, of family and friends, even if you&apos;re
              not a parent. <br /> <br /> The people in your life will
              appreciate the clarity of hearing your voice and understanding
              your intentions.
              <br />
              <br />
              Succession Story gives you a way to speak directly to them. <br />{" "}
              <br /> Whether you are passing on a piece of property, a financial
              gift, or a set of traditions and memories, your message helps the
              people you care about understand the meaning behind your choices.
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-ivory">
          <div id="testimonials-content" className="max-w-6xl mx-auto px-4">
            <h2 className="text-center font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal mb-12 md:mb-16">
              What They Never Expected to Feel
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
              <div
                id="testimonial-1"
                className="bg-white p-6 md:p-8 rounded-lg shadow-sm"
              >
                <p className="text-charcoal/80 italic text-base md:text-lg">
                  &quot;I never realized how much my children needed this. They
                  told me they finally understood the heart behind my
                  decisions.&quot;
                </p>
              </div>
              <div
                id="testimonial-2"
                className="bg-white p-6 md:p-8 rounded-lg shadow-sm"
              >
                <p className="text-charcoal/80 italic text-base md:text-lg">
                  &quot;This gave me a sense of peace I did not know I was
                  missing.&quot;
                </p>
              </div>
              <div
                id="testimonial-3"
                className="bg-white p-6 md:p-8 rounded-lg shadow-sm"
              >
                <p className="text-charcoal/80 italic text-base md:text-lg">
                  &quot;My family said this was the most meaningful thing I ever
                  gave them.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Offer Section */}
        <section id="founder-offer" className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Video on the left (desktop) / top (mobile) */}
              <div className="flex flex-col items-center order-1">
                <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-4 text-center font-bold">
                  What Happens Next?
                </h3>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <video
                    id="bottom-video"
                    loop
                    playsInline
                    controls
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/video_bottom.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              {/* Stripe card on the right (desktop) / bottom (mobile) */}
              <div
                id="founder-offer-content"
                className="text-center border-4 border-taupe rounded-lg p-6 md:p-8 lg:p-12 order-2 max-w-md md:max-w-none mx-auto md:mx-0"
              >
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
                  Founder&apos;s Invitation
                </h2>
                <p className="mt-4 text-base md:text-lg text-charcoal/80">
                  For a limited time, early users can join as founding members.
                </p>

                <div
                  id="offer-details"
                  className="mt-8 text-left max-w-sm mx-auto space-y-3"
                >
                  <p className="flex items-center text-sm md:text-base whitespace-nowrap">
                    <i
                      className="fa-solid fa-check-circle text-taupe mr-3 flex-shrink-0"
                      style={{ width: "18px", height: "17px" }}
                    ></i>
                    Your Succession Story, a legacy letter written for you
                  </p>
                  <p className="flex items-center text-sm md:text-base">
                    <i
                      className="fa-solid fa-check-circle text-taupe mr-3 flex-shrink-0"
                      style={{ width: "18px", height: "17px" }}
                    ></i>
                    Founder pricing
                  </p>
                  <p className="flex items-center text-sm md:text-base">
                    <i
                      className="fa-solid fa-check-circle text-taupe mr-3 flex-shrink-0"
                      style={{ width: "18px", height: "17px" }}
                    ></i>
                    Upgraded to a handwritten font ($20 value)
                  </p>
                  <p className="flex items-center text-sm md:text-base whitespace-nowrap">
                    <i
                      className="fa-solid fa-check-circle text-taupe mr-3 flex-shrink-0"
                      style={{ width: "18px", height: "17px" }}
                    ></i>
                    The opportunity to help shape the final version
                  </p>
                  <p className="flex items-center text-sm md:text-base">
                    <i
                      className="fa-solid fa-check-circle text-taupe mr-3 flex-shrink-0"
                      style={{ width: "18px", height: "17px" }}
                    ></i>
                    A private and secure experience
                  </p>
                </div>

                <div id="price-block" className="my-8">
                  <p id="i7g94o" className="text-lg md:text-xl text-charcoal/70">
                    Founder Price:
                  </p>
                  <p className="text-5xl md:text-5xl font-bold text-charcoal">
                    <span className="line-through text-3xl text-charcoal/50 mr-2">$197</span>
                    $97
                  </p>
                </div>

                <div
                  id="urgency-block"
                  className="bg-taupe/20 text-charcoal py-3 md:py-4 px-4 md:px-6 rounded-lg mb-8"
                >
                  <p className="text-base md:text-lg font-semibold">
                    ⏰ Only 20 early access spots remaining
                  </p>
                </div>

                {/* Stripe Buy Button */}
                <div
                  className="flex justify-center"
                  dangerouslySetInnerHTML={{
                    __html: `<stripe-buy-button
  buy-button-id="buy_btn_1SXZmBIydlpWz9Ik1sHbpA0e"
  publishable-key="pk_live_51SVYrzIydlpWz9IkhtVpwFvq0KSioT9AsgIrghb5YS4JA1kBpTy1wAOVTbNdf9g8G3SEC9DrGpNXhoUSizE3R6Gq00X4MLFfw4"
>
</stripe-buy-button>`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-charcoal text-ivory/70 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-serif text-ivory">
              Succession Story
            </h3>
          </div>
          <div className="text-center text-xs md:text-sm max-w-4xl mx-auto border-t border-ivory/20 pt-6 md:pt-8">
            <p className="italic">
              Succession Story does not provide legal advice, does not create or
              modify any estate plan, and does not affect or override any will,
              trust, or other legal documents. Your Succession Story is for
              personal expression only and has no legal effect.
            </p>
          </div>
          <div className="text-center mt-6 md:mt-8 text-xs">
            <p>&copy; 2026 Succession Story. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
