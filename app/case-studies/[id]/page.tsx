import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  Github,
} from 'lucide-react';
import Link from 'next/link';
import { getCaseStudyById, getAllCaseStudies } from '@/lib/case-studies';
import CaseStudyGallery from '@/components/case-studies/CaseStudyGallery';
import TechStackSection from '@/components/case-studies/TechStackSection';
import MetricsCard from '@/components/case-studies/MetricsCard';

interface CaseStudyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((study) => ({
    id: study.id,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: `${caseStudy.title} - Case Study | Sanjay Krishnan JV`,
    description: caseStudy.description,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.tagline,
      images: [caseStudy.coverImage],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-dark-100/50">
        <div className="container-custom">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 glass rounded-full text-sm mb-4">
                {caseStudy.category}
              </div>
              <h1 className="text-5xl font-bold mb-6">{caseStudy.title}</h1>
              <p className="text-xl text-primary-400 mb-6">{caseStudy.tagline}</p>
              <p className="text-lg text-dark-600 mb-8">{caseStudy.description}</p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-400" />
                  <span className="text-sm text-dark-600">{caseStudy.timeline.duration}</span>
                </div>
                {caseStudy.team && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-400" />
                    <span className="text-sm text-dark-600">
                      {caseStudy.team.size} people · {caseStudy.team.role}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {caseStudy.githubUrl && (
                  <a
                    href={caseStudy.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <Github className="w-5 h-5" />
                    View Code
                  </a>
                )}
                {caseStudy.liveUrl && (
                  <a
                    href={caseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={caseStudy.coverImage}
                alt={caseStudy.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <CaseStudyGallery images={caseStudy.gallery} />
      )}

      {/* Tech Stack */}
      <TechStackSection technologies={caseStudy.technologies} />

      {/* Challenge */}
      <section className="section">
        <div className="container-custom max-w-5xl">
          <div className="glass rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">{caseStudy.challenge.title}</h2>
            <p className="text-lg text-dark-600 mb-8">{caseStudy.challenge.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudy.challenge.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <p className="text-dark-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="section bg-dark-100/50">
        <div className="container-custom max-w-5xl">
          <div className="glass rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">{caseStudy.solution.title}</h2>
            <p className="text-lg text-dark-600 mb-8">{caseStudy.solution.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudy.solution.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-dark-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="section">
        <div className="container-custom max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">{caseStudy.outcomes.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {caseStudy.outcomes.metrics.map((metric, index) => (
              <MetricsCard
                key={index}
                label={metric.label}
                value={metric.value}
                iconName={metric.icon}
                index={index}
              />
            ))}
          </div>

          {caseStudy.outcomes.testimonial && (
            <div className="glass rounded-xl p-8">
              <blockquote className="text-xl italic text-dark-700 mb-6">
                "{caseStudy.outcomes.testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {caseStudy.outcomes.testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{caseStudy.outcomes.testimonial.author}</p>
                  <p className="text-sm text-dark-600">{caseStudy.outcomes.testimonial.position}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section bg-dark-100/50">
        <div className="container-custom max-w-5xl">
          <h2 className="text-3xl font-bold mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudy.features.map((feature, index) => (
              <div key={index} className="glass rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <p>{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learnings */}
      {caseStudy.learnings && caseStudy.learnings.length > 0 && (
        <section className="section">
          <div className="container-custom max-w-5xl">
            <h2 className="text-3xl font-bold mb-12">Key Learnings</h2>
            <div className="space-y-4">
              {caseStudy.learnings.map((learning, index) => (
                <div key={index} className="glass rounded-xl p-6 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-lg">{learning}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section bg-gradient-to-r from-primary-500/10 to-purple-500/10">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Interested in Working Together?</h2>
          <p className="text-lg text-dark-600 mb-8">
            I'm always open to discussing new projects and opportunities.
          </p>
          <Link href="/#contact" className="btn-primary">
            Get In Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
