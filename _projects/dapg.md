---
layout: page
title: Sample-Efficient RL with Expert Data Augmentation
description: Using expert demonstrations to cut the number of environment steps PPO needs on LunarLander-v2.
img: assets/img/LunarLander.gif
importance: 1
category: work
---

<div class="row justify-content-center">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/LunarLander.gif" title="LunarLander-v2" alt="Agent landing in LunarLander-v2" class="img-fluid rounded z-depth-1" caption="A trained agent landing in LunarLander-v2." %}
  </div>
</div>

**Self-proposed final project for CS 258, UC Riverside, Fall 2024** · [Source on GitHub](https://github.com/Shubhamd13/Demonstration-Augmented-Proximal-Policy-Gradient) · [Report (PDF)](https://github.com/Shubhamd13/Demonstration-Augmented-Proximal-Policy-Gradient/blob/main/Project%20Report.pdf)

## The question

Policy-gradient methods like PPO learn well, but they need a lot of environment interaction. That is a real cost on physical robots, where every sample takes real time and wears out real hardware. This project asks how much expert demonstrations can reduce that cost: if an agent starts from demonstrations and keeps them in its objective, how few environment steps does it need?

The course left each final project's topic and scope up to the student, so I chose this question and wrote the proposal myself. I implemented PPO, behavior cloning (BC), and a demonstration-augmented PPO variant from scratch in PyTorch, and tested them on CartPole-v1 and LunarLander-v2.

## Approach

**1. Collect expert demonstrations.** Flying the lander by hand while keeping fuel use low is hard, so I used a Stable-Baselines3 PPO agent as the expert instead. It solves LunarLander-v2 in about 600k steps and reaches around 240 within 1M steps. I modified its wrapper to work with an un-vectorized Gym environment, then recorded 400k (state, action) pairs from it.

<div class="row justify-content-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/dapg/expert-ppo-curve.png" title="Expert training curve" alt="Stable-Baselines3 PPO mean episode reward over 1M steps" class="img-fluid rounded z-depth-1" caption="Training curve of the Stable-Baselines3 PPO expert on LunarLander-v2 (mean episode reward over 1M steps)." %}
  </div>
</div>

**2. Pretrain with behavior cloning.** The policy is first trained by supervised learning to imitate the expert, by maximizing

$$
\mathcal{L}_{\mathrm{BC}}(\theta) = \mathbb{E}_{(s,a)\sim \mathcal{D}_{\mathrm{expert}}}\left[\log \pi_\theta(a\mid s)\right].
$$

BC alone matches the expert on LunarLander-v2 with about 80k demonstration samples, but it can't do better than the expert.

<div class="row justify-content-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/dapg/bc-lunarlander-curve.png" title="Behavior cloning results" alt="Behavior cloning evaluation reward on LunarLander-v2 across three seeds" class="img-fluid rounded z-depth-1" caption="Behavior cloning on LunarLander-v2 across three seeds: evaluation reward climbs to roughly 250–260." %}
  </div>
</div>

**3. Fine-tune with a demonstration-augmented objective.** Following DAPG ([Rajeswaran et al., 2018](https://arxiv.org/abs/1709.10087)), the PPO loss gets an extra term that keeps the policy close to the expert's actions:

$$
\mathcal{L}_{\mathrm{DAPG}}(\theta) = \mathcal{L}_{\mathrm{PPO}}(\theta) + \alpha\, w \sum_{(s,a)\in\mathcal{D}_{\mathrm{expert}}} \log \pi_\theta(a\mid s).
$$

A large weight makes this behave like behavior cloning, and a weight of zero gives plain PPO. My version differs from the original paper in two ways:

- It augments **PPO** rather than the natural policy gradient.
- It directly maximizes the log-likelihood of the expert's actions. The original instead mixes expert and policy trajectories and estimates advantages for the demonstrations.

## Results

| Environment    | Method | Mean eval. reward | Environment steps | Std. dev. |
| -------------- | ------ | ----------------: | ----------------: | --------: |
| CartPole-v1    | PPO    |               500 |            95,000 |         0 |
| LunarLander-v2 | PPO    |               260 |         1,000,000 |        30 |
| CartPole-v1    | BC     |               500 |     5,000 (demos) |         0 |
| LunarLander-v2 | BC     |               250 |    80,000 (demos) |        47 |
| LunarLander-v2 | DAPG   |               257 |             1,024 |        39 |
{: .table .table-bordered .table-sm}

After BC pretraining, the demonstration-augmented agent reached 257 ± 39 using only 1,024 of its own environment steps, compared with about 1M for PPO trained from scratch. Most of that sample efficiency comes from the demonstrations, which a real robot would need to collect too.

## Limitations

- **My PPO was unstable across seeds.** It worked on CartPole-v1, but on LunarLander-v2 even 30+ hours of Optuna hyperparameter search only found settings that worked for a single seed. That points to a bug or fragility in my implementation, and the DAPG result above sits on top of it.
- **The DAPG number is preliminary.** It comes from a single seed and should be read as a promising early result, not a settled comparison.

## Where I'd take it next

- Fix PPO's stability and rerun every method across multiple seeds
- Try other ways of mixing demonstrations into the objective, including ones that hold up with noisy or limited demonstrations
- Combine model-free and model-based learning, in the spirit of guided policy search ([Levine & Koltun, 2013](https://proceedings.mlr.press/v28/levine13.html))
- Extend demonstration-augmented learning to multi-agent settings
