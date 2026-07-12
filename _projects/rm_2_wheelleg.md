---
layout: page
title: '<span class="lang-en-only">Wheel-leg Infantry</span><span class="lang-zh-only">轮腿步兵</span>'
description: '<span class="lang-en-only">Wheel-leg infantry I led as mechanical designer — Best Knight, RM2025.</span><span class="lang-zh-only">我主导机械设计的串联腿步兵 — RM2025 最佳骑士奖。</span>'
img: assets/img/projects/RoboMaster/轮腿定妆照.jpg
card_fit: contain
card_pos: center center
card_alt: Studio photograph of the HKUST wheel-leg infantry robot
importance: 2
category: robomaster
timeframe: 2024 – 2025
---

<div class="lang-en-only" markdown="1">
This was my flagship build — a **wheel-leg infantry robot** I owned end to end as the team's mechanical lead, and the project that earned the **"Best Knight"** award of the RM2025 season. The idea is to get the best of two worlds: roll fast and smooth like a wheeled robot on flat ground, then unfold articulated legs to climb stairs, duck through tunnels, and scramble up slopes that stop ordinary chassis cold.
</div>

<div class="lang-zh-only" markdown="1">
这是我最具代表性的作品——一台由我作为机械负责人端到端完成的**轮腿步兵机器人**，也是为战队赢得 RM2025 赛季 **"最佳骑士"** 奖的项目。它的核心思路是兼顾两种形态：平地上像轮式机器人一样高速平稳行进，需要时则展开关节腿，去攀爬台阶、钻过隧道、冲上让普通底盘望而却步的陡坡。
</div>

{% include figure.liquid path="assets/img/projects/RoboMaster/轮腿定妆照.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Wheel-leg infantry competition robot" %}

<div class="caption"><span class="lang-en-only">The competition unit — goose-neck turret over an articulated wheel-leg chassis.</span><span class="lang-zh-only">参赛整机——鹅颈式云台 + 关节式轮腿底盘。</span></div>

<div class="lang-en-only" markdown="1">
**How it moves.** The articulated legs are cut from 12 mm glass-fiber-reinforced composite and driven by four MG8016E hip joints, with a controlled 800 mm extension range; the wheels run M3508 motors through a custom 19:1 gearbox (~482 RPM). Holding a ~24 kg robot upright on its legs would normally cook the motors, so I solved the statics in MATLAB and offloaded the weight onto a **300 N air spring** — dropping standing motor output to roughly **2 N·m**. The result clears two-level (20 cm) stairs, tunnels, and **43° slopes**, and rights itself from almost any tip-over with about **80%** success.

**How it fights.** A goose-neck DM4310 turret keeps vision auto-aim above a **60%** hit rate, while a central feeder holds **800+ rounds** and pre-positions them in three layers to sustain a steady **25 Hz** firing rate. Top speed stays above 2 m/s with 20+ minutes of endurance. The complete mechanical drawings and CAD are open-sourced for the community.

</div>

<div class="lang-zh-only" markdown="1">
**怎么动**：关节腿由 12 mm 玻纤增强复合板加工而成，四个 MG8016E 髋关节驱动，伸展行程控制在 800 mm；轮组用 M3508 电机经自研 19:1 减速箱输出（约 482 RPM）。让一台约 24 kg 的机器人单靠腿站立通常会烧电机，于是我在 MATLAB 里求解静力学，把重量卸载到一根 **300 N 气弹簧**上——将站立时电机输出降到约 **2 N·m**。最终它能通过两级（20 cm）台阶、隧道与 **43° 斜坡**，并能从几乎任意角度的倾倒中自救，成功率约 **80%**。

**怎么打**：鹅颈式 DM4310 云台让视觉自瞄命中率保持在 **60%** 以上；中置供弹系统容弹 **800+ 发**，通过三层预定位维持稳定 **25 Hz** 射频。最高速度保持在 2 m/s 以上，续航 20 分钟以上。完整机械图纸与 CAD 已向社区开源。

</div>

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/轮腿最佳骑士.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Wheel-leg infantry robot receiving the Best Knight award" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/RoboMaster/轮腿尺寸图.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Orthographic mechanical drawings of the wheel-leg infantry robot" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Left: the Best Knight award shot. Right: mechanical orthographic drawings.</span><span class="lang-zh-only">左：最佳骑士奖颁奖照；右：机械三视图。</span></div>
