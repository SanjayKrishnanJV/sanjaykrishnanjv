interface CareerEntry {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

interface SkillGroup {
  label: string;
  items: string[];
}

interface Project {
  name: string;
  description: string;
  url: string;
  stack: string[];
}

interface Credential {
  name: string;
  organization: string;
  issueDate: string;
}

interface Post {
  slug: string;
  title: string;
  description: string;
}

interface LinkedInPost {
  date: string;
  url: string;
  excerpt: string;
}

interface SEOContentProps {
  name: string;
  role: string;
  employer: string;
  location: string;
  bio: string;
  education: string;
  careerEntries: CareerEntry[];
  skills: SkillGroup[];
  projects: Project[];
  credentials: Credential[];
  posts: Post[];
  email: string;
  github: string;
  linkedin: string;
  linkedinPosts?: LinkedInPost[];
  newsletter?: { name: string; url: string; description: string };
  instagram?: { url: string; handle: string };
}

/**
 * The interactive terminal only ever mounts the one active "view" in the
 * DOM, by design (that's what makes the no-scroll, command-driven
 * navigation work) — which means a crawler, or a screen reader user who
 * hasn't triggered any view switches, would otherwise only ever see the
 * hero. This renders the same real data as plain, linear, sr-only markup so
 * the full site is genuinely present in the initial HTML and reachable
 * without depending on JS-driven interaction — not a duplicate/decorative
 * summary, the actual content.
 */
export function SEOContent({
  name,
  role,
  employer,
  location,
  bio,
  education,
  careerEntries,
  skills,
  projects,
  credentials,
  posts,
  email,
  github,
  linkedin,
  linkedinPosts,
  newsletter,
  instagram,
}: SEOContentProps) {
  return (
    <div className="sr-only">
      <h1>
        {name} — {role} at {employer}, {location}
      </h1>
      <p>{bio}</p>
      <p>{education}</p>

      <section>
        <h2>Career</h2>
        <ul>
          {careerEntries.map((entry) => (
            <li key={`${entry.company}-${entry.startDate}`}>
              {entry.position} at {entry.company} ({entry.startDate}
              {' – '}
              {entry.current ? 'present' : entry.endDate}), {entry.location}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <ul>
          {skills.map((group) => (
            <li key={group.label}>
              {group.label}: {group.items.join(', ')}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.name}>
              <a href={project.url}>{project.name}</a> — {project.description} (
              {project.stack.join(', ')})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Certifications</h2>
        <ul>
          {credentials.map((cred) => (
            <li key={cred.name}>
              {cred.name} — {cred.organization}, {cred.issueDate}
            </li>
          ))}
        </ul>
      </section>

      {(linkedinPosts?.length || newsletter || instagram) && (
        <section>
          <h2>Elsewhere</h2>
          {linkedinPosts && linkedinPosts.length > 0 && (
            <ul>
              {linkedinPosts.map((post) => (
                <li key={post.url}>
                  <a href={post.url}>LinkedIn, {post.date}</a> — {post.excerpt}
                </li>
              ))}
            </ul>
          )}
          {newsletter && (
            <p>
              Newsletter: <a href={newsletter.url}>{newsletter.name}</a> — {newsletter.description}
            </p>
          )}
          {instagram && (
            <p>
              Instagram: <a href={instagram.url}>@{instagram.handle}</a>
            </p>
          )}
        </section>
      )}

      <section>
        <h2>Writing</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}`}>{post.title}</a> — {post.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${email}`}>{email}</a> · <a href={github}>GitHub</a> ·{' '}
          <a href={linkedin}>LinkedIn</a>
        </p>
      </section>
    </div>
  );
}
