---
layout: page
title: Photography
nav_html: '<span class="lang-en-only">Photography</span><span class="lang-zh-only">摄影</span>'
permalink: /photography/
nav: true
nav_order: 5
description: '<span class="lang-en-only">A few frames I have taken — light, cities, and quiet moments away from the lab.</span><span class="lang-zh-only">一些我拍下的画面——光线、城市，和实验室之外的安静时刻。</span>'
---

<div class="photo-gallery" data-reveal>
  {% assign photos = "photo-01,photo-02,photo-03,photo-04,photo-05,photo-06,photo-07,photo-08,photo-09,photo-10,photo-11,photo-12,photo-13,photo-14,photo-15" | split: "," %}
  {% for photo in photos %}
    {% capture photo_path %}assets/img/photography/{{ photo }}.jpg{% endcapture %}
    <figure class="photo-item">
      {% include figure.liquid loading="lazy" path=photo_path class="img-fluid" zoomable=true alt="Photograph by HE Tianlun" %}
    </figure>
  {% endfor %}
</div>
