<a name="readme-top"></a>

<br />
<div align="center">
<a href="https://leetcode.com">
    <img src="./resources/git.svg" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">A brief debunk of Git</h3>

  <p align="center">
    Master Git and use it like a pro in your projects
    <br />
    <br />
    <a href="https://github.com/pallandir/git-primer/issues">Report Bug</a>
    ·
    <a href="https://github.com/pallandir/git-primer/issues">Request Feature</a>
  </p>
</div>

## About this repository

In professional development and large team projects, version control is a must. While Git is a powerful tool that enhances collaboration and productivity, its many features can sometimes feel overwhelming.

This guide is your go-to introduction to Git, covering both beginner and advanced commands. 💡 Our goal is to help you feel confident when initializing a repo, managing updates, and resolving conflicts proving that Git isn’t as intimidating as it seems.

📖 You'll find a comprehensive cheat sheet with clear examples and illustrations to help you master Git with ease.

## How to read this course

This course is an **interactive animated book** built with
[Astro Starlight](https://starlight.astro.build/), living in the
[`book/`](book/) folder. It walks you through Git with step-through animations
for branching, merging, rebasing, resetting, stashing, and more.

- 📖 Read it online: [pallandir.github.io/git-primer](https://pallandir.github.io/git-primer/)
- 🛠️ Run it locally: `cd book && npm install && npm run dev`
- 🚀 Deploy it to GitHub Pages with the included workflow. See
  [`book/README.md`](book/README.md) for details.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTENT -->

## Content

1. [Introduction to Git](https://pallandir.github.io/git-primer/introduction/)
   - What is Git? Why use it?
   - Difference between Git and GitHub
   - Installing Git (Windows, macOS, Linux)
   - Basic Git configuration (git config)
2. [Setting Up a Git Repository](https://pallandir.github.io/git-primer/setup/)
   - Initializing a repository (git init)
   - Cloning a repository (git clone)
   - Understanding the .git folder
3. [Basic Git Workflow](https://pallandir.github.io/git-primer/basic-workflow/)
   - Checking repository status (git status)
   - Staging changes (git add)
   - Committing changes (git commit)
   - Viewing commit history (git log)
4. [Working with Branches](https://pallandir.github.io/git-primer/branches/)
   - What are branches? Why use them?
   - Creating and switching branches (git branch, git checkout, git switch)
   - Merging branches (git merge)
   - Resolving merge conflicts
5. [Remote Repositories](https://pallandir.github.io/git-primer/remotes/)
   - Connecting to a remote (git remote add)
   - Pushing changes (git push)
   - Fetching changes (git fetch)
   - Pulling updates (git pull)
   - Forking and contributing to open-source projects
6. [Undoing Changes & Resetting History](https://pallandir.github.io/git-primer/undoing-changes/)
   - Discarding local changes (git restore, git checkout)
   - Unstaging files (git reset HEAD)
   - Amending commits (git commit --amend)
   - Reverting commits (git revert)
   - Reset vs. Revert vs. Checkout
7. [Understanding Git Internals](https://pallandir.github.io/git-primer/internals/)
   - The Git object model (blobs, trees, commits)
   - How Git stores changes (snapshots vs. diffs)
   - Git references (HEAD, refs, tags)
8. [Advanced Git Commands](https://pallandir.github.io/git-primer/advanced-commands/)
   - Interactive rebasing (git rebase -i)
   - Reflog and recovering lost commits (git reflog)
   - Cherry-picking commits (git cherry-pick)
   - Stashing work (git stash)
9. [Git Hooks & Automation](https://pallandir.github.io/git-primer/hooks-automation/)
   - Pre-commit hooks (.git/hooks/pre-commit)
   - Post-commit and other hooks
   - Automating workflows with Git
10. [Git Best Practices](https://pallandir.github.io/git-primer/best-practices/)
    - Writing good commit messages
    - Keeping a clean commit history
    - Git workflows (Git Flow, Trunk-based, GitHub Flow)
11. [Troubleshooting & Debugging Git Issues](https://pallandir.github.io/git-primer/troubleshooting/)
    - Fixing detached HEAD state
    - Dealing with merge conflicts
    - Resolving git push and git pull errors
    - Diagnosing issues with git fsck and git gc
12. [Working with Submodules & Large Repositories](https://pallandir.github.io/git-primer/submodules-large-repos/)
    - Using submodules (git submodule)
    - Handling large files with Git LFS
    - Optimizing repository performance
13. [Using Git with Other Tools](https://pallandir.github.io/git-primer/other-tools/)
    - GitHub/GitLab/Bitbucket basics
    - Integrating Git with CI/CD
    - Using Git in VS Code and other IDEs
14. [Real-World Git Scenarios](https://pallandir.github.io/git-primer/real-world-scenarios/)
    - Collaborating in a team
    - Handling hotfixes and release branches
    - Recovering from mistakes
15. [Learning resources](https://pallandir.github.io/git-primer/resources/)
    - Practice sandboxes, exercises, and talks

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

This repository and all its content is under `GNU General Public License v3.0`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
