---
layout: post
title: "Setting up R on macOS for Data Science"
summary: "Set up R for minimal code compiling and maximum speed"
image: "/images/RLogo.png"
date: 2019-06-16
categories: [data-science, r-lang]
---
Terminals and package managers. If you are a developer or a power user, you're probably already yawning. However, while some data scientists have technical backgrounds and can run circles around us "devs" at the command line, many come from non-technical fields. There's one reason why I focus on data scientists in this post, though obviously anyone can take advantage of this method of setting up R on macOS: it's speed.

Many software packages are installed though command-line package managers. On macOS, the two most popular ones are MacPorts and Homebrew (a.k.a. `brew`). In this post, I'll be using `brew` -- partially. If you're already a `brew` fan and have had to install R, you most like did so with `brew install r`. However, this is probably the wrong choice for most people as this could prevent R from using pre-built binaries when installing packages.

Also, without careful setup, some packages that are capable of taking advantage of parallel programming using OpenMP may not get built properly in order to do so.

As a data scientist, you'll probably spend a lot of time on your local workstation training and re-training your data models as you tweak and tune them. If you install R correctly, you will proabably save a lot of time both installing packages and training your models.

# Background
R is built from C, Fortran and recursively from R source code itself. CRAN (Comprehensive R Archive Network) is the main repository for R packages from which you will install most of the packages you need. Package hosted on CRAN include pre-built binary packages targeted for Windows and macOS. If you use a version of R that was built by CRAN, it will be able to download and install the pre-built binaries "out of the box" without having to build them from source.

You may still need to build from source from time to time, so I'll also cover how to set up LLVM and GNU Forton with OpenMP support. Even though the macOS Command Line Tools from Apple includes an LLVM compiler, there is still no support for OpenMP, so we'll need to install our own version (via `brew`).

