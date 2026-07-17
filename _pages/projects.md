---
layout: page
title: Projects
permalink: /projects/
description: Selected robotics and machine learning projects.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.data.repositories.featured_repos %}
  <a id="featured-repos" href=".#featured-repos">
    <h2 class="category">Featured repositories</h2>
  </a>
  <div class="row row-cols-1 row-cols-md-3">
    {% for repo in site.data.repositories.featured_repos %}
      {% include projects_repo.liquid repo=repo %}
    {% endfor %}
  </div>
{% endif %}
</div>
