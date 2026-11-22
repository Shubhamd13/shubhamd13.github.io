---
layout: page
title: Quotes
permalink: /quotes/
nav: false
description: Math facts that double as life advice, and a few things mathematicians said. Each one links to where it comes from.
---

{% assign theorems = site.data.quotes | where: "kind", "theorem" %}
{% assign people = site.data.quotes | where: "kind", "person" %}

<div class="quotes-page">
  <h2>Theorems, read as life advice</h2>
  {% for q in theorems %}
    {% include quote_card.liquid q=q %}
  {% endfor %}

  <h2>From mathematicians</h2>
  {% for q in people %}
    {% include quote_card.liquid q=q %}
  {% endfor %}
</div>
