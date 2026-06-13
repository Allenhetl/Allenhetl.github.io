---
layout: page
title: '<span class="lang-en-only">Dual-head Sentry</span><span class="lang-zh-only">双头哨兵</span>'
description: '<span class="lang-en-only">Twin-turret sentry variant — newest iteration.</span><span class="lang-zh-only">双炮塔哨兵新一代 — 最新迭代。</span>'
img: assets/img/projects/RoboMaster/双头哨兵.png
card_pos: center 48%
importance: 4
category: robomaster
timeframe: 2025
---

<div class="lang-en-only" markdown="1">
A sentry stands guard over the team's base and fights fully autonomously — no driver — so as **mechanical gimbal lead** I built it with redundancy in its DNA: a **twin-head architecture** with two small-yaw turrets, two loaders, and two onboard NUCs, so the robot can track and suppress two threats at once while keeping a spare set of eyes and brains. The 9,010 g gimbal rides on an aluminium-extrusion frame stiffened with 2 mm carbon-fibre side plates, with 6020 brushless motors on the turret axes, an M2006 P36 in the loader, and a Mid-360 LiDAR for perception.

A sentry only earns its keep if it never jams under fire. The loader pairs a Martin selector and a 0.8 mm stainless blade with a 7 cm firing module — limiting bearings, UV ammo detection, dual microswitches — tuned for **zero jams across 1,000 continuous shots** at a ~28 ± 2 m/s muzzle velocity. Every module pops off for field repair in minutes (large yaw 5, small yaw 5, loader 10, NUC 3), and after two SSDs cooked themselves mid-competition I reworked the thermals around them: a 60 °C-tolerant PETG-CF nylon housing and offset dual-NUC airflow. Across the V1.0 → V1.4 iterations the platform shed about 2 kg to a 27.9 kg fighting weight.

</div>

<div class="lang-zh-only" markdown="1">
哨兵要守在战队基地、全自主作战——没有操作手——所以作为**机械云台负责人**，我从设计之初就把冗余刻进它的骨架：采用**双头架构**，两个小 Yaw 炮塔、两套拨弹、两台车载 NUC，让它能同时跟踪并压制两个威胁，还始终保有一套备用的"眼睛"和"大脑"。9,010 g 云台基于铝型材框架、辅以 2 mm 碳纤维侧板加强；炮塔轴用 6020 无刷电机，拨弹用 M2006 P36，感知配 Mid-360 激光雷达。

哨兵唯有在火力全开时绝不卡弹才算合格。拨弹系统将马丁拨盘 + 0.8 mm 不锈钢拨片与 7 cm 发射模块（限位轴承、UV 弹丸检测、双微动开关）配合调校，目标是 **连续 1,000 发零卡弹**，枪口初速约 28 ± 2 m/s。各模块都能在几分钟内拆下场边维修（大 Yaw 5 分钟、小 Yaw 5 分钟、拨弹 10 分钟、NUC 3 分钟）；在比赛中烧毁两块 SSD 之后，我围绕它们重做了散热：改用耐 60 °C 的 PETG 碳纤维尼龙罩 + 双 NUC 错位排风。历经 V1.0 → V1.4 迭代，整机减重约 2 kg，作战重量降至 27.9 kg。

</div>

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/双头哨兵.png" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/双头哨兵渲染.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Left: the built sentry. Right: team render.</span><span class="lang-zh-only">左：实机；右：战队渲染图。</span></div>
