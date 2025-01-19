## Updating a project

As discussed in the first course, [[1 - As a beginning]],  you now have a clear understanding of the various stages involved in managing updates with Git. 
During development, you may need to add, remove, or modify files within your local repository. Eventually, you will want to commit these changes to incorporate them into the project's official version, enabling other contributors to integrate them into their local repositories.

## Files operations

To track the changes made to your project, it’s essential to review the current status of your work. 
Git provides a way to view the state of your project’s file structure and modifications. You can do this by running the following command:

```sh
git status
```

This is undoubtedly one of the most frequently used commands in Git. It displays the status of your files, categorizing them using color codes. Files not tracked by Git appear in red (indicating they are in the workspace), staged files are shown in green (indicating they are in the staging area), and committed files generate a status message confirming their successful inclusion in the repository.

![committed files|451](./resources/git_commit.png)
