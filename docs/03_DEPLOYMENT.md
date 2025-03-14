# 3. Deployment Process

## Option A: Deploy from the Vercel Dashboard

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your Git repository:
   1. Connect to GitHub/GitLab/Bitbucket if prompted
   2. Select the repository containing your project

4. Configure your project:
   1. **Framework Preset**: Next.js (should be auto-detected)
   2. **Root Directory**: Leave as `.` if your project is in the root
   3. **Build and Output Settings**: Use the defaults

5. Click "Deploy"

## Option B: Deploy Using the Vercel CLI

1. Install the Vercel CLI:
```shellscript
npm install -g vercel
```

If you encounter permissions errors during installation, try one of these solutions:

a) Using sudo (not recommended for security reasons):
```shellscript
sudo npm install -g vercel
```

b) Fix npm permissions (recommended):
```shellscript
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

Then add this to your shell profile (~/.bash_profile, ~/.zshrc, etc.):
```shellscript
export PATH=~/.npm-global/bin:$PATH
```

Reload your shell profile:
```shellscript
source ~/.zshrc  # or source ~/.bash_profile
```

Then try installing again:
```shellscript
npm install -g vercel
```

2. Log in to Vercel:
```shellscript
vercel login
```

3. Deploy from your project directory:
```shellscript
vercel
```

4. Follow the prompts to configure your deployment:
   1. Link to an existing project or create a new one
   2. Confirm settings when prompted
