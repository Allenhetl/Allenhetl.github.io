---
layout: project
title: '<span class="lang-en-only">Dual-head Sentry</span><span class="lang-zh-only">双头哨兵</span>'
description: '<span class="lang-en-only">2024 autonomous sentry with twin firing chains and a field-serviceable gimbal.</span><span class="lang-zh-only">2024 双发射链路自主哨兵与可快速维护云台。</span>'
img: assets/img/projects/RoboMaster/24壁纸/壁纸双头哨兵.jpg
card_fit: contain
card_pos: center center
card_alt: Team technical poster for the 2024 dual-head sentry robot
importance: 4
category: robomaster
timeframe: 2023 – 2024
project_status: completed
project_role:
  en: "Mechanical Gimbal Lead"
  zh: "机械云台负责人"
project_focus:
  en: "Twin firing chains · Modular maintenance"
  zh: "双发射链路 · 模块化维护"
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
An autonomous sentry has no operator to recover a jam or re-route a failed subsystem during a match. The design therefore had to support two firing chains, onboard perception and compute, continuous rotation, and repairs that the pit crew could complete within a short competition interval.
</div>

<div class="lang-zh-only" markdown="1">
自主哨兵在比赛中没有操作手处理卡弹或临时绕过故障，因此系统需要同时容纳两套发射链路、车载感知与算力、连续旋转结构，并让维修人员能在有限赛间时间内完成拆装。
</div>

<h3 id="role"><span class="lang-en-only">My Role</span><span class="lang-zh-only">我的职责</span></h3>

<div class="lang-en-only" markdown="1">
As mechanical gimbal lead, I was responsible for the sentry gimbal's design and assembly. The 2024 technical report records my contribution at 20%. I developed the small-Yaw modules, firing and loading interfaces, protective packaging, cable routing, and quick-release strategy, then tracked issues through the V1.0-V1.4 iterations with the chassis, embedded, and hardware owners.
</div>

<div class="lang-zh-only" markdown="1">
作为机械云台负责人，我负责哨兵云台的设计与装配，2024 技术报告记录我的贡献度为 20%。我完成了小 Yaw 模块、发射与供弹接口、防护外壳、走线和快拆策略，并与底盘、嵌入式和硬件负责人共同推进 V1.0-V1.4 的问题闭环。
</div>

<h3 id="system"><span class="lang-en-only">System</span><span class="lang-zh-only">系统</span></h3>

<div class="lang-en-only" markdown="1">
The architecture combines two independently mounted small-Yaw firing modules with a large-Yaw stage, two loaders, two NUC computers, and a Mid-360 LiDAR. The **9.01 kg gimbal** uses an aluminium-extrusion frame stiffened by 2 mm carbon-fibre side plates. Each lightweight small-Yaw shell combines 1 mm carbon plate with 72D TPU corner joints so the enclosure can absorb vibration and open with four screws.

The 7 cm firing module integrates guide bearings, UV illumination, and a switch in a carbon-fibre-reinforced nylon housing selected because PETG and ABS softened near the lamp's 60°C operating region. The report documents removal times of **5 minutes for large Yaw, 5 minutes for small Yaw, and 10 minutes for a loader**.
</div>

<div class="lang-zh-only" markdown="1">
系统由两套独立安装的小 Yaw 发射模块、大 Yaw 转台、两套 loader、两台 NUC 和 Mid-360 激光雷达组成。**9.01 kg 云台**采用铝型材框架，并由 2 mm 碳纤维侧板加强；轻量化小 Yaw 外壳则使用 1 mm 碳板与 72D TPU 角件，既能吸收振动，也能通过 4 颗螺丝快速打开。

7 cm 发射模块将导向轴承、紫外灯和开关集成在碳纤维增强尼龙外壳中；选择该材料是因为 PETG 与 ABS 在紫外灯约 60°C 的工作区域会软化。报告记录的拆装时间为：**大 Yaw 5 分钟、小 Yaw 5 分钟、loader 10 分钟**。
</div>

<h3 id="validation"><span class="lang-en-only">Validation</span><span class="lang-zh-only">验证</span></h3>

<div class="lang-en-only" markdown="1">
The report's acceptance targets were zero jams over 1,000 continuous rounds, muzzle speed near 28 m/s with no more than 2 m/s variation, and five-minute repair for most modules. Its test log documents loader and firing-module iteration, including a **0.8 mm stainless wear blade**, anti-jam reversal, and a thin-wall bearing added to reduce selector wobble. It does not contain a completed 1,000-round result table, so that number is presented as a target rather than an achieved result.

Recorded build evidence is stronger for packaging and iteration: V1.3 removed about **2 kg**, bringing the complete robot to **27.9 kg**, and V1.4 introduced the redesigned small-Yaw module and TPU corner structure. The final report confirms that the sentry operated and fired in competition, without attributing an unsupported quantitative combat result to the mechanism.
</div>

<div class="lang-zh-only" markdown="1">
报告给出的验收目标包括：连续 1,000 发零卡弹、枪口速度接近 28 m/s 且波动不超过 2 m/s，以及大多数模块 5 分钟内完成维修。测试记录展示了 loader 与发射模块的迭代，包括 **0.8 mm 不锈钢耐磨拨片**、卡弹回转和用于减小拨盘晃动的薄壁轴承；但报告没有附上完成 1,000 发测试的结果表，因此本页将其保留为目标，而不是已达成结果。

结构与迭代证据更完整：V1.3 减重约 **2 kg**，整车降至 **27.9 kg**；V1.4 引入重新设计的小 Yaw 和 TPU 角件结构。最终报告确认哨兵在比赛中可以行驶与射击，但本页不为机构额外归因未经记录的量化作战结果。
</div>

<div class="row mt-3 project-media--portrait-pair">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/双头哨兵.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Built 2024 dual-head autonomous sentry robot" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/双头哨兵报告CAD.jpeg" class="img-fluid rounded z-depth-1" zoomable=true alt="Dual-head sentry CAD rendering embedded in the 2024 technical report" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Built sentry and the corresponding CAD view from the 2024 technical report.</span><span class="lang-zh-only">双头哨兵实机与 2024 技术报告中的对应 CAD 视图。</span></div>
