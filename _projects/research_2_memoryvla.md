---
layout: page
title: '<span class="lang-en-only">Memory-Augmented VLA</span><span class="lang-zh-only">记忆增强 VLA</span>'
description: '<span class="lang-en-only">Memory-augmented vision-language-action policy for long-horizon manipulation — targeting ICRA 2027.</span><span class="lang-zh-only">面向长程操作的记忆增强视觉-语言-动作策略 — 计划投稿 ICRA 2027。</span>'
img: assets/img/projects/research/memoryvla.svg
importance: 2
category: research
timeframe: 2026–
github:
---

<div class="lang-en-only" markdown="1">
*Research lead, 2026.02 – ongoing. Targeting **ICRA 2027**.*

A vision-language-action (VLA) policy that stays coherent over **long-horizon** manipulation by carrying an explicit, bounded memory.

- **Architecture** — hierarchical task decomposition, a sub-task boundary detector, a fixed-capacity **Implicit Memory Bank**, and a memory–action cross-attention interface.
- **Implementation** — full PyTorch training & inference pipeline; multi-GPU distributed training; sim-to-real validation on a real arm.
- **Evaluation** — RMBench / VLABench / LIBERO-Long against Mem-0, MEM, MemER, CronusVLA baselines.
</div>

<div class="lang-zh-only" markdown="1">
*研究负责人，2026.02 – 进行中。计划投稿 **ICRA 2027**。*

一个视觉-语言-动作（VLA）策略，通过显式、有界的记忆，在**长程**操作任务中保持连贯。

- **架构** —— 分层任务分解、子任务边界检测器、固定容量的**隐式记忆库（Implicit Memory Bank）**，以及记忆–动作交叉注意力接口。
- **实现** —— 完整的 PyTorch 训练与推理流程；多 GPU 分布式训练；在真实机械臂上完成 sim-to-real 验证。
- **评测** —— 在 RMBench / VLABench / LIBERO-Long 上对比 Mem-0、MEM、MemER、CronusVLA 等基线。
</div>
