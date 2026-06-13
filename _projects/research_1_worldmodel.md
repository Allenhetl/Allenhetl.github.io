---
layout: page
title: '<span class="lang-en-only">4D World Model (MVISTA-4D)</span><span class="lang-zh-only">4D 世界模型 (MVISTA-4D)</span>'
description: '<span class="lang-en-only">View-consistent 4D world model for robotic manipulation — ICML 2026.</span><span class="lang-zh-only">面向机器人操作的视角一致 4D 世界模型 — ICML 2026。</span>'
img: assets/img/projects/research/worldmodel.svg
importance: 1
category: research
timeframe: 2025–2026
github:
---

<div class="lang-en-only" markdown="1">
**Co-author · ICML 2026** ([arXiv](https://arxiv.org/abs/2602.09878)) — a collaboration across CUHK MMLab, HKUST, HKU, Tsinghua, and X-Humanoid.

MVISTA-4D turns a **single RGB-D view** into **geometry-consistent predictions across four-plus synchronized cameras**, supporting an _imagine-then-act_ manipulation paradigm. Trained on 2–3 views, it generalizes to 4–5 via a masked-completion strategy. On the RoboTwin benchmark it reaches **FVD 21.93**, **AbRel 2.60**, and **6.51 cm Chamfer Distance**, beating UniPi, 4DGen, and TesserAct, and attains the best real-robot success rate among baselines across **14 manipulation tasks**.

**My contribution (research assistant, 2025.12 – 2026.02):** built the physical robot platform, the multi-camera **calibration / time-sync / cross-view alignment** pipeline, and the **4D manipulation dataset**; validated _imagine-then-act_ on real hardware — closing the loop from sensor capture and multi-view reconstruction to model training and real-robot validation.

</div>

<div class="lang-zh-only" markdown="1">
**合作论文 · ICML 2026**（[arXiv](https://arxiv.org/abs/2602.09878)）——由 CUHK MMLab、香港科技大学、香港大学、清华与 X-Humanoid 合作完成。

MVISTA-4D 将**单视角 RGB-D** 转化为**跨四路以上同步相机的几何一致预测**，支持 _imagine-then-act_（先想象后执行）操作范式。模型以 2–3 视角训练，借助掩码补全策略泛化到 4–5 视角。在 RoboTwin 基准上达到 **FVD 21.93**、**AbRel 2.60**、**Chamfer 距离 6.51 cm**，优于 UniPi、4DGen、TesserAct，并在 **14 项操作任务**上取得基线中最佳的真机成功率。

**我的贡献（研究助理，2025.12 – 2026.02）：** 搭建实体机器人平台、多相机**标定 / 时间同步 / 跨视角对齐**流程，以及 **4D 操作数据集**；在真实硬件上验证 _imagine-then-act_——打通从传感器采集、多视角重建到模型训练与实机验证的完整闭环。

</div>
