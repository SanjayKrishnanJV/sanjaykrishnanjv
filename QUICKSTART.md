# Quick Start Guide

Get your portfolio website up and running in 5 minutes!

## Step 1: Install Dependencies

\`\`\`bash
cd portfolio-website
npm install
\`\`\`

## Step 2: Configure Environment

Create a \`.env\` file:

\`\`\`bash
# Optional: GitHub token for higher API rate limits
GITHUB_TOKEN=your_github_token_here

# Required for LinkedIn certification sync
LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password
\`\`\`

## Step 3: Update Personal Data

Edit \`data/personal.json\` with your information:
- Name and title
- Bio and tagline
- Contact info
- Skills
- Experience
- Education

## Step 4: Sync Your Data

### Sync GitHub (Required)

\`\`\`bash
npm run sync-github
\`\`\`

This fetches your GitHub repos, stats, and languages.

### Sync LinkedIn Certifications (Optional)

\`\`\`bash
npm run sync-certifications
\`\`\`

Note: This requires LinkedIn credentials and may need manual CAPTCHA solving.

## Step 5: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Build & Deploy

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Deploy to Vercel (Easiest)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
\`\`\`

That's it! Your portfolio is live! 🚀

## Next Steps

- [ ] Customize colors in \`tailwind.config.ts\`
- [ ] Add your profile photo to \`public/images/\`
- [ ] Set up automatic syncing with GitHub Actions
- [ ] Connect your custom domain in Vercel
- [ ] Enable analytics (Google Analytics, Vercel Analytics)

## Troubleshooting

**Q: GitHub data not loading?**
A: Run \`npm run sync-github\` first to fetch data.

**Q: LinkedIn scraper fails?**
A: LinkedIn may require CAPTCHA. Set \`headless: false\` in \`scripts/sync-certifications.ts\` to solve manually.

**Q: Build errors?**
A: Delete \`.next\` folder and \`node_modules\`, then run \`npm install\` again.

## Need Help?

- Check the full [README.md](README.md)
- Open an issue on GitHub
- Contact: contact@sanjaykrishnanjv.com
