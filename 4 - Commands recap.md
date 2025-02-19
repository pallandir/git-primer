In this section we will recap all seen commands from beginner to medium. 

## Start a project

```sh
# Init a git repository
git init
```

```sh
# Clone one of your repository from a remote
git clone <remote-repository-url>
```

## Configure Git

```sh
# Setup your username
git config --global user.name "firstname lastname"
```

```sh
# Setup your email (can be used by git)
git config --global user.email "your email"
```
## Setup and check remotes

```sh
# List remotes
git remote -v
```

```sh
# Add a new remote
git remote add <remote-name> <remote-url>
# E.g git remote add https://github.com/pallandir/git-primer
```

```sh
# Update a remote
git remote set-url <remote-name> <remote-url>
# E.g git remote set-url origin https://github.com/pallandir/git-primer
```

```sh
# Remove a remote
git remote remove <remote-url>
# E.g git remote remove origin
```

## Branches

```sh
# Add a new branch
git branch <branch-name>
```

```sh
# Switch from one branch to another
git checkout <new-branch>
```

```sh
# Create and switch to a new branch
git checkout -b <branch-name>
```

## Stay up to date

```sh
# Fetch changes from all branches of the remote -usually origin-
git fetch
```

```sh
# Merge all changes into your current branch
git merge
```

```sh
# Fetch changes from a specific branch of a remote
git fetch <remote> <branch-name>
# E.g git fetch origin main
```

```sh
# Merge changes from a specific branch into your local branch
git merge <remote/branch>
# E.g git merge origin/main
```
## Manage files

```sh
# Get the current status of your workspace files
git status
```

```sh
# Move file(s) to staging area
git add <file_name1> <file_name2>
# Or add everything in your current directory
git add . 
```

## Commits

```sh
# Commit changes to prepare them for push
git commit -m "message"
# Or
git commit 
# And type your message in the opening text editor of your choice.
```

## Push

```sh
# Push a branch already existing in the remote
git push
```

```sh
# Push a branch non exising in the remote
git push --set-upstream origin <branch-name>
```

Next : [[5 - Recover from errors]]