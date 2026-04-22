# French Tutor · Deploy & Update Guide

## Quick mental model

- **Cursor** = code editor on your computer (where you edit files)
- **GitHub** = online storage for your code (where files live and get versioned)
- **Vercel** = hosting (serves your app on the internet)
- **Your flow**: edit in Cursor → push to GitHub → Vercel auto-deploys

You need Vercel. Cursor and GitHub are optional but highly recommended — they make updates take 30 seconds instead of 10 minutes.

---

## Files in this folder

```
french-tutor-deploy/
├── index.html          ← the app (don't touch this for content updates)
├── content.js          ← tutor notes, vocab, drills (edit this weekly)
├── api/
│   └── claude.js       ← server proxy for API calls
├── vercel.json         ← Vercel config
└── DEPLOY.md           ← this file
```

**The key insight**: to update tutor notes, vocab, or drills each week, you only edit `content.js`. Everything else stays the same.

---

## One-time setup (~20 minutes)

### Step 1: Get your Anthropic API key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Settings → API Keys → Create Key
4. Copy the key (starts with `sk-ant-...`) — save it somewhere safe
5. Settings → Billing → add $5-10 credit

### Step 2: Install the tools on your computer

1. **Node.js** (needed for Vercel CLI): https://nodejs.org → download the LTS version → install
2. **Git** (needed for GitHub): https://git-scm.com → download → install with defaults
3. **Cursor** (optional, nice code editor): https://cursor.com → download → install
4. **Vercel CLI**: open a terminal and run:
   ```
   npm install -g vercel
   ```

### Step 3: Push to GitHub

1. Create a GitHub account: https://github.com/signup
2. Create a new repo:
   - Click the `+` in the top right → "New repository"
   - Name it something like `french-tutor`
   - Set it to **Private** (your content is personal)
   - Don't initialize with README — leave it empty
   - Click "Create repository"
3. GitHub shows you a page with commands. Copy them for step 5.
4. In your terminal, navigate to this `french-tutor-deploy` folder:
   ```
   cd path/to/french-tutor-deploy
   ```
5. Run these commands (replace YOUR-USERNAME and REPO-NAME):
   ```
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
   git push -u origin main
   ```

### Step 4: Connect Vercel to GitHub

1. Go to https://vercel.com/signup
2. Sign up with your GitHub account (easiest — it links them automatically)
3. Once logged in, click "Add New..." → "Project"
4. Find your `french-tutor` repo → click "Import"
5. Before clicking Deploy, click **"Environment Variables"** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste your Anthropic key (the `sk-ant-...` one)
   - Click "Add"
6. Click "Deploy"
7. Wait ~30 seconds. You get a URL like `https://french-tutor-xyz.vercel.app`

### Step 5: Install the app on your phone

- **iPhone**: open the URL in Safari → share button → "Add to Home Screen"
- **Android**: open in Chrome → three dots → "Install app" or "Add to Home Screen"

Done. You now have a real app on your home screen.

---

## Updating weekly — two options

### Option A: Edit directly on GitHub (fastest, no computer setup needed)

1. Go to your GitHub repo in a browser
2. Click `content.js`
3. Click the pencil icon (edit)
4. Make your changes
5. Scroll down → "Commit changes"
6. Vercel auto-deploys in ~30 seconds. Refresh the app on your phone.

Good for quick tweaks. Not great for bigger updates from me.

### Option B: Cursor + Git (better for pasting large updates from this chat)

1. Clone your repo once (first time only):
   ```
   git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
   cd REPO-NAME
   cursor .
   ```
   (That opens the folder in Cursor)

2. When I give you updated content here in chat, copy my updated `content.js` and paste it over the old one in Cursor

3. Save the file (Cmd+S / Ctrl+S)

4. Open Cursor's terminal (Ctrl+backtick or Terminal menu) and run:
   ```
   git add content.js
   git commit -m "add lesson notes from 22/04"
   git push
   ```

5. Vercel auto-deploys. ~30 seconds later, refresh the app.

---

## Asking me for updates

When you come back to chat with new tutor notes, just say something like:

> "Here are my notes from the 22/04 session: [paste]. Please update the app."

I'll give you:
- An updated `content.js` to paste over your existing one
- A summary of what changed

You never need to touch `index.html` unless you want to change how the app itself works (layout, features, etc.).

---

## Troubleshooting

**The app loads but API calls fail**: your `ANTHROPIC_API_KEY` env var isn't set on Vercel. Go to your Vercel project → Settings → Environment Variables → add it → redeploy.

**I updated content.js but the app hasn't changed**: hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows). Browsers cache aggressively.

**Vercel build failed**: go to your Vercel dashboard → your project → Deployments → click the failed one → read the error log. Most common issue is a syntax error in content.js (usually an unescaped apostrophe or a missing bracket). Fix and push again.

**Want to see API usage/costs**: https://console.anthropic.com/settings/usage

**Want to start fresh**: delete the Vercel project, delete the GitHub repo, start over. Takes 2 minutes.