# Installing R
1. Visit [cran.r-project.org](https://cran.r-project.org)
1. From the menu on the left panel, select **Mirrors**
1. Select the site closest to you
1. In the main section, select **Download R for (Mac) OS X**
1. Find the latest package. It will be named something similar to `R-3.6.0.pkg` according to the latest version available.

This package contains the following:
- **R Framework**
- **R GUI**
- **Tcl/Tk**
- **Texinfo**

You absolutely need **R Framework**. This will be installed in `/Library/Frameworks` where pre-built binaries will look for it, if needed. This is why you need to install this version of R in order to make use of pre-built packages.

**R GUI** is a terminal-like environment created specifically for R. If you will be using [R Studio](https://www.rstudio.com) (highly recommended), you won't use **R GUI** very much. If you want to access R from a terminal session instead of the R GUI, stay tuned; this will be covered too.

Kick off the installation process by opening the package you just downloaded. When you get to the **Installation Type** make sure you select **Customize**.

**IMPORTANT:** You should NOT install **Tcl/Tk** and **Texinfo** if you plan on using `brew` as your package manager. These packages are installed to `/usr/local` and `brew doctor` (the diagnostics options that checks the validity of your brew installation) will complain about this.

> R 3.6.0 binary for OS X 10.11 (El Capitan) and higher, signed package. Contains R 3.6.0 framework, R.app GUI 1.70 in 64-bit for Intel Macs, Tcl/Tk 8.6.6 X11 libraries and Texinfo 5.2. The latter two components are optional and can be ommitted when choosing "custom install", they are only needed if you want to use the tcltk R package or build package documentation from sources.

{% include image.html url="/images/r-install-1.png" alt="R installation screen with Customize button" caption="Make sure to select Customize" %}

{% include image.html url="/images/r-install-2.png" alt="R installation screen with Customize options" caption="Unselect Tcl/Tk and Textinfo" %}

# Set some defaults
Before you start installing packages, you should think about where you will be saving all these packages as well as which CRAN mirror site you'll be downloading from.

- Default Library Paths - By default, packages you install will be saved to `/Library/Frameworks/R/...` and down a few more subfolders that you'll never remember! Also, if you ever have to do a clean reinstall of the R Framework, you'll have to reinstall all your packages too. I'd recommend you change this default.

- You should determine which CRAN mirror site is physically closest to you. This will improve your download times. If you don't set a default site, R will ask you to select one every time you want to install a package. Alternatively, you can select `0-Cloud [https]` which redirects you automatically to an appropriate site. Select `[https]` over `[http]` when you have a choice.

> 0-Cloud
>
> https://cloud.r-project.org/
>
> Automatic redirection to servers worldwide, currently sponsored by Rstudio

## R App
<!-- img src="/images/RLogo.png" srcset="/images/RLogo.png 1x, /images/RLogo@2x.png 2x" -->
{% include image.html url="/images/r-app-1.png" alt="R App's main window" caption="Launch R (via its app icon, spotlight, etc.)" %}
{% include image.html url="/images/r-app-2.png" alt="R App's Preferences window" caption="Open Preferences (⌘,) and select Startup" %}
{% include image.html url="/images/r-app-3.png" alt="R App's Startup Preferences window" caption="Configure default library path and CRAN mirror" %}

## Terminal
If accessing R from the terminal, the setup for these two options can be done in `~/.Rprofile`. If this file doesn't exist, create it and add the following lines:

```
# Default CRAN mirror
options(repos=structure(c(CRAN="https://cloud.r-project.org/")))

# Default library path
.libPaths(c("/Users/<username>/Library/R/<r-version>/library"))
```

NB:
1. I've set the CRAN mirror to be selected automatically but you can change the URL to a specific mirror if you wish
1. For the library path, replace `<username>` with your account username and `<r-version>` with the version of R you installed (I installed `3.6`)
1. You can use any path you want for the default library path but since the R App forces you to use this one, you might want to stick with it if you're using R via both the R app and the terminal.
1. Upon restarting the R app, this directory will be created if it doesn't exist
1. On some R installations, if you want to preserve the system library path, you'll need to re-include it: `.libPaths(c("my-lib-path", .libPaths()))`

If you are not using the R app, you will need to make sure that the path you specify exists. For example,

```
mkdir -p ~/Library/R/3.6/library
```

## R from your zsh shell
If you are using the zsh shell, `r` may already be reserved for re-running your last command. Since you can also do this with `!!` or by scrolling back through your history with the up-arrow key, you can disable this functionality and use it to launch R. In your `~/.zshrc` file:

```{zsh}
disable r
alias r="/Library/Frameworks/R.framework/Versions/Current/Resources/bin/R"
alias R=r
```

Now you can use both `r` and `R` to invoke R.

# Homebrew & Xcode Command Line Tools
From this point, you should be able to use `brew` to install everything else. You can find installation instructions on the [official site](https://brew.sh).

Installing `brew` will also install the Xcode Command Line Tools if not already installed.

# SDK Header Files, LLVM & GCC
There are times when you'll want to or need to build from source. For instance, if you're installing from a repository whose package only has source code, or if the source code is more recent than the binary version, R (by default) will build from source.

## SDK Header Files

With Xcode 10, the command line tools no not install the SDK header files anymore.

> The command line tools will search the SDK for system headers by default. However, some software may fail to build correctly against the SDK and require macOS headers to be installed in the base system under /usr/include.

For building R packages, you will need to install these SDK header files.

```
$ open /Library/Developer/CommandLineTools/Packages/macOS_SDK_headers_for_macOS_10.14.pkg
```

See the [Xcode release notes](https://developer.apple.com/documentation/xcode_release_notes/xcode_10_release_notes#3035624) for more information.

## LLVM
The Apple-supplied version of the LLVM compiler (`clang`) doesn't include support for OpenMP. Install the latest from brew:
```
$ brew install llvm libomp
```

Now test your installation against OpenMP. Create a file called `omptest.c`:

```{c}
#include <stdlib.h>
#include <stdio.h>
#include <omp.h>

int main() {
  #pragma omp parallel num_threads(4)
  {
    printf("Hello from thread %d, nthreads %d\n", omp_get_thread_num(), omp_get_num_threads());
  }
  return EXIT_SUCCESS;
}
```

And try to build and run it:

```
$ LDFLAGS="-L/usr/local/opt/llvm/lib"
$ CPPFLAGS="-I/usr/local/opt/llvm/include"
$ /usr/local/opt/llvm/bin/clang -fopenmp omptest.c -o omptest
$ ./omptest

Hello from thread 3, nthreads 4
Hello from thread 0, nthreads 4
Hello from thread 2, nthreads 4
Hello from thread 1, nthreads 4
```

## GCC
The GNU compiler collection includes `gfortran` which is sometimes needed. Install gcc without multilib (cross platform) support so that openmp support is possible.

```
$ brew install gcc --without-multilib
```

You no longer need to include `--without-multilib` on 64-bit-only systems as it is automatically disabled but it doesn't hurt to add it.


# Configure R to use LLVM & GCC

To configure R to build packages with the versions of `clang` and `gcc` you just installed, set up a `Makevars` file. This must be located at `~/.R/Makevars`. I've crafted this file from Internet research and some trial & error and have included some reference links in case you're interested.

<script src="https://gist.github.com/ryanhomer/efad63c28827763822068a3f09012b19.js"></script>

# Install R Studio

```
$ brew cask install rstudio
```

# XQuartz & X11

It is possilbe to get X11-related warnings or erros when installing packages or loading other R libraries.

```
Warning message:
In doTryCatch(return(expr), name, parentenv, handler) :
  unable to load shared object '/Library/Frameworks/R.framework/Resources/modules//R_X11.so':
  dlopen(/Library/Frameworks/R.framework/Resources/modules//R_X11.so, 6): Library not loaded: /opt/X11/lib/libSM.6.dylib
  Referenced from: /Library/Frameworks/R.framework/Resources/modules//R_X11.so
  Reason: image not found
```

If at any point you need to install X11:

```
brew cask install xquartz
```

# Time Machine

I find it unnecessary to back up installed packages to Time Machine, both from brew and R. In the event of a system restore, these packages are very easy to re-install. You can add the following exclusions to Time Machine, either via the Time Machine GUI settings or from the command line:

```
$ sudo tmutil -p addexclusion /Users/<username>/Library/R/3.6/library
$ sudo tmutil -p addexclusion /usr/local
```

If you find Time Machine is still very busy after installing packages, you may need to prevent Spotlight from indexing these folders as well.

Happy R...ing!
