---
layout: page
title: LaTeX for Data Science
permalink: /data-science/latex-for-data-science/
nocomments: true
last_updated: 2018-12-25
---
|Category |Description | LaTeX | Result|
|:---|:---|:---|:---|
|Matrices|Using brackets|`\begin{bmatrix} 1 && 2 \\ 3 && 4 \end{bmatrix}`|\\[\begin{bmatrix} 1 && 2 \\\\ 3 && 4 \end{bmatrix}\\]
||Using parentheses|`\begin{pmatrix} 1 && 2 \\ 3 && 4 \end{pmatrix}`|\\[\begin{pmatrix} 1 && 2 \\\\ 3 && 4 \end{pmatrix}\\]|
||Determinant of a matrix|`\begin{vmatrix} 1 && 2 \\ 3 && 4 \end{vmatrix}`|\\[\begin{vmatrix} 1 && 2 \\\\ 3 && 4 \end{vmatrix}\\]|
||Dot product|`x \cdot y`|\\[x \cdot y\\]|
|Vectors|A column vector, same as \\(n \times 1\\) matrix|`\begin{pmatrix} 1 \\ 2 \\ 3 \\ 4 \end{pmatrix}`|\\[\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\\\ 4 \end{pmatrix}\\]|
||Vector notation|`A \vec{x} = \vec{b}`|\\[A\vec{x} = \vec{b}\\]|
|||`A \hat{x} = \hat{b}`|\\[A\hat{x} = \hat{b}\\]|
|||`A \mathbf{x} = \mathbf{b}`|\\[A\mathbf{x} = \mathbf{b}\\]|
|General&nbsp;Math|Fractions|`\frac{m}{n}`|\\[\frac{m}{n}\\]|
|||`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`|\\[x=\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\\]|
||Superscript|`e^x`|\\[e^x\\]|
||Subscript|`log_{10} x`|\\[log_{10} x\\]|
||Multiplication|`x \times y`|\\[x \times y\\]|
||Set of Real numbers|`\vec{b} \in \R^3`|\\[\vec{b} \in \R^3\\]|
||Blackboard Bold, e.g.: Real|`\vec{b} \in \mathbb{R}^3`|\\[\vec{b} \in \mathbb{R}^3\\]|
||Sum|`\sum_{i=1}^{n} x_i^2`|\\[\sum_{i=1}^{n}x_i^2\\]|

**NOTE:** This site uses [KaTeX](https://katex.org/docs/supported.html) for LaTeX rendering. You may have to modify your LaTeX code slightly depending on your environment.
