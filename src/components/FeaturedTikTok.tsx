"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL = "https://www.tiktok.com/@siga_____cs/video/7558450191188217099";
const VIDEO_ID = "7558450191188217099";

export default function FeaturedTikTok() {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = embedRef.current;
    if (!target) return;

    let loaded = false;
    const loadPlayer = () => {
      if (loaded || document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) return;
      loaded = true;
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadPlayer();
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={embedRef} className="mx-auto w-full max-w-[605px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <blockquote
        className="tiktok-embed !mx-auto !w-full !max-w-[605px] !min-w-0"
        cite={VIDEO_URL}
        data-video-id={VIDEO_ID}
        style={{ minWidth: 0, width: "100%", margin: "0 auto" }}
      >
        <section className="flex min-h-[420px] items-center justify-center px-6 text-center text-sm text-gray-400">
          <p>
            <a href={VIDEO_URL} target="_blank" rel="noreferrer" className="text-sigaYellow hover:text-yellow-300">
              Watch this SIGA Audio installation on TikTok
            </a>
          </p>
        </section>
      </blockquote>
    </div>
  );
}
