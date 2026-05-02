---
layout: page
title: Projects
nav_html: '<span class="lang-en-only">Projects</span><span class="lang-zh-only">项目</span>'
permalink: /projects/
description: Selected research and engineering projects.
nav: true
nav_order: 3
display_categories: [robomaster, coursework, year-project]
horizontal: false
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  {% assign cat_label = category %}
  {% case category %}
    {% when "robomaster" %}{% assign cat_label = '<span class="lang-en-only">RoboMaster</span><span class="lang-zh-only">RoboMaster</span>' %}
    {% when "coursework" %}{% assign cat_label = '<span class="lang-en-only">Coursework</span><span class="lang-zh-only">课设</span>' %}
    {% when "year-project" %}{% assign cat_label = '<span class="lang-en-only">Year Project</span><span class="lang-zh-only">学年项目</span>' %}
  {% endcase %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ cat_label }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  {% assign card_count = sorted_projects | size %}
  {% if card_count == 1 %}
    {% assign row_classes = "row-cols-1 row-cols-md-1" %}
  {% elsif card_count == 2 %}
    {% assign row_classes = "row-cols-1 row-cols-md-2" %}
  {% elsif card_count == 3 %}
    {% assign row_classes = "row-cols-1 row-cols-md-3" %}
  {% else %}
    {% assign row_classes = "row-cols-1 row-cols-md-2 row-cols-lg-3" %}
  {% endif %}
  <div class="row {{ row_classes }} project-grid">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
