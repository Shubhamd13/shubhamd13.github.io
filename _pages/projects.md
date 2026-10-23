---
layout: page
title: Projects
permalink: /projects/
description: Robotics and machine learning research, software I built from my own ideas, and coursework.
nav: true
nav_order: 3
display_categories: [work, fun]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% include projects_section.liquid repos=site.data.repositories.featured_repos id="research" cols=2 title="Research" subtitle="Robotics and machine learning projects from my M.S. at UC Riverside." %}
{% include projects_section.liquid repos=site.data.repositories.side_repos id="software" cols=2 title="Software &amp; side projects" subtitle="Full-stack apps that started as my own ideas." %}
{% include projects_section.liquid repos=site.data.repositories.coursework_repos id="coursework" title="Coursework" subtitle="Lab assignments and course notebooks from my M.S. and B.E." %}
</div>
