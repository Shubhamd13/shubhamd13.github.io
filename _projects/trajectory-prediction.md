---
layout: page
title: Scene and Social Awareness in Trajectory Prediction
description: Re-ranking a predictor's candidate futures with Direct Preference Optimization, so the planner sees safe, socially reasonable trajectories first.
img: assets/img/trajectory_scores_visualization.png
importance: 1
category: work
---

<div class="row justify-content-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/trajectory/method-overview.png" title="Method overview" alt="Pipeline: candidate generation, scene and social metrics with preference pairs, DPO objective and planner integration" class="img-fluid rounded z-depth-1" caption="Method overview: candidate generation → scene and social metrics → DPO adjustment → planner." %}
  </div>
</div>

**Self-proposed final project for CS 267, UC Riverside, Fall 2025** · with Aadhar Chauhan · [Source on GitHub](https://github.com/Shubhamd13/Social-Awareness-in-Trajectory-Prediction) · [Report (PDF)](https://github.com/Shubhamd13/Social-Awareness-in-Trajectory-Prediction/blob/main/CS267_Final_Report.pdf)

Teams chose their own final-project topics, and this problem and approach were ours.

## The problem

A self-driving car's motion planner depends on predictions of where everyone else will go. Most trajectory predictors are trained to output the most _likely_ futures. The most likely future is not always the most useful one for planning: a kinematically probable path can run into a parked obstacle or cut off another driver.

Driving datasets record what agents did. They do not say which predicted futures are safe, comfortable, or socially appropriate, so a model trained only on likelihood has no signal for those qualities.

## Our approach

Instead of replacing the predictor, we add a lightweight **preference layer** on top of it:

1. **Candidate generation.** A base predictor proposes K possible futures for each agent.
2. **Scene and social metrics.** Each candidate is scored with simple, interpretable checks: staying in the lane, keeping a safe distance from obstacles and other agents, and making forward progress.
3. **Preference pairs.** For each agent, the best-scoring candidate becomes the "chosen" trajectory and the worst becomes the "rejected" one. No human labeling is needed.
4. **DPO.** [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) shifts probability toward the preferred candidates, while a frozen reference policy keeps the adjusted distribution close to the original predictor:

$$
\mathcal{L}_{\mathrm{DPO}} = -\log \sigma\!\left(\beta\left[\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\mathrm{ref}}(y_w\mid x)} - \log\frac{\pi_\theta(y_l\mid x)}{\pi_{\mathrm{ref}}(y_l\mid x)}\right]\right)
$$

Here $$y_w$$ is the chosen trajectory and $$y_l$$ the rejected one. The re-weighted candidates are then passed to the planner.

## Implementation

We extended [highway-env](https://github.com/Farama-Foundation/HighwayEnv) with an intersection scenario that has static obstacles and predicted futures drawn on top. Each episode places five random obstacles in the intersection. For each vehicle, a kinematic model with random acceleration and turn-rate perturbations generates K = 5 candidates over a 12-step horizon at 15 Hz. A small MLP takes the vehicle's state (position, velocity, heading) and outputs a distribution over its K candidates. It is trained online with the DPO loss above (β = 0.1) against a frozen reference copy of itself.

<div class="row justify-content-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/trajectory/k-trajectories-intersection.png" title="K candidate trajectories" alt="Intersection with K candidate trajectories per vehicle; best solid, worst dashed" class="img-fluid rounded z-depth-1" caption="K candidates per vehicle at an intersection with obstacles (red). Solid lines are the best-scoring candidates and dashed lines the worst." %}
  </div>
</div>

## Results in highway-env

We trained the preference layer for 50 episodes in the intersection scenario, then compared trajectory quality before and after DPO training (`compare_policies.py`):

| Metric                  | Before DPO | After DPO |        Change |
| ----------------------- | ---------: | --------: | ------------: |
| Avg. best score         |     −0.452 |     0.158 |        +0.610 |
| Avg. worst score        |     −1.005 |    −0.347 |        +0.658 |
| Avg. lane violations    |      0.028 |     0.015 | −46% |
| Avg. obstacle violations |      1.550 |     0.817 | **−47%** |
{: .table .table-bordered .table-sm}

Obstacle violations dropped by 47% and lane violations by 46%, and both the best and worst candidates scored higher after training.

## Robot–human scenarios

We did not finish connecting the re-ranked predictions to a downstream planner in highway-env within the project timeline. To see how the preference layer behaves on top of a learned predictor, we also ran it in a smaller robot–human navigation setting. There, human motion comes from the **Social Force Model** and multi-modal predictions come from **[SocialVAE](https://arxiv.org/abs/2203.08207)**.

- **Corridor:** two people walk past each other while a third stands nearby and shifts around unpredictably. SocialVAE's most likely prediction often heads straight into the standing person. After preference re-weighting, the paths that steer around them get more weight.
- **Doorway:** two groups approach a door from opposite sides, and it opens at t = 8, creating a brief bottleneck. Some predicted futures nearly collide in the doorway. The preference layer moves probability toward futures that slow down or yield.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/trajectory/corridor-scenario.png" title="Corridor scenario" alt="Corridor scenario with predicted human paths and the DPO-chosen path" class="img-fluid rounded z-depth-1" caption="Corridor scenario." %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/trajectory/doorway-scenario.png" title="Doorway scenario" alt="Doorway scenario with predicted paths converging on the door" class="img-fluid rounded z-depth-1" caption="Doorway scenario." %}
  </div>
</div>

## Limitations and next steps

In both robot–human scenarios, the preference layer consistently favored safer, more socially compliant futures over merely likely ones, but those results are qualitative. The highway-env numbers come from a simplified setup: 50 training episodes, with candidates from a kinematic model rather than a learned predictor. Neither is yet a planner-level benchmark. Other limitations:

- The metrics are hand-written rules, and the preference pairs are built heuristically, so they could encode unintended biases.
- The small-scale pedestrian scenes do not capture vehicle dynamics or high-speed interactions.

Next steps are to finish the highway-env integration and measure collision rate, off-road violations, and planner performance against the unadjusted predictor; to learn the metrics instead of hand-writing them; and to test whether the preference layer transfers across different base predictors.
