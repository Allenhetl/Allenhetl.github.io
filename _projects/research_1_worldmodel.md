---
layout: project
title: '<span class="lang-en-only">4D World Model (MVISTA-4D)</span><span class="lang-zh-only">4D 世界模型 (MVISTA-4D)</span>'
description: '<span class="lang-en-only">View-consistent 4D world model for robotic manipulation - ICML 2026.</span><span class="lang-zh-only">面向机器人操作的视角一致 4D 世界模型 - ICML 2026。</span>'
img: assets/img/projects/research/mvista4d-multiview.png
card_layout: featured
card_fit: cover
card_pos: center 50%
card_alt: Multi-view RGB, depth, point-cloud, simulation, and real-robot frames from MVISTA-4D
importance: 1
category: research
timeframe: 2025–2026
github:
project_status: accepted
project_role:
  en: "Research Assistant · Co-author"
  zh: "研究助理 · 共同作者"
project_focus:
  en: "Robot platform · Multi-view data pipeline · Real-robot validation"
  zh: "机器人平台 · 多视角数据流程 · 真机验证"
hero_fit: contain
hero_pos: center center
---

<h3 id="problem"><span class="lang-en-only">Problem</span><span class="lang-zh-only">问题</span></h3>

<div class="lang-en-only" markdown="1">
Single-view video prediction can look plausible from its source camera while drifting in depth and geometry when observed elsewhere. That inconsistency is especially costly for manipulation: a robot needs predictions that remain compatible across RGB, depth, and 3D views before it can use an imagined future to act.
</div>

<div class="lang-zh-only" markdown="1">
单视角视频预测可能在原相机中看起来合理，却在切换视角后出现深度与几何漂移。对机器人操作而言，这类不一致会直接影响动作决策：只有预测结果在 RGB、深度和三维视角间保持兼容，机器人才能可靠地依据“想象出的未来”行动。
</div>

<h3 id="role"><span class="lang-en-only">My Role</span><span class="lang-zh-only">我的职责</span></h3>

<div class="lang-en-only" markdown="1">
As a research assistant and co-author, I built the physical robot platform and the multi-camera **calibration, time synchronization, and cross-view alignment** pipeline. I also contributed the 4D manipulation data workflow and real-hardware validation, connecting sensor capture and reconstruction to model training and evaluation.
</div>

<div class="lang-zh-only" markdown="1">
作为研究助理与共同作者，我搭建了实体机器人平台和多相机**标定、时间同步、跨视角对齐**流程，并参与构建 4D 操作数据流程与真机验证，将传感器采集、多视角重建、模型训练和评测连接成完整链路。
</div>

<h3 id="system"><span class="lang-en-only">System</span><span class="lang-zh-only">系统</span></h3>

<div class="lang-en-only" markdown="1">
MVISTA-4D conditions on a **single RGB-D view** and predicts geometry-consistent futures across four or more synchronized cameras. A masked-completion strategy allows a model trained with 2-3 views to generalize to 4-5 views, supporting an *imagine-then-act* manipulation pipeline. This work was completed with collaborators from CUHK MMLab, HKUST, HKU, Tsinghua, and X-Humanoid ([arXiv](https://arxiv.org/abs/2602.09878)).
</div>

<div class="lang-zh-only" markdown="1">
MVISTA-4D 以**单视角 RGB-D** 为条件，预测跨四路以上同步相机的几何一致未来。模型通过掩码补全策略，在 2-3 视角训练后泛化到 4-5 视角，从而支持 *imagine-then-act*（先想象后执行）操作流程。该工作由 CUHK MMLab、香港科技大学、香港大学、清华与 X-Humanoid 合作完成（[arXiv](https://arxiv.org/abs/2602.09878)）。
</div>

<h3 id="validation"><span class="lang-en-only">Validation</span><span class="lang-zh-only">验证</span></h3>

<div class="lang-en-only" markdown="1">
The **paper-level results**, attributable to the full collaboration rather than to my contribution alone, report **FVD 21.93**, **AbRel 2.60**, and **6.51 cm Chamfer Distance** on RoboTwin, outperforming the evaluated UniPi, 4DGen, and TesserAct baselines. Across 14 real-robot manipulation tasks, the paper also reports the strongest success rate among those baselines.
</div>

<div class="lang-zh-only" markdown="1">
以下为**整篇论文和合作团队的结果**，并非仅由我的个人贡献产生：在 RoboTwin 基准上达到 **FVD 21.93**、**AbRel 2.60**、**Chamfer 距离 6.51 cm**，优于所评测的 UniPi、4DGen 与 TesserAct；论文同时报告了 14 项真机操作任务中，相较这些基线的最佳成功率。
</div>
