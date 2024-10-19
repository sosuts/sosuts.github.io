---
title: "About This Website"
meta_title: "About This Website"
description: ""
draft: false
published: "2024-10-10"
author: "Sosuke Utsunomiya"
---

### Why I Created This Website

I decided to create this blog because I thought it would be nice to have a place to share my thoughts and experiences. I've often been helped by anonymous blog posts and tweets, so I'd be happy if I could help someone else in return. Of course, I also want to keep a record of my own learning. I'll be taking it easy and enjoying the process!

### Blog Content

In this blog, I'll mainly write about the following topics:
- Software
- Data Analysis
- Troubleshooting and Solutions
- Everyday Life

### Technologies Used

#### SSG

I created this site using the static site generator [Hugo](https://gohugo.io/). I was surprised at how easy it was to set up.

#### Design

The design is based on [Hugoplate](https://github.com/zeon-studio/hugoplate), customized to my liking. The [Home page]({{< relref "../_index.md" >}}) design is inspired by the popular [Academic](https://github.com/HugoBlox/theme-academic-cv) theme, and I used Tailwind CSS for styling. The colors for dark mode are inspired by [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme).

#### Code Management and Hosting

The source code is available at [sosuts/sosuts.github.io](https://github.com/sosuts/sosuts.github.io). The site is hosted on [Netlify](https://www.netlify.com/). When I push to the main branch, it automatically builds and publishes the site. The repository is named sosuts.github.io because it was originally hosted on GitHub Pages. I should probably change it, but I've just left it as is. GitHub Pages worked fine, but I switched to Netlify to use Netlify functions for creating web APIs, so I wanted to keep everything on the same platform.
