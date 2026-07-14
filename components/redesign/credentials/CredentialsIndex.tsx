'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { revealOnScroll } from '@/lib/motion/scrollReveal';
import { TypeLine } from '@/components/redesign/terminal/TypeLine';
import { PrintText } from '@/components/redesign/terminal/PrintText';

interface Credential {
  name: string;
  organization: string;
  issueDate: string;
}

interface CredentialsIndexProps {
  credentials: Credential[];
  featured: string[];
}

// A couple of issuer names in the raw LinkedIn export are long-form legal
// names or comma-stuffed descriptions — shorten for display.
function shortOrg(org: string): string {
  if (org.length <= 24) return org;
  const bySplit = org.split(/ and | \(/)[0].trim();
  if (bySplit.length <= 24) return bySplit;
  return org.split(' ').slice(0, 2).join(' ');
}

export function CredentialsIndex({ credentials, featured }: CredentialsIndexProps) {
  const rootRef = useRef<HTMLElement>(null);
  const issuers = new Set(credentials.map((c) => c.organization));
  const featuredSet = new Set(featured);
  const highlighted = credentials.filter((c) => featuredSet.has(c.name));
  const rest = credentials.filter((c) => !featuredSet.has(c.name));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('[data-cred-row]', { stagger: 0.12, delay: 1.3 }, rootRef.current);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="credentials" ref={rootRef} className="relative border-t border-rule px-4 py-12 text-text md:px-5">
      <div className="font-mono text-sm text-text-faint">
        <span className="text-accent">$</span>{' '}
        <TypeLine
          text={`select * from credentials order by issue_date desc limit ${highlighted.length};`}
          speed={14}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b border-rule text-left text-[10px] uppercase tracking-[0.2em] text-text-faint">
              <th className="py-2 pr-4 font-normal">Date</th>
              <th className="py-2 pr-4 font-normal">Name</th>
              <th className="py-2 font-normal">Issuer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {highlighted.map((cred) => (
              <tr key={cred.name} data-cred-row>
                <td className="whitespace-nowrap py-3 pr-4 align-top text-text-faint">{cred.issueDate}</td>
                <td className="py-3 pr-4 align-top text-text">{cred.name}</td>
                <td className="whitespace-nowrap py-3 align-top text-accent">
                  {shortOrg(cred.organization)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PrintText
          startDelay={2400}
          wordDelay={8}
          className="mt-4 font-mono text-xs leading-relaxed text-text-faint"
          text={`-- ${rest.length} more rows from ${[...new Set(rest.map((c) => shortOrg(c.organization)))].join(', ')} · ${issuers.size} issuers total`}
        />
      </div>
    </section>
  );
}
