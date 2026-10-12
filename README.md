# Library Management Web Application

A beginner-friendly front-end lab project made with HTML, CSS, JavaScript and Local Storage.

## Files
- `index.html` — login and signup page
- `admin.html` — admin dashboard, add books, search, change availability and view members
- `user.html` — user dashboard, search catalogue and borrow available books
- `style.css` — responsive layout using CSS Grid and Flexbox
- `app.js` — login/signup, Local Storage and dashboard behaviour

## Run the project
1. Download and extract this folder.
2. Open `index.html` in Chrome.
3. Select **Sign up**, create an account, then log in.
4. Choose **User** to see the user dashboard or **Admin (demo)** to see the admin dashboard.
5. Data is stored in the same browser using Local Storage. This is only a front-end demonstration, not secure production authentication.

## Git lab steps: pull, verify, modify and commit

If your team repository already exists on GitHub, open Command Prompt/Terminal in your project folder.

```bash
git status
git remote -v
git switch main
git pull origin main
git log --oneline -5
git status
```

Open `index.html`, `admin.html` and `user.html` to verify the latest remote files. If your team uses `master` or another branch, replace `main` with that branch name. If you already have uncommitted changes, check `git status` before pulling.

Make a small personal modification, for example change the dashboard heading or add one book category. Then run:

```bash
git add .
git commit -m "Update library dashboard"
git push origin main
```

If you are starting from a GitHub repository for the first time:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_FOLDER
```

## Other Git commands for the lab
```bash
git branch feature-dashboard
git switch feature-dashboard
# Make a change, then:
git add .
git commit -m "Add dashboard change"
git switch main
git merge feature-dashboard
git push origin main
```

Fork: open the repository on GitHub and click **Fork**. Clone your fork with `git clone YOUR_FORK_URL`, then add the original team repository as upstream if required:

```bash
git remote add upstream ORIGINAL_TEAM_REPOSITORY_URL
git fetch upstream
git pull upstream main
```

Reset examples (be careful: reset can discard work):

```bash
git reset --soft HEAD~1
git reset --hard HEAD~1
```

`--soft` moves the last commit back but keeps its changes staged. `--hard` removes the last commit and its uncommitted changes from your working tree. Use `--hard` only if you are sure you do not need that work.

## GitHub Pages URL
For a static site, push the files to GitHub. In the repository, open **Settings → Pages**, choose the `main` branch and `/ (root)`, then save. Wait for GitHub Pages to publish. Your URL normally looks like:

`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

Use the actual URL shown in the Pages settings. The dashboard links work when all files stay in the same folder.
Latest remote update: Project instructions verified by the team.
