import { getPersonalData, getGitHubData, getCertifications } from '@/lib/data';
import { getAllPosts } from '@/lib/blog';
import { work } from '@/content/work';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { SEOContent } from '@/components/redesign/seo/SEOContent';
import { TerminalApp, type TerminalView } from '@/components/redesign/layout/TerminalApp';
import { CloseStrip } from '@/components/redesign/layout/CloseStrip';
import { Hero } from '@/components/redesign/hero/Hero';
import { About } from '@/components/redesign/about/About';
import { CareerLog } from '@/components/redesign/career/CareerLog';
import { SkillsPanel } from '@/components/redesign/skills/SkillsPanel';
import { ProjectsExhibit } from '@/components/redesign/projects/ProjectsExhibit';
import { SystemsReadout } from '@/components/redesign/systems/SystemsReadout';
import { CredentialsIndex } from '@/components/redesign/credentials/CredentialsIndex';
import { SocialFeed } from '@/components/redesign/social/SocialFeed';
import { CasesIndex } from '@/components/redesign/cases/CasesIndex';
import { Dispatches } from '@/components/redesign/dispatches/Dispatches';
import { linkedinPosts, newsletter, instagram } from '@/content/social';
import { caseStudies } from '@/content/case-studies';

function dedupe(items: string[]) {
  return Array.from(new Set(items.map((i) => (i === 'Microsoft Azure' ? 'Azure' : i))));
}

function topLanguages(bytes: Record<string, number>, count: number) {
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, percent: Math.round((value / total) * 100) }))
    .filter((lang) => lang.percent > 0)
    .slice(0, count);
}

export default function Home() {
  const personal = getPersonalData();
  const github = getGitHubData();
  const certifications = getCertifications();
  const posts = getAllPosts();

  const careerEntries = personal.experience.filter((e: any) => e.company !== 'Career Break');
  const education = personal.education[0];
  const educationLine = `${education.degree}, ${education.field} — ${education.institution}`;

  const skillGroups = [
    {
      label: 'Cloud & Automation',
      items: [...dedupe(personal.skills.cloud), ...personal.skills.languages],
    },
    { label: 'Frontend', items: personal.skills.frontend },
    { label: 'Backend', items: personal.skills.backend },
    { label: 'Data', items: personal.skills.databases },
    { label: 'Tooling', items: personal.skills.tools },
  ];

  const views: TerminalView[] = [
    {
      id: 'top',
      label: 'index.hero',
      element: (
        <Hero
          name={personal.name}
          role="Senior System Engineer"
          location="Bengaluru, IN"
          employer="WellSky"
        />
      ),
    },
    {
      id: 'about',
      label: 'about.md',
      element: (
        <About
          bio={personal.bio}
          location={personal.location}
          timezone={personal.timezone}
          education={educationLine}
          certified="ITIL V4 · Nerdio NME-201"
        />
      ),
    },
    {
      id: 'career',
      label: 'career.log',
      element: <CareerLog entries={careerEntries} />,
    },
    {
      id: 'skills',
      label: 'skills.json',
      element: <SkillsPanel categories={skillGroups} />,
    },
    {
      id: 'work',
      label: 'work/',
      element: <ProjectsExhibit items={work} />,
    },
    {
      id: 'cases',
      label: 'cases/',
      element: <CasesIndex items={caseStudies} />,
    },
    {
      id: 'systems',
      label: 'systems.stat',
      element: (
        <SystemsReadout
          repos={github.stats.totalRepos}
          stars={github.stats.totalStars}
          followers={github.stats.followers}
          memberSince={new Date(github.profile.createdAt).getFullYear().toString()}
          languages={topLanguages(github.stats.languages, 6)}
        />
      ),
    },
    {
      id: 'credentials',
      label: 'credentials.db',
      element: (
        <CredentialsIndex
          credentials={certifications.map((c: any) => ({
            name: c.name,
            organization: c.organization,
            issueDate: c.issueDate,
          }))}
          featured={[
            'Nerdio Manager for Enterprise Foundations (NME-201)',
            'ITIL® Foundation Certificate in IT Service Management',
            'ServiceNow IT Leadership Professional Certificate',
            'Scrum Fundamentals Certified (SFC)',
            'Service Desk Skill Enhancement Certifications - Level 2',
            'ServiceNow: Basic Administration',
          ]}
        />
      ),
    },
    {
      id: 'social',
      label: 'social.log',
      element: (
        <SocialFeed
          linkedinUrl={personal.socialLinks.linkedin}
          linkedinPosts={linkedinPosts}
          newsletter={newsletter}
          instagram={instagram}
        />
      ),
    },
    {
      id: 'writing',
      label: 'writing/',
      element: <Dispatches posts={posts} />,
    },
    {
      id: 'contact',
      label: 'contact.sh',
      element: (
        <CloseStrip
          email={personal.email}
          github={personal.socialLinks.github}
          linkedin={personal.socialLinks.linkedin}
          instagram={personal.socialLinks.instagram}
          newsletter={personal.socialLinks.linkedinNewsletter}
          location="Bengaluru, India"
        />
      ),
    },
  ];

  return (
    <>
      <SEOContent
        name={personal.name}
        role="Senior System Engineer"
        employer="WellSky"
        location="Bengaluru, IN"
        bio={personal.bio}
        education={educationLine}
        careerEntries={careerEntries}
        skills={skillGroups}
        projects={work.map((item) => ({
          name: item.name,
          description: item.description,
          url: item.url,
          stack: item.stack,
        }))}
        credentials={certifications.map((c: any) => ({
          name: c.name,
          organization: c.organization,
          issueDate: c.issueDate,
        }))}
        caseStudies={caseStudies.map((s) => ({
          id: s.id,
          name: s.name,
          tagline: s.tagline,
          description: s.description,
        }))}
        posts={posts.map((p) => ({ slug: p.slug, title: p.title, description: p.description }))}
        email={personal.email}
        github={personal.socialLinks.github}
        linkedin={personal.socialLinks.linkedin}
        linkedinPosts={linkedinPosts}
        newsletter={newsletter}
        instagram={{ url: instagram.url, handle: instagram.handle }}
      />
      <CustomCursor />
      <TerminalApp views={views} />
    </>
  );
}
