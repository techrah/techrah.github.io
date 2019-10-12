---
layout: post
title: "Building with OpenMP on macOS 10.15 Catalina"
summary: "Getting macOS Catalina, macOS SDK, R and OpenMP to work together in unison"
image: "/images/r-logo-inset-2.png"
date: 2019-06-16
categories: [r-lang, macOS, OpenMP]
---
In my previous post [Setting up R for Minimal Code Compilation and Maximum Speed][1], I discussed in detail how to set up R so that when you build from source, you can build against the OpenMP library. I was using macOS 10.14 Mojave. With the release of macOS Catalina, something had to break, right?

When Apple released Xcode 10, the [release notes][2] included a workaround for compilers that were looking for header files at `/usr/include`. It also came with a warning that in a future release, it would no longer be provided.

> The command line tools will search the SDK for system headers by default. However, some software may fail to build correctly against the SDK and require macOS headers to be installed in the base system under /usr/include. If you are the maintainer of such software, we encourage you to update your project to work with the SDK or file a bug report for issues that are preventing you from doing so. As a workaround, an extra package is provided which will install the headers to the base system. In a future release, this package will no longer be provided.

True to Apple, without much delay, the workaround is gone. `/usr/include` is no longer allowed, which is where `clang` searches for header files by default. But fear not, after some trial and error, with a few configuration changes, you can get back on track.

## Install Command Line Tools

If you have Xcode already installed, you should not need to install the Command Line Tools separately as Xcode already includes them. Otherwise, you can install them like this:

    xcode-select --install

You can always check to see if they are already installed first:

    xcode-select --print-path

## Test OpenMP with Clang

Ensure `clang` knows where to find the macOS SDK. You can include something like this in your `~/.bash_profile` (if you use bash) or `~/.zshrc` file (if you use zsh). Note that Catalina's default shell is now Zsh.

    XCBASE=`xcrun --show-sdk-path`
    export C_INCLUDE_PATH=$XCBASE/usr/include
    export CPLUS_INCLUDE_PATH=$XCBASE/usr/include
    export LIBRARY_PATH=$XCBASE/usr/lib

As before, test to make sure you can build a [small test program that uses multiple cores via OpenMP][3].

## OpenMP from R

I've also updated my Makevars script so that `clang` can find the macOS SDK header files. Adjust your `~/.R/Makevars` file accordingly.

<script src="https://gist.github.com/ryanhomer/efad63c28827763822068a3f09012b19.js"></script>

Now, try building from R. A good test is the `data.table` package. Uninstall it first, if it's already installed.

    remove.packages("data.table")

Then, install it from source:

    install.packages("data.table", type = "source")

If R installs it without error, you're back in business. However, you should reinstall this package from the CRAN binaries unless you have a good reason not, so that you get optimal performance.

[1]: r-on-macos-for-data-scientists
[2]: https://developer.apple.com/documentation/xcode_release_notes/xcode_10_release_notes#3035624
[3]: r-on-macos-for-data-scientists#llvm
