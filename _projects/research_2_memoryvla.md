---
layout: project
title: '<span class="lang-en-only">Memory-Augmented VLA</span><span class="lang-zh-only">记忆增强 VLA</span>'
description: '<span class="lang-en-only">Memory-augmented vision-language-action policy for long-horizon manipulation.</span><span class="lang-zh-only">面向长程操作的记忆增强视觉-语言-动作策略。</span>'
img: assets/img/projects/research/memoryvla-system-diagram.svg
card_fit: contain
card_pos: center center
card_alt: System design for a subtask-driven self-compressive memory VLA
importance: 2
category: research
timeframe: 2026–
github:
project_status: ongoing
project_role:
  en: "Research Lead"
  zh: "研究负责人"
project_focus:
  en: "Bounded memory · Long-horizon VLA"
  zh: "有界记忆 · 长程 VLA"
hero_fit: contain
hero_pos: center center
hero_ratio: wide
---

<h3 id="problem"><span class="lang-en-only">Problem</span><span class="lang-zh-only">问题</span></h3>

<div class="lang-en-only" markdown="1">
Long-horizon manipulation requires a policy to retain completed subtasks, scene changes, and earlier decisions without letting its context grow without bound. Many VLA policies remain dominated by the current observation, so information needed several steps later can be diluted or discarded.
</div>

<div class="lang-zh-only" markdown="1">
长程操作要求策略记住已经完成的子任务、场景变化和早期决策，同时又不能让上下文无限增长。许多 VLA 策略仍主要依赖当前观测，数步之后仍然需要的信息容易被稀释或遗忘。
</div>

<h3 id="role-system"><span class="lang-en-only">Role &amp; System</span><span class="lang-zh-only">职责与系统</span></h3>

<div class="lang-en-only" markdown="1">
I lead the project and am building the PyTorch research pipeline around four connected components: VLM-guided task decomposition, subtask-boundary detection, Perceiver-style compression into a fixed-budget memory bank, and cross-attention reads from memory into the action expert. The current work also includes training infrastructure and an evaluation harness for controlled memory ablations.
</div>

<div class="lang-zh-only" markdown="1">
我负责该项目，并围绕四个相互衔接的模块搭建 PyTorch 研究流程：VLM 引导的任务分解、子任务边界检测、基于 Perceiver 的压缩与固定预算记忆库，以及动作专家对记忆的交叉注意力读取。当前工作还包括训练基础设施和用于受控记忆消融的评测框架。
</div>

<h3 id="evaluation-status"><span class="lang-en-only">Evaluation Status</span><span class="lang-zh-only">评测状态</span></h3>

<div class="lang-en-only" markdown="1">
The project is still in the prototype stage. The diagnostic below overlays saliency traces from ten trajectories to study whether a usable subtask-boundary signal emerges; it is **not a benchmark result**. Planned evaluation covers RMBench, VLABench, and LIBERO-Long with no-memory and memory-augmented baselines, reporting task success, memory budget, and inference cost. **Quantitative benchmark and real-robot results are pending.**
</div>

<div class="lang-zh-only" markdown="1">
项目仍处于原型阶段。下图叠加了十条轨迹的 saliency 曲线，用于分析是否能形成可用的子任务边界信号；它**不是基准测试结果**。计划在 RMBench、VLABench 与 LIBERO-Long 上对比无记忆和记忆增强基线，并报告任务成功率、记忆预算与推理开销。**定量基准和真机结果尚未完成。**
</div>

<div class="row project-media--wide">
  <div class="col-sm">
    {% include figure.liquid path="assets/img/projects/research/memoryvla-saliency-diagnostic.png" class="img-fluid rounded z-depth-1" zoomable=true alt="Prototype saliency traces over ten observe-and-pickup trajectories" %}
  </div>
</div>
<div class="caption"><span class="lang-en-only">Prototype saliency diagnostic across ten trajectories; analysis artifact, not a final performance result.</span><span class="lang-zh-only">十条轨迹上的原型 saliency 诊断；属于分析过程，不代表最终性能结果。</span></div>
