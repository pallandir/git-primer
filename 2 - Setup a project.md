When starting a project with Git, you can approach it from various entry points. You might begin with a classic setup, such as creating an empty repository on GitHub or GitLab. Alternatively, you may already have a project on your local machine that you want to host on a remote repository. Another common scenario is joining an existing project hosted remotely. Lastly, you might have a project on your local machine and a separate repository on your hosting platform, requiring synchronization to align the two.

While these options might seem overwhelming initially, the process always follows the same core methodology, which can be applied consistently across all these scenarios.

Before covering all these cases in a generic flow chart let's see fist a set of useful commands to start a project. 

```sh
git init #init a git repositoiry from a directory on your local machine
```

```sh
git clone <remote-repository-url> #clone a remote hosted git repository on your local machine
```

Sometimes git will also ask you more about yourself in order to configure your profile across all your repositories. 

To configure your username you can use this command :

```sh
git config --global user.name "firstname lastname"
```

To configure your contact email you can use this command :

```sh
git config --global user.email "your email"
```

