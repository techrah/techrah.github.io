---
layout: post
title: "Calculating Confidence Intervals in R"
summary: "A brief overview of calculating confidence intervals in R"
image: "/images/errrorbar.png"
date: 2020-05-17
categories: [stats, r-lang]
---
Confidence intervals show up _everywhere_ in statistics. They allow us to express estimated values from sample data with some degree of confidence by providing an interval likely to contain the true population parameter we're trying to estimate. There are several ways to calculate them, depending on the context.

This article is about the general case of confidence intervals for sample estimates and how to calculate them in R. I will not talk about _plus four_ confidence intervals, confidence intervals for mean or individual responses, etc. It is also not intended to explain in detail what a confidence interval is or the statistical theory behind it.

## Confidence Intervals for Proportions, M.I.A.

Most of the time, you'll probably write your own code for calculating confidence intervals for proportions since you'll typically have just two values, a sample size (\\(n\\)) and sample proportion (\\(\hat{p}\\)). However, if you have a data frame with a categorical variable, you can leverage built-in R functions.

Let's consider [a Gallup poll from October 2010][1] in which U.S. adults were asked "Generally speaking, do you believe the death penalty is applied fairly or unfairly in this country today?" The sample size is not listed on the website but according to STATS: Data and Models (Voeux, 2019), it was 510. The poll results were as follows (percentages add up to 101% due to rounding error):

Fairly|Unfairly|No opinion
:-:|:-:|:-:
58%|36%|7%

Given the above data, what is the 95% confidence interval for the proportion of U.S. adults that believed the death penalty was applied fairly when that poll was taken?

With appropriate assumptions and conditions, the sampling distribution of a proportion is normally distributed so we use a critical value (\\(z^*\\)) of the standard normal distribution to determine how many standard errors to consider for each side of the confidence interval (CI). Ninety-five percent of the standard normal distribution lies between the critical values -1.96 to 1.96. This is a well-known approximation but I will use a more precise value in my calculations in order to compare them with results from some R functions that calculate CIs.

From the Gallup poll, we have: \\(n=510\\) and \\(\hat{p}=0.58\\). Here is some R code that calculates the interval, using `SE` for _standard error_, `ME` for _margin of error_ and `z_star` for _Z critical value_.

```r
> library(glue)
>
> n <- 510
> p <- 0.58
>
> SE <- sqrt(p * (1 - p) / n)
> z_star <- qnorm(1 - (1 - 0.95) / 2)
> ME <- z_star * SE
>
> glue("({p - ME}, {p + ME})")
```
```
(0.537164716561037, 0.622835283438962)
```

Let's do this using R's built-in `confint` and `lm`.

```r
sample <- c(rep(1, .581*n), rep(0, .42*n))
confint(lm(sample ~ 1), level = 0.95)
```
```
                2.5 %    97.5 %
(Intercept) 0.5374182 0.6233661
```

A few things to note:

You may have noticed that I used `0.581` instead of `0.58`. More on that later. You may have also noticed that the values are close to what we previously calculated "by hand" but not the same. There's more than one reason for this. First, I'll explain what I did, then point out the differences with this method.

I used `confint` to calculate the confidence intervals. The first parameter to `confint` is a fitted model object. Since I fitted an `lm` model, R invokes the appropriate version of `confint` that's available for `lm` objects, namely `confint.lm`. This fact is not too important; it just means that the behaviour of `confint` can change depending on the fitted model. So, in order to fit an `lm` model, I created a vector with 510 entries, 58% of them being ones, the rest zeros. The formula `sample ~ 1` represents a null model. This allows a response with no predictors and has some interesting properties.

```r
> summary(lm(sample ~ 1))
```
```
Call:
lm(formula = sample ~ 1)

Residuals:
    Min      1Q  Median      3Q     Max
-0.5804 -0.5804  0.4196  0.4196  0.4196

Coefficients:
            Estimate Std. Error t value Pr(>|t|)
(Intercept)  0.58039    0.02187   26.53   <2e-16 ***
---
Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1

Residual standard error: 0.494 on 509 degrees of freedom
```

The estimate of this model is the expected value of the ones and zeros, `0.58039` (not exactly 58% but close enough) and the residual standard error of `0.02187` is very close to the standard error we previously calculated:

```r
> SE
```
```
[1] 0.02185514
```

So why are the calculations from `confint` and `lm` slightly off? Well, for one, it's not possible to split 510 into exactly 58% and 42% so our original calculations introduced some rounding error. I also used `0.581` to ensure that I ended up with 510 elements in the `sample` vector and a proportion of ones as close to 58% as possible.

Another difference is that calculations in `lm` are based on the t-distribution. The differences between the normal and t-distributions are negligible for large sample sizes and even for our sample size of 510, it didn't affect our confidence interval for the first 3 decimal places.

Let's try to reproduce what `confint` and `lm` did.

```r
> p <- mean(sample)
> SE <- sd(sample) / sqrt(n)
> t_star <- qt(1 - (1 - 0.95)/2, df = n - 1)
> ME <- t_star * SE
> glue("({p - ME}, {p + ME})")
```
```
(0.537418167397406, 0.623366146328085)
```

This is the same confidence interval that `confint` returned. Finally, let's redo our original calculations based on the more precise value of \\(\hat{p}\\) from the data (as calculated above).

```r
SE <- sqrt(p * (1-p) / n)
z_star <- qnorm(1 - (1 - 0.95) / 2)
ME <- z_star * SE
glue("({p - ME}, {p + ME})")
```
```
(0.537562403935917, 0.623221909789574)
```

Still only the same up to 3 decimal places. Something to think about if you decide to use `confint` with `lm` when dealing with proportions.

## broom::tidy

The `tidy` function from the `broom` package can also calculate confidence intervals. It functions very similarly to `confint` in that it can handle different types of objects. We'll use `lm` again to compare.

```r
(summary <- broom::tidy(lm(sample ~ 1), conf.int = TRUE, conf.level = 0.95))
```
```
# A tibble: 1 x 7
  term        estimate std.error statistic  p.value conf.low conf.high
  <chr>          <dbl>     <dbl>     <dbl>    <dbl>    <dbl>     <dbl>
1 (Intercept)    0.580    0.0219      26.5 4.78e-98    0.537     0.623
```

Since we can only see to 3 d.p. it's not obvious whether the calculations are based on the normal or t-distribution but it's the latter.

```r
summary$conf.low; summary$conf.high
```
```
[1] 0.5374182
[1] 0.6233661
```

## The End

This blog post was originally intended to define confidence intervals and their nuances, discuss different types of confidence intervals, as well as bootstrapping confidence intervals for non-normally distributed data. However, as I came across many articles on the Intenet that did a good job of explaining confidence intervals, I decided to focus on R. Over the last eight months of doing anaylses in R, I had in my mind that there were many different packages and functions that I used for CI calculations in R. After going through all my past notebooks while writing this article, I realized that while I calculated many CIs, they were mostly based on `confint` and `broom::tidy`. The `conf.int` parameter showed up in two other places, `quantile` and `autoplot` but only when using specific packages that dealt with survival analysis and time series. I thought I'd share this, in case you felt the article was a bit short and less than satisfying. :)

## Reference

De Veaux, R.D., P.F. Velleman, D.E. Bock, A.M. Vukov, and A.C.M. Wong. 2018. _Stats: Data and Models, Third Canadian Edition_. Pearson Education Canada. [https://books.google.ca/books?id=muxnswEACAAJ][2].

[1]: https://news.gallup.com/poll/1606/death-penalty.aspx
[2]: https://books.google.ca/books?id=muxnswEACAAJ
