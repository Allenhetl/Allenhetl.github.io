---
layout: project
title: '<span class="lang-en-only">Rudder-wheel Infantry</span><span class="lang-zh-only">舵轮步兵</span>'
description: '<span class="lang-en-only">Steering-wheel-driven infantry chassis with a shared modular turret.</span><span class="lang-zh-only">采用独立舵轮与共享模块化云台的步兵机器人。</span>'
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
  en: "Swerve steering · Turret-chassis interface"
  zh: "舵轮转向 · 云台-底盘接口"
hero_fit: contain
hero_pos: center 56%
hero_zoom: 1.85
hero_alt: Built rudder-wheel infantry robot
---

<h3 id="problem"><span class="lang-en-only">Problem</span><span class="lang-zh-only">问题</span></h3>

<div class="lang-en-only" markdown="1">
The team needed an infantry platform that retained omnidirectional motion and tight in-place rotation while reducing duplicated mechanical work across chassis variants. The key systems question was therefore not only how to steer each wheel, but how to share the turret without creating a fragile custom interface.
</div>

<div class="lang-zh-only" markdown="1">
战队需要一台保留全向运动与紧凑原地旋转能力的步兵平台，同时减少不同底盘构型之间的重复机械开发。因此，系统问题不只是如何独立控制每个车轮，还包括如何复用云台而不引入脆弱的定制接口。
</div>

<h3 id="role-system"><span class="lang-en-only">Role &amp; System</span><span class="lang-zh-only">职责与系统</span></h3>

<div class="lang-en-only" markdown="1">
I contributed to the swerve steering system and the standardized turret-chassis interface. Each wheel is independently steered for omnidirectional motion. The low-inertia goose-neck turret is shared with the serial-leg platform: both axes use DM4310 motors, Yaw uses a formula-sized synchronous belt with an RA5008 crossed-roller bearing, and Pitch avoids gravity compensation to remove gearbox-backlash effects from visual tracking.
</div>

<div class="lang-zh-only" markdown="1">
我参与了舵轮转向系统与标准化云台-底盘接口设计。每个车轮均可独立转向，实现全向运动。低惯量鹅颈云台与串联腿平台共用：两轴均采用 DM4310 电机，Yaw 采用按公式定长的同步带与 RA5008 交叉滚子轴承，Pitch 不使用重力补偿，以避免减速箱回差影响视觉跟踪。
</div>

<h3 id="open-source-outcome"><span class="lang-en-only">Open-source Outcome</span><span class="lang-zh-only">开源成果</span></h3>

<div class="lang-en-only" markdown="1">
Six XT30 connectors and six screws separate the turret from the chassis, making the same module serviceable across two infantry architectures. The interface and related mechanical work were released with the team's open-source package. The project documents successful platform integration, but it does not include a controlled mobility benchmark; this page therefore avoids adding unsupported speed or accuracy claims.
</div>

<div class="lang-zh-only" markdown="1">
拔下 6 个 XT30 接头并拆除 6 颗螺丝即可分离云台与底盘，使同一模块可在两种步兵构型上维护和复用。接口与相关机械设计已随战队开源包发布。项目记录了完整平台集成，但没有受控机动性基准，因此本页不添加缺乏依据的速度或精度数据。
</div>
