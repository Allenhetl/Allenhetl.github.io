---
layout: project
title: '<span class="lang-en-only">Wheel-leg Infantry</span><span class="lang-zh-only">轮腿步兵</span>'
description: '<span class="lang-en-only">Serial-leg infantry mechanical system - RM2025 Best Knight.</span><span class="lang-zh-only">串联腿步兵机械系统 - RM2025 最佳骑士。</span>'
img: assets/img/projects/RoboMaster/轮腿定妆照.jpg
card_fit: contain
card_pos: center center
card_alt: Studio photograph of the HKUST serial-leg infantry robot
importance: 2
category: robomaster
timeframe: 2024 – 2025
project_status: completed
project_role:
  en: "Mechanical Lead"
  zh: "机械负责人"
project_focus:
  en: "Serial-leg mobility · Turret · Central feeder"
  zh: "串联腿运动 · 云台 · 中心供弹"
hero_fit: contain
hero_pos: center center
project_toc:
  - id: project-details
    en: Overview
    zh: 项目概览
  - id: problem
    en: Problem
    zh: 问题
  - id: role
    en: My Role
    zh: 我的职责
  - id: system
    en: System
    zh: 系统
  - id: validation
    en: Validation
    zh: 验证
---

<h3 id="problem"><span class="lang-en-only">Problem</span><span class="lang-zh-only">问题</span></h3>

<div class="lang-en-only" markdown="1">
RM2025 introduced a 20 cm road step, consecutive two-level steps, a tunnel, and a 43-degree slope while reducing each team from three infantry robots to two without reducing the total ammunition allocation. Our previous parallel five-bar wheel-leg concept was poorly matched to the new steps, so the team needed one robot that combined terrain access, a large ammunition reserve, and maintainable competition hardware.
</div>

<div class="lang-zh-only" markdown="1">
RM2025 新增了 20 cm 公路台阶、连续两级台阶、隧道和 43° 斜坡，同时将每队步兵数量从三台减为两台而不减少总载弹量。战队原有的并联五连杆轮腿难以适应新的台阶，因此需要一台同时兼顾地形通过性、大载弹量和赛场可维护性的机器人。
</div>

<h3 id="role"><span class="lang-en-only">My Role</span><span class="lang-zh-only">我的职责</span></h3>

<div class="lang-en-only" markdown="1">
I led the mechanical development across the serial-leg chassis, goose-neck turret, and central feeder, then integrated those subsystems with the embedded and vision teams. The team's open-source report assigns me 30% of the recorded contribution and identifies these three mechanical systems as my responsibility. The work covered architecture selection, CAD, component sizing, packaging, assembly, iteration, and release documentation.
</div>

<div class="lang-zh-only" markdown="1">
我负责串联腿底盘、鹅颈云台和中心供弹三部分的机械开发，并与嵌入式、视觉团队完成系统集成。战队开源报告将这三套机械系统明确列为我的职责，并记录我的贡献度为 30%。工作覆盖构型选择、CAD、元件选型与尺寸设计、空间布局、装配迭代和开源文档整理。
</div>

<h3 id="system"><span class="lang-en-only">System</span><span class="lang-zh-only">系统</span></h3>

<div class="lang-en-only" markdown="1">
The completed robot weighs **24.1 kg**: a 21 kg chassis and 3.1 kg turret. Its serial legs use **12 mm glass-fibre plate**, flange-bearing joints, an 800 mm maximum extension, and a **300 N air spring** to support the mechanism. M3508 wheel motors drive custom 3542/238 gearboxes. The modular aluminium frame packages power management, RFID, battery, and a feeder holding **more than 800 rounds**.

The low-inertia goose-neck turret uses DM4310 motors on Yaw and Pitch and shares standardized interfaces with another infantry platform. Its central feeder preloads three layers of ammunition and is documented at a stable **25 Hz** feed rate. Six XT30 connectors and six screws separate the turret from the chassis for field service.
</div>

<div class="lang-zh-only" markdown="1">
整车重量为 **24.1 kg**，其中底盘 21 kg、云台 3.1 kg。串联腿采用 **12 mm 玻璃纤维板**、法兰轴承关节、800 mm 最大伸展范围和 **300 N 气弹簧**支撑机构；轮电机为 M3508，并搭配自研 3542/238 减速箱。模块化铝型材车架集成电源管理、RFID、电池与可容纳 **800 发以上**的中心弹舱。

低惯量鹅颈云台的 Yaw 与 Pitch 均采用 DM4310 电机，并通过标准接口与另一款步兵平台复用。中心供弹预置三层弹丸，报告记录其可稳定达到 **25 Hz** 弹频。拔下 6 个 XT30 接头并拆除 6 颗螺丝即可分离云台与底盘，便于场边维护。
</div>

<h3 id="validation"><span class="lang-en-only">Validation</span><span class="lang-zh-only">验证</span></h3>

<div class="lang-en-only" markdown="1">
The open-source release includes real demonstrations of consecutive step crossing, tunnel passage, ramp traversal, center feeding, and auto-aim. It also records the final packaging dimensions, 24.1 kg mass, 800-plus-round capacity, and 25 Hz feeder operation. The robot received the team's **RM2025 Best Knight** award.

The report separately lists **80% ramp-jump stability** and **greater than 60% auto-aim hit rate** as design targets. It does not provide controlled result tables for those targets, nor for top speed or endurance, so this page does not present them as achieved measurements. The 43-degree slope is likewise a field requirement, not a verified result in the report.
</div>

<div class="lang-zh-only" markdown="1">
开源包包含连续台阶、过隧道、飞坡、中心供弹和自瞄的真实演示，并记录了整车尺寸、24.1 kg 重量、800 发以上容量和 25 Hz 供弹。该机器人获得战队的 **RM2025 最佳骑士**。

报告将**飞坡稳定性 80%**和**自瞄命中率大于 60%**分别列为设计目标，但没有提供对应的受控结果表，也没有给出最高速度或续航测试，因此本页不将这些目标写成已完成的实测结果。43° 斜坡同样属于赛场需求，而非报告中已经验证的结果。
</div>

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/轮腿最佳骑士.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="RM2025 Best Knight award record for the serial-leg infantry robot" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/轮腿尺寸图.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Orthographic mechanical drawing of the serial-leg infantry robot" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Best Knight award record and released mechanical dimensions.</span><span class="lang-zh-only">最佳骑士记录与开源机械尺寸图。</span></div>
