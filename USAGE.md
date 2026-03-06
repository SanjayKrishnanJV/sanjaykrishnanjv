# Usage Guide

Complete guide to using and customizing your portfolio website.

## Table of Contents

- [Data Management](#data-management)
- [Sync Scripts](#sync-scripts)
- [Customization](#customization)
- [Components](#components)
- [Deployment](#deployment)
- [Automation](#automation)

## Data Management

### Personal Data (`data/personal.json`)

This is the main configuration file for your portfolio. Edit it to update:

#### Basic Information

\`\`\`json
{
  "name": "Your Name",
  "title": "Your Professional Title",
  "email": "your.email@example.com",
  "location": "City, Country",
  "bio": "Your professional bio",
  "tagline": "Your catchy tagline"
}
\`\`\`

#### Social Links

\`\`\`json
{
  "socialLinks": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "website": "https://yourwebsite.com",
    "orcid": "https://orcid.org/your-id",
    "instagram": ["https://instagram.com/profile1"]
  }
}
\`\`\`

#### Skills

Organize your skills by category:

\`\`\`json
{
  "skills": {
    "languages": ["TypeScript", "JavaScript", "Python"],
    "frontend": ["React", "Next.js", "Tailwind CSS"],
    "backend": ["Node.js", "Express", "FastAPI"],
    "databases": ["PostgreSQL", "MongoDB", "Redis"],
    "cloud": ["AWS", "Azure", "GCP"],
    "tools": ["Git", "Docker", "Kubernetes"]
  }
}
\`\`\`

#### Experience

Add your work history:

\`\`\`json
{
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "Remote",
      "startDate": "2023-01",
      "endDate": null,
      "current": true,
      "description": "What you do at this company",
      "achievements": [
        "Achievement 1",
        "Achievement 2",
        "Achievement 3"
      ]
    }
  ]
}
\`\`\`

#### Education

\`\`\`json
{
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Technology",
      "field": "Computer Science",
      "startDate": "2018",
      "endDate": "2022",
      "grade": "GPA: 3.8/4.0"
    }
  ]
}
\`\`\`

#### Achievements

\`\`\`json
{
  "achievements": [
    {
      "title": "Award Title",
      "description": "What you achieved",
      "date": "2024",
      "url": "https://link-to-proof.com"
    }
  ]
}
\`\`\`

### GitHub Data (`data/github.json`)

**Auto-generated** by running \`npm run sync-github\`. Don't edit manually.

Contains:
- Profile information
- Repository list
- Pinned repositories
- Language statistics
- Stars and forks count

### Certifications (`data/certifications.json`)

**Auto-generated** by running \`npm run sync-certifications\`. Don't edit manually.

Contains:
- Certification name
- Issuing organization
- Issue date
- Credential ID and URL
- Organization logo

You can also manually add certifications:

\`\`\`json
[
  {
    "name": "Certification Name",
    "organization": "Issuing Organization",
    "issueDate": "Jan 2024",
    "expirationDate": "Jan 2025",
    "credentialId": "ABC123",
    "credentialUrl": "https://verify.com/cert",
    "logo": "https://logo-url.com/logo.png"
  }
]
\`\`\`

## Sync Scripts

### GitHub Sync (\`npm run sync-github\`)

Fetches data from GitHub API:

**What it does:**
- Fetches your GitHub profile
- Gets all public repositories
- Identifies pinned repos (top 6 by stars)
- Calculates language statistics
- Counts total stars and forks

**Configuration:**
- Edit \`GITHUB_USERNAME\` in \`scripts/sync-github.ts\`
- Add \`GITHUB_TOKEN\` to \`.env\` for higher rate limits (5000 requests/hour vs 60)

**Output:**
- \`data/github.json\`

**Frequency:**
- Run manually when you add new projects
- Or set up GitHub Actions to run daily

### LinkedIn Certification Sync (\`npm run sync-certifications\`)

Scrapes certifications from LinkedIn:

**What it does:**
- Logs into LinkedIn with your credentials
- Navigates to your certifications page
- Extracts certification data
- Downloads organization logos

**Configuration:**
- Add credentials to \`.env\`:
  \`\`\`
  LINKEDIN_EMAIL=your@email.com
  LINKEDIN_PASSWORD=your_password
  \`\`\`

**Important Notes:**
- **Security**: LinkedIn credentials are sensitive. Use app-specific password if available.
- **CAPTCHA**: May require manual solving. Set \`headless: false\` in script.
- **Rate Limiting**: LinkedIn may block automated access.
- **2FA**: If enabled, you'll need to handle it manually.
- **Alternative**: Consider manual export from LinkedIn and updating JSON file.

**Output:**
- \`data/certifications.json\`

**Frequency:**
- Run when you earn new certifications
- Not recommended for automated daily runs (risk of account flag)

### Sync All (\`npm run sync-all\`)

Runs both sync scripts sequentially.

## Customization

### Colors and Theme

Edit \`tailwind.config.ts\`:

\`\`\`typescript
colors: {
  primary: {
    500: '#0ea5e9',  // Change primary color
    600: '#0284c7',
  },
}
\`\`\`

### Animations

Modify animations in \`tailwind.config.ts\`:

\`\`\`typescript
animation: {
  'custom': 'customAnimation 3s ease-in-out infinite',
},
keyframes: {
  customAnimation: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}
\`\`\`

### Global Styles

Edit \`app/globals.css\` for:
- Typography
- Glass effects
- Gradients
- Utility classes

### Adding New Sections

1. Create component in \`components/sections/YourSection.tsx\`
2. Import in \`app/page.tsx\`
3. Add to navigation in \`components/layout/Navbar.tsx\`

Example:

\`\`\`tsx
// components/sections/Blog.tsx
export default function Blog() {
  return (
    <section id="blog" className="section">
      <div className="container-custom">
        <h2>My <span className="gradient-text">Blog</span></h2>
        {/* Your content */}
      </div>
    </section>
  );
}
\`\`\`

## Components

### Layout Components

- **Navbar**: Sticky navigation with mobile menu
- **Footer**: Links and social media

### Section Components

- **Hero**: Landing section with CTA
- **About**: Professional background
- **Skills**: Technology grid
- **Projects**: GitHub repositories with filters
- **Certifications**: Certificate gallery with modal
- **Experience**: Timeline of work history
- **Education**: Academic background
- **Achievements**: Awards and recognition
- **GitHubActivity**: Stats and language chart
- **Contact**: Contact form and info

### Customizing Components

Each component is independent and can be:
- Removed (delete from \`app/page.tsx\`)
- Reordered (change order in \`app/page.tsx\`)
- Modified (edit the component file)
- Duplicated (copy and rename)

## Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Configure:
     - Framework: Next.js
     - Build command: \`npm run build\`
     - Output directory: \`.next\`

2. **Add environment variables**
   - \`GITHUB_TOKEN\`
   - \`LINKEDIN_EMAIL\`
   - \`LINKEDIN_PASSWORD\`

3. **Deploy**
   - Vercel auto-deploys on every push to \`main\`

### Netlify

1. **Connect repository**
   - Go to [app.netlify.com/start](https://app.netlify.com/start)
   - Connect your GitHub repo

2. **Configure build settings**
   - Build command: \`npm run build\`
   - Publish directory: \`.next\`

3. **Add environment variables**
   - Same as Vercel

### Custom Domain

**Vercel:**
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS:
   - Type: CNAME
   - Name: www (or @)
   - Value: cname.vercel-dns.com

**Netlify:**
1. Site Settings > Domain Management
2. Add custom domain
3. Follow DNS instructions

## Automation

### GitHub Actions

#### Daily Data Sync

File: \`.github/workflows/sync-data.yml\`

**Setup:**
1. Add repository secret: \`GH_TOKEN\`
2. Enable GitHub Actions
3. Workflow runs daily at midnight UTC

**Manual trigger:**
- Go to Actions tab
- Select "Sync Portfolio Data"
- Click "Run workflow"

#### Auto-Deploy

File: \`.github/workflows/deploy.yml\`

**Setup:**
1. Add secrets:
   - \`VERCEL_TOKEN\`
   - \`VERCEL_ORG_ID\`
   - \`VERCEL_PROJECT_ID\`
2. Deploys on every push to \`main\`

### Local Automation

Set up a cron job to sync data:

\`\`\`bash
# Edit crontab
crontab -e

# Add this line to sync daily at 2 AM
0 2 * * * cd /path/to/portfolio && npm run sync-github
\`\`\`

## Best Practices

### Security

- **Never commit \`.env\` file** (already in \`.gitignore\`)
- **Use environment variables** for sensitive data
- **Rotate tokens regularly**
- **Use minimal GitHub token scopes**

### Performance

- **Optimize images**: Use Next.js Image component
- **Lazy load**: Heavy components load on scroll
- **Minimize bundle**: Import only what you need
- **Cache data**: GitHub Actions caches sync results

### SEO

- **Update metadata**: Edit \`app/layout.tsx\`
- **Add structured data**: Consider JSON-LD
- **Optimize images**: Alt text, proper sizing
- **Internal linking**: Link between sections

### Maintenance

- **Update dependencies monthly**: \`npm update\`
- **Check Lighthouse scores**: Aim for 90+
- **Monitor analytics**: Track visitors
- **Refresh content**: Keep projects and certs current

## Troubleshooting

### Common Issues

**1. Build fails with module errors**
\`\`\`bash
rm -rf .next node_modules
npm install
npm run build
\`\`\`

**2. Sync scripts timeout**
- Increase timeout in script
- Check internet connection
- Verify credentials

**3. LinkedIn scraper blocked**
- Use manual CAPTCHA (\`headless: false\`)
- Try different IP (VPN)
- Consider manual JSON update

**4. GitHub rate limit exceeded**
- Add \`GITHUB_TOKEN\` to \`.env\`
- Wait 1 hour for reset
- Reduce sync frequency

## Support

For issues or questions:

- Check [README.md](README.md)
- Review [QUICKSTART.md](QUICKSTART.md)
- Open GitHub issue
- Email: contact@sanjaykrishnanjv.com

---

Happy building! 🚀
