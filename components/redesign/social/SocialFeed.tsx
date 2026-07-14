'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';
import type { LinkedInPost, NewsletterIssue } from '@/content/social';

interface InstagramProfile {
  handle: string;
  url: string;
  displayName: string;
  pronouns: string;
  posts: number;
  followers: number;
  following: number;
  bioTag: string;
  bio: string;
}

interface SocialFeedProps {
  linkedinUrl: string;
  linkedinPosts: LinkedInPost[];
  newsletter: {
    name: string;
    url: string;
    frequency: string;
    description: string;
    recentIssues: NewsletterIssue[];
  };
  instagram: InstagramProfile;
}

export function SocialFeed({ linkedinUrl, linkedinPosts, newsletter, instagram }: SocialFeedProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-li-post]', { stagger: 0.15, delay: 0.35 }, rootRef.current);
      revealOnScroll('[data-nl-block]', { delay: 0.3 }, rootRef.current);
      revealOnScroll('[data-ig-stat]', { stagger: 0.08, delay: 0.3 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="social" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span> <TypeLine text="tail -f ~/social/linkedin.log" />
      </div>

      <div className="mt-6 divide-y divide-rule">
        {linkedinPosts.map((post, i) => (
          <a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            data-cursor-text="Open ↗"
            data-li-post
            className="group block py-4 font-mono text-sm"
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-accent">in ~</span>
              <span className="text-text-faint">{post.date}</span>
              <span className="ml-auto flex flex-wrap gap-x-2 text-xs text-text-faint">
                {post.tags.map((tag) => `#${tag}`).join(' ')}
              </span>
            </div>
            <PrintText
              startDelay={550 + i * 250}
              wordDelay={6}
              className="mt-2 max-w-2xl text-sm leading-relaxed text-text-soft transition-colors group-hover:text-text"
              text={post.excerpt}
            />
          </a>
        ))}
      </div>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noreferrer"
        data-cursor="view"
        data-cursor-text="Open ↗"
        className="mt-4 inline-block font-mono text-xs text-text-faint transition-colors hover:text-accent"
      >
        --linkedin/profile <span className="text-accent">{linkedinUrl.replace('https://', '')}</span>
      </a>

      <div data-nl-block className="mt-10 border-t border-rule pt-8 font-mono text-sm">
        <div className="text-text-faint">
          <span className="text-accent">$</span> <TypeLine text="subscribe --newsletter" startDelay={200} />
        </div>
        <a
          href={newsletter.url}
          target="_blank"
          rel="noreferrer"
          data-cursor="view"
          data-cursor-text="Subscribe ↗"
          className="mt-3 inline-block text-xl font-bold text-text transition-colors hover:text-accent md:text-2xl"
        >
          {newsletter.name}
        </a>
        <span className="ml-3 align-middle text-[10px] uppercase tracking-[0.2em] text-text-faint">
          {newsletter.frequency}
        </span>
        <PrintText
          startDelay={900}
          wordDelay={8}
          className="mt-2 max-w-xl text-sm leading-relaxed text-text-soft"
          text={newsletter.description}
        />
        <div className="mt-4 space-y-1.5 text-xs text-text-faint">
          {newsletter.recentIssues.map((issue) => (
            <div key={issue.title} className="flex flex-wrap gap-x-3">
              <span className="text-accent">·</span>
              <span className="text-text-soft">{issue.title}</span>
              <span className="ml-auto whitespace-nowrap">{issue.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-rule pt-8 font-mono text-sm">
        <div className="text-text-faint">
          <span className="text-accent">$</span> <TypeLine text="curl -s api.instagram.com/profile" startDelay={100} />
        </div>
        <a
          href={instagram.url}
          target="_blank"
          rel="noreferrer"
          data-cursor="view"
          data-cursor-text="Open ↗"
          className="mt-3 inline-block text-xl font-bold text-text transition-colors hover:text-accent md:text-2xl"
        >
          @{instagram.handle}
        </a>
        <span className="ml-3 align-middle text-xs text-text-faint">
          {instagram.displayName} · {instagram.pronouns}
        </span>

        <div className="mt-5 grid grid-cols-3 gap-6 max-w-sm">
          {[
            { label: 'posts', value: instagram.posts },
            { label: 'followers', value: instagram.followers },
            { label: 'following', value: instagram.following },
          ].map((stat) => (
            <div key={stat.label} data-ig-stat>
              <div className="text-2xl font-bold text-accent md:text-3xl">{stat.value.toLocaleString()}</div>
              <div className="mt-1 text-xs text-text-faint">{stat.label}</div>
            </div>
          ))}
        </div>

        <PrintText
          startDelay={1000}
          wordDelay={10}
          className="mt-4 max-w-md text-sm leading-relaxed text-text-soft"
          text={`${instagram.bioTag} — ${instagram.bio}`}
        />
      </div>
    </section>
  );
}
