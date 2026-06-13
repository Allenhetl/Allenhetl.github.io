---
layout: page
title: '<span class="lang-en-only">Omnidirectional Autonomous Wheelchair</span><span class="lang-zh-only">全向自主移动轮椅</span>'
description: '<span class="lang-en-only">Team-led Year-2 project — rudder-wheel chassis with LiDAR-based autonomous navigation.</span><span class="lang-zh-only">Year 2 团队负责人项目 — 舵轮底盘 + 激光雷达自主导航。</span>'
img: assets/img/projects/year-project/轮椅展示图.jpg
card_pos: center 42%
importance: 2
category: year-project
timeframe: 2024.09 – 2025.06
---

<div class="lang-en-only" markdown="1">
Year-2 design project (ISDN2002, Sep 2024 – Aug 2025): an **omnidirectional autonomous wheelchair**.

I designed the **self-developed steering-wheel modules** and the **per-wheel kinematics solver**. The solver resolves each wheel's motion vector from the chair's target velocity while minimizing steering deviation and tire wear. The wheelset went through two generations — a first-gen rocker suspension that was weak under load, replaced by a **straight-tiller** second generation with higher load capacity — using optical-gate feedback, a topology-optimized structure, and LiDAR-based obstacle avoidance in collaboration with the navigation team.

</div>

<div class="lang-zh-only" markdown="1">
Year 2 项目（ISDN2002，2024.09 – 2025.08）：**全向自主移动轮椅**。

我负责**自研舵轮模块**与**逐轮运动学解算**设计。解算器根据轮椅目标速度求解每个轮的运动矢量，同时最小化转向偏差与轮胎磨损。轮组历经两代——第一代摇臂悬挂承载不足，第二代改为**直立舵柄**结构以提升承载与输出——采用光电门反馈、拓扑优化结构，并与导航组合作实现激光雷达自主避障。

</div>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/year-project/轮椅展示图.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/year-project/轮组爆炸图.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Left: full platform. Right: wheel module exploded view.</span><span class="lang-zh-only">左：轮椅整机；右：轮组爆炸图。</span></div>
