---
layout: project
title: '<span class="lang-en-only">Bionic Fish</span><span class="lang-zh-only">仿生鱼</span>'
description: '<span class="lang-en-only">Course project - biologically inspired underwater swimmer with a built prototype.</span><span class="lang-zh-only">课程项目 - 仿生水下游动机器人，含完整实物样机。</span>'
img: assets/img/projects/课设/仿生鱼海报.jpg
card_pos: center 30%
importance: 2
category: coursework
timeframe: 2025
project_status: completed
project_role:
  en: "Team Member"
  zh: "团队成员"
project_focus:
  en: "Pull-cord drive · Compliant tail · Embedded control"
  zh: "拉线驱动 · 柔顺尾部 · 嵌入式控制"
hero_img: assets/img/projects/课设/仿生鱼实物.jpg
hero_fit: cover
hero_pos: center center
hero_alt: Built OpenFish 2.0 body and actuation prototype
---

<h3 id="problem"><span class="lang-en-only">Problem</span><span class="lang-zh-only">问题</span></h3>

<div class="lang-en-only" markdown="1">
The course brief called for a compact underwater swimmer that could be fabricated with accessible processes while still producing a fish-like traveling wave. The first transmission concept was vulnerable to gear slip and fishing-line entanglement, so the design challenge became simplifying the drive without making the tail rigid.
</div>

<div class="lang-zh-only" markdown="1">
课程要求我们用易获得的加工方式完成一台紧凑水下机器人，同时让尾部形成接近鱼类的行波。早期传动概念容易出现齿轮打滑与鱼线缠绕，因此设计重点转为：在不牺牲尾部柔顺性的前提下简化驱动链路。
</div>

<h3 id="role-system"><span class="lang-en-only">Role &amp; System</span><span class="lang-zh-only">职责与系统</span></h3>

<div class="lang-en-only" markdown="1">
As a team member, I contributed to the body, actuation, and prototype integration of **OpenFish 2.0** (ISDN2400, Feb-May 2025). The swordfish-inspired geometry uses a **1:1.2 body-to-tail ratio** from biological references. Our group replaced the geared transmission with a pull-cord servo mechanism and built a compliant tail from six ribs at 15 mm spacing, 1.8 mm graded-perforation PETG, and a 2 mm silicone skin.

A NANGU 20 kg servo drives the tail. Two 2000 mAh LiPo packs supply the peak current that one pack could not sustain, while dual ESP32 controllers with Blynk provide control and Wi-Fi dropout recovery. A 45-degree chamfer and O-ring seal the removable head.
</div>

<div class="lang-zh-only" markdown="1">
作为团队成员，我参与了 **OpenFish 2.0**（ISDN2400，2025.02-05）的机身、驱动与样机集成。剑鱼仿生外形采用参考生物数据得到的 **1:1.2 身尾比例**；小组将齿轮传动改为拉线舵机机构，并以六根 15 mm 间距肋条、1.8 mm 梯度打孔 PETG 和 2 mm 硅胶蒙皮构成柔顺尾部。

尾部由 NANGU 20 kg 舵机驱动。两块 2000 mAh 锂电共同承担单电池无法稳定提供的峰值电流；双 ESP32 配合 Blynk 完成控制与 Wi-Fi 掉线恢复。可拆机头采用 45° 倒角和 O 形圈密封。
</div>

<h3 id="prototype"><span class="lang-en-only">Prototype</span><span class="lang-zh-only">样机</span></h3>

<div class="lang-en-only" markdown="1">
The team completed an integrated physical prototype and documented its mechanical, electrical, and waterproofing iterations. Because the project did not produce a controlled speed or endurance study, this page presents the build evidence without claiming measured swimming performance.
</div>

<div class="lang-zh-only" markdown="1">
团队完成了可集成运行的实物样机，并记录了机械、电气与防水迭代。由于项目没有形成受控的速度或续航测试，本页只呈现样机与设计证据，不额外声称量化游动性能。
</div>

<div class="row project-media--wide">
  <div class="col-sm">
    {% include figure.liquid path="assets/img/projects/课设/仿生鱼海报.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="OpenFish 2.0 bionic fish project poster" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">OpenFish 2.0 project poster.</span><span class="lang-zh-only">OpenFish 2.0 项目海报。</span></div>
