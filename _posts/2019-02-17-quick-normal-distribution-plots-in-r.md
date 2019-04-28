---
layout: post
title:  "Quick Normal Distribution Plots in R"
date:   2019-02-17
categories: [r-lang,stat]
---
Let's say you're writing up an R Notebook (or R Markdown file), you're figuring out distributions and you want to quicky show what area, probability or proportion you're talking about. It's typical to draw one out by hand when working on paper but if you're collaborating, it's easier to share an R Notebook. Although R is fully equipped for this, it took me an entire Saturday to plot something decent. So I decided to write and publish my first [R package](https://github.com/ryanhomer/eldar).

Since it's pending CRAN approval, for the time being, you can simply add the [`my_normal.R`](https://github.com/ryanhomer/eldar/blob/a126227276f7cbf7ffb140e6fb2ea2147c12b55e/R/my_normal.R) file to your R project or workspace and `source` it.

So now you can do a notebook like this in minutes:

{% raw %}
  <iframe
    frameborder="no"
    border="0"
    marginwidth="0"
    marginheight="0"
    width="100%"
    height="100%"
    src="../includes/eldar1.html"
    onLoad="this.style.height = 0;this.style.height=this.contentWindow.document.body.scrollHeight+'px'"
  ></iframe>
{% endraw %}
