## Updating a project

From the first course [[1 - As a beginning]] you know now what are the different stages involved by git when you update your project. 

Developing a project can mean adding, removing or updating files in your local repository. At a point you will want to submit these changes so they are part of the final version of your project and other contributors can include them in their local version of the project. 

## Files operations

In order to know what changes you made to your project, you will surely need to have a status of what has been done so far. To do so you can ask git to give you a status of your current project file structure and changes by running : 

```sh
git status
```

This is certainly one of the most common command in git. It will show you the status of your files and split the view according to different colors based on if your file is not tracked by git in red (the files is in the workspace area), if it's staged in green (the files are in the staging area) or if you comitted them you will see a status message saying 