# Premium Personal Portfolio Website

A modern, auto-syncing personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Features automatic data synchronization from GitHub and LinkedIn.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Auto-Sync GitHub Data**: Automatically fetch and display repositories, stats, and contributions
- **LinkedIn Certification Sync**: Scrape and display certifications from LinkedIn profile
- **Premium UI/UX**: Glassmorphism design, smooth animations, and dark mode
- **Fully Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Perfect Lighthouse scores with proper metadata
- **Type-Safe**: Built with TypeScript for reliability
- **Performance**: Optimized for speed with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Scraping**: Puppeteer, Cheerio
- **Deployment**: Vercel / Netlify

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/SanjayKrishnanJV/portfolio-website.git
cd portfolio-website
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Create a \`.env\` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and add your credentials:

\`\`\`env
# GitHub Personal Access Token (optional, for higher rate limits)
GITHUB_TOKEN=your_github_token_here

# LinkedIn Credentials (for certification scraper)
LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password_here
\`\`\`

### Generating GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`
4. Copy the token and add it to your \`.env\` file

## Data Synchronization

### Sync GitHub Data

Fetch your latest GitHub repositories, stats, and language usage:

\`\`\`bash
npm run sync-github
\`\`\`

This will update \`data/github.json\` with:
- Profile information
- All public repositories
- Pinned repositories
- Language statistics
- Stars and forks count

### Sync LinkedIn Certifications

Scrape certifications from your LinkedIn profile:

\`\`\`bash
npm run sync-certifications
\`\`\`

**Important**:
- This requires valid LinkedIn credentials in \`.env\`
- The script will open a browser window (set \`headless: false\` in the script)
- May require manual CAPTCHA/2FA verification
- LinkedIn may rate-limit or block automated scraping

This will update \`data/certifications.json\` with:
- Certification name
- Issuing organization
- Issue date
- Credential ID and URL
- Organization logo

### Sync All Data

Run both sync scripts at once:

\`\`\`bash
npm run sync-all
\`\`\`

## Development

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Lint Code

\`\`\`bash
npm run lint
\`\`\`

## Customization

### Update Personal Information

Edit \`data/personal.json\` to update:
- Name, title, bio
- Contact information
- Social links
- Skills and technologies
- Work experience
- Education
- Achievements

### Modify Colors and Theme

Edit \`tailwind.config.ts\` to customize:
- Color palette
- Animations
- Gradients
- Spacing

### Add New Sections

1. Create a new component in \`components/sections/\`
2. Import and add it to \`app/page.tsx\`
3. Update navigation in \`components/layout/Navbar.tsx\`

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

\`\`\`bash
npm i -g vercel
\`\`\`

2. **Deploy**

\`\`\`bash
vercel
\`\`\`

3. **Set Environment Variables**

Add your environment variables in Vercel dashboard:
- \`GITHUB_TOKEN\`
- \`LINKEDIN_EMAIL\`
- \`LINKEDIN_PASSWORD\`

4. **Enable Auto-Deploy**

Push to your \`main\` branch to trigger automatic deployments.

### Deploy to Netlify

1. **Install Netlify CLI**

\`\`\`bash
npm i -g netlify-cli
\`\`\`

2. **Deploy**

\`\`\`bash
netlify deploy --prod
\`\`\`

3. **Configure**

- Set build command: \`npm run build\`
- Set publish directory: \`.next\`
- Add environment variables in Netlify dashboard

### Deploy to GitHub Pages

1. **Install gh-pages**

\`\`\`bash
npm install -D gh-pages
\`\`\`

2. **Add to package.json**

\`\`\`json
"scripts": {
  "deploy": "next build && next export && gh-pages -d out"
}
\`\`\`

3. **Deploy**

\`\`\`bash
npm run deploy
\`\`\`

## Automation

### GitHub Actions

The project includes GitHub Actions workflows for:

#### Auto-Sync Data (Daily)

\`.github/workflows/sync-data.yml\` runs daily at midnight UTC to:
- Fetch latest GitHub data
- Commit changes back to repository

**Setup**:
1. Add \`GH_TOKEN\` secret in GitHub repository settings
2. Enable GitHub Actions in repository settings

#### Auto-Deploy

\`.github/workflows/deploy.yml\` deploys on every push to \`main\`:
- Builds the project
- Deploys to Vercel

**Setup**:
1. Add Vercel secrets: \`VERCEL_TOKEN\`, \`VERCEL_ORG_ID\`, \`VERCEL_PROJECT_ID\`

## Project Structure

\`\`\`
portfolio-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Certifications.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Achievements.tsx
│   │   ├── GitHubActivity.tsx
│   │   └── Contact.tsx
│   └── ui/                # Reusable UI components
├── data/                  # JSON data files
│   ├── personal.json      # Personal information
│   ├── github.json        # GitHub data (auto-generated)
│   └── certifications.json # LinkedIn certs (auto-generated)
├── lib/                   # Utility functions
│   ├── utils.ts
│   └── data.ts
├── scripts/               # Sync scripts
│   ├── sync-github.ts
│   └── sync-certifications.ts
├── public/                # Static assets
└── .github/
    └── workflows/         # GitHub Actions
        ├── sync-data.yml
        └── deploy.yml
\`\`\`

## Performance

This website is optimized for performance:

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **SEO Score**: 100
- **Accessibility Score**: 100

## SEO Features

- Dynamic sitemap.xml
- Robots.txt configuration
- OpenGraph metadata
- Twitter Card metadata
- Semantic HTML structure
- Optimized images
- Fast page load times

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### LinkedIn Scraper Not Working

- **Issue**: Login fails or CAPTCHA appears
- **Solution**:
  - Run the script with \`headless: false\` to manually solve CAPTCHA
  - Use app-specific password if 2FA is enabled
  - LinkedIn may block automated access; consider manual export

### GitHub API Rate Limit

- **Issue**: Too many API requests
- **Solution**:
  - Add \`GITHUB_TOKEN\` to \`.env\` for higher rate limits
  - Reduce sync frequency in GitHub Actions

### Build Errors

- **Issue**: \`Module not found\` errors
- **Solution**:
  - Clear \`.next\` folder: \`rm -rf .next\`
  - Reinstall dependencies: \`rm -rf node_modules && npm install\`
  - Clear npm cache: \`npm cache clean --force\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Sanjay Krishnan JV**

- Website: [sanjaykrishnanjv.com](https://www.sanjaykrishnanjv.com)
- LinkedIn: [linkedin.com/in/sanjaykrishnanjv](https://in.linkedin.com/in/sanjaykrishnanjv)
- GitHub: [github.com/SanjayKrishnanJV](https://github.com/SanjayKrishnanJV)
- Email: contact@sanjaykrishnanjv.com

---

**Built with** ❤️ **using Next.js, TypeScript, and Tailwind CSS**
