---
layout: project
title: '<span class="lang-en-only">Rudder-wheel Infantry</span><span class="lang-zh-only">舵轮步兵</span>'
description: '<span class="lang-en-only">Steering-wheel-driven infantry chassis.</span><span class="lang-zh-only">舵轮驱动步兵底盘。</span>'
img: assets/img/projects/RoboMaster/舵轮步兵.JPG
card_pos: center 56%
importance: 5
category: robomaster
timeframe: 2024 – 2025
project_status: completed
project_role:
  en: "Mechanical Contributor"
  zh: "机械设计参与"
project_focus:
  en: "Swerve steering · Turret–chassis interface"
  zh: "舵轮转向 · 云台–底盘接口"
hero_fit: contain
hero_pos: center 56%
hero_zoom: 1.85
hero_alt: Built rudder-wheel infantry robot
---

<div class="lang-en-only" markdown="1">
**Rudder-wheel (swerve-drive) infantry** — each wheel is independently steered for omnidirectional motion and tight in-place rotation. It shares a **modular goose-neck turret** with the serial-leg platform through standardized interfaces — a deliberate cross-platform reuse that cut the mechanical team's workload.

The low-inertia turret runs **DM4310** motors on both axes: a formula-sized synchronous belt on Yaw (RA5008 crossed-roller bearing) and a **backlash-free Pitch with no gravity compensation** for crisp vision tracking. It detaches from the chassis via six XT30 connectors and six screws for rapid field maintenance. I worked on the rudder-wheel steering system and the turret–chassis interface (open-sourced).

</div>

<div class="lang-zh-only" markdown="1">
**舵轮（全向）步兵**——每个轮独立转向，实现全向运动与原地旋转。它通过标准化接口与串联腿平台**共用模块化鹅颈云台**——这一跨平台复用刻意降低了机械组的工作量。

低惯量云台两轴均用 **DM4310** 电机：Yaw 采用按公式定长的同步带（RA5008 交叉滚子轴承），Pitch **不做重力补偿、消除回差**以保证视觉跟踪的灵敏。云台可通过 6 个 XT30 接头与 6 颗螺丝与底盘快速分离，便于场边维护。我负责舵轮转向系统与云台–底盘接口（已开源）。

</div>
