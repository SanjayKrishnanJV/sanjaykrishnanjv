# Security Best Practices

## GitHub Secrets Usage

This portfolio uses GitHub Actions for automated data syncing. Here's what's automated and what's manual for security:

### ✅ Automated (Safe)
- **GitHub Data Sync** - Uses read-only GitHub token
  - Secret needed: `GH_TOKEN`
  - Risk: Low (token only reads public data)

### 🔒 Manual (Recommended)
- **LinkedIn Data Sync** - Requires your password
  - Run locally: `npm run sync-linkedin`
  - Run locally: `npm run sync-linkedin-posts`
  - Why manual: Avoids storing password in cloud

## How to Sync Data

### Automated Sync (GitHub only)
Runs weekly automatically via GitHub Actions. Only requires `GH_TOKEN` secret.

### Manual Sync (LinkedIn)
Run these commands locally when you want to update LinkedIn data:

```bash
# Set environment variables in your terminal
export LINKEDIN_EMAIL="your@email.com"
export LINKEDIN_PASSWORD="your_password"
export LINKEDIN_USERNAME="your_username"

# Run LinkedIn syncs
npm run sync-linkedin
npm run sync-linkedin-posts

# Commit the updated data
git add data/
git commit -m "chore: update LinkedIn data"
git push
```

### Option: Use .env file locally

Create a `.env` file (already in .gitignore):

```env
GITHUB_TOKEN=your_github_token
LINKEDIN_EMAIL=your_email
LINKEDIN_PASSWORD=your_password
LINKEDIN_USERNAME=your_username
```

Then run:
```bash
npm run sync-all
```

## GitHub Token Permissions

Your `GH_TOKEN` should have minimal permissions:
- ✅ `public_repo` - Read public repositories
- ✅ `read:user` - Read user profile
- ❌ No write permissions needed

## Secrets Checklist

### Required for Automation
- [ ] `GH_TOKEN` - GitHub personal access token (read-only)

### NOT Stored (Manual Use Only)
- [ ] LinkedIn credentials - Keep these local only

## Alternative: LinkedIn API

Consider using LinkedIn's official API instead of scraping:
- More secure (uses OAuth tokens)
- No password needed
- Requires LinkedIn Developer account
- https://www.linkedin.com/developers/

## Best Practices

1. **Never commit secrets** - They're in .gitignore
2. **Use read-only tokens** when possible
3. **Rotate tokens regularly** - Every 6-12 months
4. **Review workflow logs** - Check for exposed secrets
5. **Limit token scopes** - Only grant necessary permissions

## Questions?

If you're unsure about security, always choose the manual option!
