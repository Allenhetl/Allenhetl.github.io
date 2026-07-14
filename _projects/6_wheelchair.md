---
layout: project
title: '<span class="lang-en-only">Omnidirectional Autonomous Wheelchair</span><span class="lang-zh-only">全向自主移动轮椅</span>'
description: '<span class="lang-en-only">Team-led Year-2 project - rudder-wheel chassis with LiDAR-based autonomous navigation.</span><span class="lang-zh-only">Year 2 团队负责人项目 - 舵轮底盘与激光雷达自主导航。</span>'
img: assets/img/projects/year-project/轮椅展示图.jpg
card_fit: contain
card_pos: center center
card_alt: Completed omnidirectional autonomous wheelchair with its control display and four steering modules
importance: 2
category: year-project
timeframe: 2024.09 – 2025.06
project_status: completed
project_role:
  en: "Team Lead · Mechanical Designer"
  zh: "团队负责人 · 机械设计"
project_focus:
  en: "Steering modules · Per-wheel kinematics"
  zh: "舵轮模块 · 逐轮运动学"
hero_fit: contain
hero_pos: center center
hero_width: compact
---

<h3 id="problem"><span class="lang-en-only">Problem</span><span class="lang-zh-only">问题</span></h3>

<div class="lang-en-only" markdown="1">
A mobility chair must turn in confined indoor spaces while carrying a much larger and less predictable load than a small robot. Conventional differential drive imposes a turning radius and tire scrub, so our Year-2 project investigated independently steered wheels combined with autonomous navigation.
</div>

<div class="lang-zh-only" markdown="1">
移动轮椅需要在狭窄室内空间转向，同时承受远高于小型机器人的载荷与载荷变化。常规差速底盘存在转弯半径与轮胎拖磨问题，因此 Year 2 项目探索了独立舵轮与自主导航的组合方案。
</div>

<h3 id="role-system"><span class="lang-en-only">Role &amp; System</span><span class="lang-zh-only">职责与系统</span></h3>

<div class="lang-en-only" markdown="1">
As team lead and mechanical designer, I developed the steering-wheel modules and the per-wheel kinematics solver. Given a target chair velocity, the solver resolves each wheel's steering angle and speed while reducing unnecessary steering motion and tire wear. Optical-gate feedback closes the steering loop, and the mechanical structure was topology-optimized around the wheel load. I integrated this work with the navigation team's LiDAR obstacle-avoidance stack.
</div>

<div class="lang-zh-only" markdown="1">
作为团队负责人和机械设计，我开发了舵轮模块与逐轮运动学解算器。解算器根据轮椅目标速度求解各轮的转角与速度，同时减少不必要的转向动作和轮胎磨损。舵向闭环采用光电门反馈，机械结构围绕轮载进行拓扑优化；随后我将底盘工作与导航组的激光雷达避障系统完成集成。
</div>

<h3 id="iteration-evidence"><span class="lang-en-only">Iteration Evidence</span><span class="lang-zh-only">迭代证据</span></h3>

<div class="lang-en-only" markdown="1">
The first wheelset used a rocker suspension but proved too weak under load. The second generation replaced it with a straight-tiller structure to increase load capacity and simplify the force path. The final build integrated four modules, battery, control electronics, display, and the navigation stack into a complete chair. No controlled payload or navigation benchmark was recorded, so the evidence here is the documented hardware iteration and integrated prototype.
</div>

<div class="lang-zh-only" markdown="1">
第一代轮组采用摇臂悬挂，但承载测试暴露出结构强度不足；第二代改为直立舵柄，以提高承载能力并简化受力路径。最终样机将四个舵轮模块、电池、控制电子、显示器与导航系统集成为完整轮椅。项目没有留下受控载荷或导航基准，因此这里呈现的是有记录的硬件迭代与集成样机。
</div>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/year-project/轮组爆炸图.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Exploded CAD view of the steering-wheel module" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Exploded CAD view of the steering-wheel module.</span><span class="lang-zh-only">舵轮模块 CAD 爆炸图。</span></div>

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/year-project/轮椅底盘.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Second-generation wheelchair drive base with four steering modules" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/year-project/轮椅舵轮模块.png" class="img-fluid rounded z-depth-1" zoomable=true alt="CAD rendering of a single steering-wheel module" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Second-generation drive base and the CAD design of one steering module.</span><span class="lang-zh-only">第二代驱动底盘与单个舵轮模块的 CAD 设计。</span></div>
