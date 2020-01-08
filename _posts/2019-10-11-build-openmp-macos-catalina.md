---
layout: post
title: "Building with OpenMP on macOS 10.15 Catalina"
summary: "Getting macOS Catalina, macOS SDK, R and OpenMP to work together in unison"
image: "/images/r-logo-inset-2.png"
date: 2019-10-11
categories: [r-lang, macOS, OpenMP]
---
UPDATE: This article has been superseded by [Setting up R on macOS 10.15 Catalina (Complete Guide)](./build-openmp-macos-catalina-complete)
<hr>
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

### C/C++

Now, try building from R. A good test is the `data.table` package. Uninstall it first, if it's already installed.

    remove.packages("data.table")

Then, install it from source:

    install.packages("data.table", type = "source")

If R installs it without error, you're back in business. However, you should reinstall this package from the CRAN binaries unless you have a good reason not, so that you get optimal performance.

<a href="#fortran" />
### Fortran

You can also test to make sure your configuration can build Fortran code against the OpenMP libraries by installing an appropriate R package, e.g.: `bayesQR`.

```
> install.packages("bayesQR", type = "source")
Installing package into ‘/Users/ryan/Library/R/3.6/library’
(as ‘lib’ is unspecified)
trying URL 'https://mirror.its.sfu.ca/mirror/CRAN/src/contrib/bayesQR_2.3.tar.gz'
Content type 'application/x-gzip' length 34011 bytes (33 KB)
==================================================
downloaded 33 KB

* installing *source* package ‘bayesQR’ ...
** package ‘bayesQR’ successfully unpacked and MD5 sums checked
** using staged installation
** libs
/usr/local/opt/gcc/bin/gfortran  -fPIC  -Wall -g -O2  -fopenmp -c  QRb_AL_mcmc.f95 -o QRb_AL_mcmc.o
/usr/local/opt/gcc/bin/gfortran  -fPIC  -Wall -g -O2  -fopenmp -c  QRb_mcmc.f95 -o QRb_mcmc.o
/usr/local/opt/gcc/bin/gfortran  -fPIC  -Wall -g -O2  -fopenmp -c  QRc_AL_mcmc.f95 -o QRc_AL_mcmc.o
/usr/local/opt/gcc/bin/gfortran  -fPIC  -Wall -g -O2  -fopenmp -c  QRc_mcmc.f95 -o QRc_mcmc.o
/usr/local/opt/gcc/bin/gfortran  -fPIC  -Wall -g -O2  -fopenmp -c  setseed.f95 -o setseed.o
/usr/local/opt/llvm/bin/clang -dynamiclib -Wl,-headerpad_max_install_names -undefined dynamic_lookup -single_module -multiply_defined suppress -L/Library/Frameworks/R.framework/Resources/lib -L /usr/local/opt/llvm/lib -L /usr/local/opt/gettext/lib -L /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/lib -o bayesQR.so QRb_AL_mcmc.o QRb_mcmc.o QRc_AL_mcmc.o QRc_mcmc.o setseed.o -L/Library/Frameworks/R.framework/Resources/lib -lRlapack -L/Library/Frameworks/R.framework/Resources/lib -lRblas -L/usr/local/opt/gcc/lib/gcc/9/ -lm -L/usr/local/opt/gcc/lib/gcc/9/ -lm -F/Library/Frameworks/R.framework/.. -framework R -Wl,-framework -Wl,CoreFoundation
installing to /Users/ryan/Library/R/3.6/library/00LOCK-bayesQR/00new/bayesQR/libs
** R
** data
** inst
** byte-compile and prepare package for lazy loading
** help
*** installing help indices
** building package indices
** testing if installed package can be loaded from temporary location
** checking absolute paths in shared objects and dynamic libraries
** testing if installed package can be loaded from final location
** testing if installed package keeps a record of temporary installation path
* DONE (bayesQR)

The downloaded source packages are in
  ‘/private/var/folders/lh/llhz03f121l_0hns2j1d9jj00000gn/T/RtmpqTk4No/downloaded_packages’
```

## Conclusion

So far, Catalina hasn't been a major disruption to the R workflow as far as I can tell, even though each new version of macOS and Xcode usually breaks something. For now, crisis averted. And while I always like to keep my R setup configured to build from source just in case, I always advocate installing from binaries when possible.

[1]: r-on-macos-for-data-scientists
[2]: https://developer.apple.com/documentation/xcode_release_notes/xcode_10_release_notes#3035624
[3]: r-on-macos-for-data-scientists#llvm
