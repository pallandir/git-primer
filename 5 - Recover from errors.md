Now that you may have a global understanding of some of the most important and magic Git commands, we will discuss a topic that can be quite frightening at first but more than helping when understood : recovering from errors made in your project with Git.

## Is Git that dangerous ?

You may have heard of commands like `git reset --hard HEAD~1` or `git push --force --mirror`. Just from the words we have to use (`--hard`, `--force`), they already sound risky, almost as if we need to be absolutely sure of what we're doing. But let’s be honest, that's not always the case. And when we're not careful, we might end up deleting part of our work or worse, everything.  

Fortunately, Git isn’t that unforgiving. It has built-in safeguards to help you recover from mistakes. One of the most powerful tools for this is **the reflog**.  


Next : [[6 - Advanced topics]]