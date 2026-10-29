---
layout: post
title: "How to Install Arena-Rosnav and SEAN: Social Navigation Simulators"
date: 2026-10-07 00:00:00-0700
last_updated: 2026-10-24
description: Which Arena-Rosnav (ROS 1, ROS 2 Humble, Jazzy) or SEAN version to install, which simulators each one supports, and fixes for common install errors.
keywords: arena-rosnav, SEAN, social robot navigation, social navigation simulator, crowd simulation, ROS 2, Isaac Sim, Gazebo, Unity
tags: robotics navigation simulation
categories: robotics
related_posts: false
og_image: assets/img/blog/social-robot-navigation-og.png
og_image_alt: "Social Robot Navigation: installing Arena and SEAN. A robot plans a curved path around a group of people and their personal space."
toc:
  sidebar: left
---

This guide covers how to install [Arena-Rosnav](https://arena-rosnav.org/) (Arena) and [SEAN](https://sean.interactive-machines.com), two of the most complete open-source simulators for social robot navigation: which version to pick for your ROS distro, which simulators each version actually runs, and how to fix the install errors that come up most often.

**Social robot navigation** means moving a robot through spaces it shares with people: keeping a comfortable distance, waiting at a doorway, going around a group instead of through it, and moving in a way people can predict. The obstacles have intentions, and they react to the robot as much as it reacts to them. Robots like the one below, which collects used dishes at a Starbucks in Singapore, already do this in cafés, and more are coming to hospitals, airports, and offices.

<div class="row justify-content-center">
  <div class="col-sm-8 col-md-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/blog/robot-waiter-starbucks-singapore.jpg" title="A robot waiter at a Starbucks in Singapore" alt="A white service robot with a cartoon face on its screen stands in the aisle of a café, between chairs and tables, while a customer walks past" class="img-fluid rounded z-depth-1" caption='A robot that collects used dishes at a Starbucks in Singapore. Photo: <a href="https://commons.wikimedia.org/wiki/File:Robot_waiter,_Starbucks,_Singapore_-_02.jpg">Sgconlaw</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>, via Wikimedia Commons.' %}
  </div>
</div>

Testing with real crowds is slow, expensive, and sometimes unsafe, so most research starts in simulation. Arena and SEAN have each gone through several versions, and each version has its own paper, code, ROS distro, and docs, which don't always agree. Finding the exact version a paper used can take days.

If you're new to social navigation, start with the table below. If you're reproducing a specific paper, go to the version tables and to [When the install breaks](#when-the-install-breaks). Every link in the post is also collected in [Links](#links) at the end.

> If something here is out of date, [email me](mailto:sderh001@ucr.edu) and I'll update it.

## Which one should I install?

Your ROS version decides most of this, so start there:

| If you want...                                                   | Start with                                                                                                                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The newest Arena, with Isaac Sim or MuJoCo (ROS 2 Jazzy, Docker) | **Arena 5.0**: [`voshch/Arena`](https://github.com/voshch/Arena)                                                                                                          |
| ROS 2 Humble on Ubuntu 22.04, with Gazebo                        | **Arena 4.0**: [`humble` branch](https://github.com/Arena-Rosnav/arena-rosnav/tree/humble) of [`Arena-Rosnav/arena-rosnav`](https://github.com/Arena-Rosnav/arena-rosnav) |
| ROS 1 Noetic on Ubuntu 20.04, with Flatland, Gazebo, or Unity    | **Arena 3.0**: [`master` branch](https://github.com/Arena-Rosnav/arena-rosnav/tree/master) of [`Arena-Rosnav/arena-rosnav`](https://github.com/Arena-Rosnav/arena-rosnav) |
| The code from the original 2021 paper                            | [`ignc-research/arena-rosnav`](https://github.com/ignc-research/arena-rosnav)                                                                                             |
| Unity with scripted social situations                            | **SEAN 2.0**: [`yale-sean/social_sim_unity`](https://github.com/yale-sean/social_sim_unity)                                                                               |
| A lightweight 2D sandbox for reinforcement learning              | [CrowdNav](https://github.com/vita-epfl/CrowdNav) or [ir-sim](https://github.com/hanruihua/ir-sim)                                                                        |

The rest of the post explains where these come from and how to install each one.

## Arena

Arena comes from [Linh Kästner](https://linhdoan.io/) and [Volodymyr Shcherbyna](https://github.com/voshch), along with many collaborators. Linh now leads the [ARENA Lab](https://arena-lab.org/) at Singapore Management University. Arena is a whole platform rather than just a simulator: it generates worlds, simulates pedestrians, comes with [more than 30 planners](https://docs.arena-rosnav.org/en/latest/arena_planners/) (from classical to learning-based and vision-language ones), and includes pipelines for training and benchmarking. In its repos, it's usually called Arena-Rosnav.

### Eight papers in five years

Arena started in 2021 as a 2D simulator for training reinforcement learning planners. A Gazebo version followed, the 2022 Arena-Bench paper turned both into a benchmark, and with Arena-Rosnav 2.0 in 2023 the code moved to a new GitHub organization. Version 3.0 (2024) focused on social navigation on ROS 1, 4.0 (2025) moved to ROS 2, and 5.0 (2025) added NVIDIA Isaac Sim. Each step came with its own paper and its own place in the code:

| Version                                                             | Venue          | Code                                                                                                                                                          | ROS                     |
| ------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [Arena-Rosnav](https://ieeexplore.ieee.org/document/9636226)        | IROS 2021      | [`ignc-research/arena-rosnav`](https://github.com/ignc-research/arena-rosnav) (Gazebo: [`arena-rosnav-3D`](https://github.com/ignc-research/arena-rosnav-3D)) | ROS 1                   |
| [Arena-Bench](https://doi.org/10.1109/LRA.2022.3190086)             | RA-L/IROS 2022 | [`ignc-research/arena-bench`](https://github.com/ignc-research/arena-bench)                                                                                   | ROS 1                   |
| [Arena-Rosnav 2.0](https://doi.org/10.1109/IROS55552.2023.10342152) | IROS 2023      | [`Arena-Rosnav/arena-rosnav`](https://github.com/Arena-Rosnav/arena-rosnav), [tags `v0.1.0` to `v0.2.2`](https://github.com/Arena-Rosnav/arena-rosnav/tags)   | ROS 1                   |
| [Arena-Web](https://www.roboticsproceedings.org/rss19/p088.html)    | RSS 2023       | -                                                                                                                                                             | -                       |
| [Arena 3.0](https://roboticsproceedings.org/rss20/p074.html)        | RSS 2024       | [`master` branch](https://github.com/Arena-Rosnav/arena-rosnav/tree/master) of `Arena-Rosnav/arena-rosnav`                                                    | ROS 1 Noetic            |
| [Arena 4.0](https://doi.org/10.1109/ICRA55743.2025.11127635)        | ICRA 2025      | [`humble` branch](https://github.com/Arena-Rosnav/arena-rosnav/tree/humble) of `Arena-Rosnav/arena-rosnav`                                                    | ROS 2 Humble            |
| [Arena 5.0](https://www.roboticsproceedings.org/rss21/p092.html)    | RSS 2025       | [`humble` branch](https://github.com/Arena-Rosnav/arena-rosnav/tree/humble) at the time, now [`voshch/Arena`](https://github.com/voshch/Arena)                | ROS 2 Humble, now Jazzy |
| [Arena-Bench 2.0](https://doi.org/10.1109/IROS60139.2025.11246895)  | IROS 2025      | [`Arena-Rosnav`](https://github.com/Arena-Rosnav) org                                                                                                         | ROS 2                   |

Note that the papers point to the [`Arena-Rosnav`](https://github.com/Arena-Rosnav) GitHub organization, but the project pages now link `voshch/Arena`, Volodymyr's own repo, which he created in October 2025. If you're reproducing a specific paper, the branches and tags of `Arena-Rosnav/arena-rosnav` are closer to what it used. The group has since released [PEDS](https://arena-rosnav.org/pedsral26/), a newer benchmark accepted to RA-L in 2026.

### Which simulators does each version really support?

The simulator decides what you install, and papers, project pages, and code don't always list the same ones.

Take Arena 5.0. Figure 2 of [its paper](https://www.roboticsproceedings.org/rss21/p092.html) puts the Gazebo, Unity, and NVIDIA Isaac logos side by side, and the text calls Unity and Isaac its photorealistic simulators. The [project page](https://arena-rosnav.org/arena-5/) lists four: Isaac Sim, Unity, Gazebo, and Flatland. In the code, however, Unity doesn't run on ROS 2.

Unity support only ever existed on the ROS 1 branch, as a [prebuilt binary](https://github.com/Arena-Rosnav/arena-unity/releases) last released in June 2024. When Arena 5.0 was presented at RSS in June 2025, its code could launch Gazebo or Isaac Sim. Today's code adds [MuJoCo](https://docs.arena-rosnav.org/en/latest/arena_mujoco/) and [flatsim](https://docs.arena-rosnav.org/en/latest/flatsim/), a new 2D simulator that is not the older Flatland. That matches what the [main Arena site](https://arena-rosnav.org/) lists now, so trust the main site over the 5.0 project page.

The paper also mentions Isaac Gym, but the code uses Isaac Sim, which is a different NVIDIA product. Search for Isaac Sim when you debug.

Here is the full picture for every version:

| Version                 | The paper says                   | The code runs                                                                          |
| ----------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| Arena-Rosnav (2021)     | A 2D simulator                   | Flatland, with Gazebo in a separate repo                                               |
| Arena-Bench (2022)      | Flatland, Gazebo                 | Flatland, Gazebo                                                                       |
| Arena-Rosnav 2.0 (2023) | Flatland, Gazebo, Unity, Arena2D | Flatland and Gazebo, with Unity and Arena2D in separate repos                          |
| Arena 3.0 (2024)        | Flatland, Gazebo, Unity          | Flatland, Gazebo Classic, Unity                                                        |
| Arena 4.0 (2025)        | Gazebo Garden, Unity             | Gazebo Garden at first, now Gazebo Harmonic plus optional Isaac Sim 4.2                |
| Arena 5.0 (2025)        | Isaac, Gazebo, Unity             | Gazebo and Isaac Sim 4.2 at RSS; today Isaac Sim 6.1, Gazebo Harmonic, MuJoCo, flatsim |
| Arena-Bench 2.0 (2025)  | Gazebo, Unity, Isaac Sim         | Gazebo and Isaac Sim 4.2                                                               |

In short: if you need Unity, use Arena 3.0 on ROS 1. If you need Isaac Sim, use 5.0.

### Which docs go with which version?

Each version has its own docs site, and the older ones have moved or disappeared:

- **Arena 5.0:** [docs.arena-rosnav.org](https://docs.arena-rosnav.org/en/latest/), generated from the `voshch/Arena` READMEs. The old [arena-dev.readthedocs.io](https://arena-dev.readthedocs.io/) address redirects there.
- **Arena 4.0:** [arena-rosnav.readthedocs.io](https://arena-rosnav.readthedocs.io/en/latest/), which covers the `humble` branch.
- **Arena 3.0:** no longer hosted. Its [installation](https://github.com/Arena-Rosnav/.github/blob/arena3/docs/user_guides/installation.md) and [usage](https://github.com/Arena-Rosnav/.github/blob/arena3/docs/user_guides/usage.md) guides survive in the `arena3` tag of the `Arena-Rosnav/.github` repo.

Most branch READMEs still link to pages that no longer exist, so always match the docs to the branch you cloned. Two more things look current but aren't: the [`Arena-Rosnav` GitHub profile](https://github.com/Arena-Rosnav) is titled "Arena 5.0" but links to the `humble` branch and the 4.0 docs, and the [worksheets](https://edu.arena-rosnav.org/) at edu.arena-rosnav.org were written for 3.0.

<details markdown="1">
<summary><b>Branch-by-branch notes</b></summary>

These are the main branches of `Arena-Rosnav/arena-rosnav`:

| Branch                                                                                 | What it is                                                                                                                         |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`master`](https://github.com/Arena-Rosnav/arena-rosnav/tree/master)                   | ROS 1 (Arena 3.0). Its README's install link returns 404, so use the `arena3` guide instead. `install4_arena_unity.sh` adds Unity. |
| [`humble`](https://github.com/Arena-Rosnav/arena-rosnav/tree/humble)                   | ROS 2 Humble (Arena 4.0, then the first Isaac Sim work). Its README's install link works.                                          |
| [`ros2`](https://github.com/Arena-Rosnav/arena-rosnav/tree/ros2)                       | An earlier ROS 2 port, last updated in July 2024 and replaced by `humble`. Its install link returns 404.                           |
| [`unity-simulator`](https://github.com/Arena-Rosnav/arena-rosnav/tree/unity-simulator) | The ROS 1 branch where Unity support was built, merged into `master` in February 2024. Its install link returns 404.               |
| [`dev`](https://github.com/Arena-Rosnav/arena-rosnav/tree/dev)                         | A ROS 1 development branch from April 2023, with manual catkin and Poetry steps.                                                   |

The code from before 2023 lives in [`ignc-research/arena-rosnav`](https://github.com/ignc-research/arena-rosnav), which hasn't been maintained since early 2023. Its default branch, `local_planner_subgoalmode`, matches the 2021 paper, and it has around 40 thesis and experiment branches. The ivaROS lab's fork, [`ivaROS/arena-rosnav`](https://github.com/ivaROS/arena-rosnav), has a three-script install for Ubuntu 20.04, plus `social_nav`, `learn_social`, and `social_cost_function` branches.

</details>

### Installing Arena

Once you know your version, installing is mostly one script. What differs is how much each script asks of your machine.

#### Arena 5.0: ROS 2 Jazzy in Docker

This is the easiest path if you have an NVIDIA GPU. ROS 2 runs inside a container, so your host stays clean. You need Docker (with your user in the `docker` group) or Podman, plus the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html):

```bash
curl https://raw.githubusercontent.com/voshch/Arena/jazzy/install.sh > install.sh
bash install.sh
cd ~/arena_ws && source arena
arena feature isaac install   # or gazebo / mujoco / flatsim / training
arena launch sim:=isaac
```

The installer clones Arena into `~/arena_ws` and sets up its container. Install at least one simulator before you launch. For reinforcement learning training, also run `arena feature docker gpu on`, then `source arena` again. If you change your mind later, `source arena uninstall` removes the containers and images, and adding `--all` deletes your data and caches too.

Two things to know before you start. First, the `jazzy` branch moves fast: MuJoCo and flatsim arrived in October 2026, and the only release so far is a [`v0.0.1` pre-release](https://github.com/voshch/Arena/releases/tag/v0.0.1) from March 2026, so write down the commit you used. Second, Isaac Sim needs serious hardware. NVIDIA [lists](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html) an RTX 4080 with 16 GB of VRAM and 32 GB of RAM as the minimum, and Isaac Sim doesn't support GPUs without RT cores, such as the A100 and H100. If you get stuck, the project has a [Discord server](https://discord.gg/GNTTf9DKyp).

#### Arena 4.0: ROS 2 Humble on Ubuntu 22.04

This path installs natively on Ubuntu 22.04. WSL works too, but only with Gazebo. Following the [installation guide](https://arena-rosnav.readthedocs.io/en/latest/tutorials/installation/), run the installer from a fresh terminal, with no ROS 2 sourced and no Python environment active:

```bash
curl https://raw.githubusercontent.com/Arena-Rosnav/arena-rosnav/humble/installers/install.sh > install.sh
bash install.sh
```

Expect it to need more than 80 GB of disk and over an hour, because it compiles ROS 2 Humble from source inside `~/arena4_ws`. At the end, it asks whether you want Gazebo, Isaac Sim, and extra planners. If it stops partway, run it again and it picks up where it left off. Then launch a simulation:

```bash
cd ~/arena4_ws && . arena.bash
ros2 launch arena_bringup arena.launch.py sim:=gazebo
```

Always pass `sim:=`. The default is `dummy`, which starts no simulator at all. The [usage guide](https://arena-rosnav.readthedocs.io/en/latest/tutorials/usage/) lists the other launch arguments.

#### Arena 3.0: ROS 1 Noetic on Ubuntu 20.04

Choose this path if you need Unity or Flatland, or if you're reproducing a paper from 2024 or earlier. The `master` README's install link is dead, but the [original guide](https://github.com/Arena-Rosnav/.github/blob/arena3/docs/user_guides/installation.md) survives in the `arena3` tag:

```bash
curl https://raw.githubusercontent.com/Arena-Rosnav/arena-rosnav/master/install.sh > install.sh
bash install.sh
# then, in a new terminal:
curl https://raw.githubusercontent.com/Arena-Rosnav/arena-rosnav/master/install2.sh > install2.sh
bash install2.sh
```

The guide asks for about 30 GB of disk and half an hour. Two optional scripts come with it: `install3_training.sh` adds the training dependencies, and `install4_arena_unity.sh` downloads the prebuilt Unity simulator (about 480 MB). Then launch:

```bash
roslaunch arena_bringup start_arena.launch simulator:=gazebo   # or flatland, unity
```

The guide pipes these scripts straight into `bash`. Download them first instead, as above, so their yes/no prompts can read your answers. If the install still fails, a lab that uses Arena 3.0 [recommends](https://github.com/Arena-Rosnav/arena-rosnav/issues/219) its [ivaROS fork](https://github.com/ivaROS/arena-rosnav), which installs on Noetic. Keep in mind that ROS Noetic reached [end of life on May 31, 2025](https://discourse.openrobotics.org/t/ros-noetic-end-of-life-may-31-2025/43160), so you won't get ROS updates or security fixes on this path.

### When the install breaks

Shuijing Liu, who maintains the [awesome-robot-social-navigation](https://github.com/Shuijing725/awesome-robot-social-navigation) list, [described](https://github.com/Shuijing725/awesome-robot-social-navigation/issues/12#issuecomment-3837153733) Arena 4.0 as "not super easy to install." The same few problems come up repeatedly in the issue trackers. Here they are, with the fixes that worked:

1. **Packages like `cv_bridge`, `vision_msgs`, or `pcl_msgs` fail to build (4.0).** In [issue #215](https://github.com/Arena-Rosnav/arena-rosnav/issues/215), the maintainer's first suspect is a ROS 2 Humble that's already sourced in your shell, usually from `~/.bashrc`. Comment out `source /opt/ros/humble/setup.bash`, deactivate conda or any venv, open a fresh terminal, and run the installer again.
2. **rosdep is missing on a fresh system.** Users in the same thread got further after installing and initializing it: `python3-rosdep2` from Ubuntu, or `python3-rosdep` from the ROS 2 apt repository, then `sudo rosdep init` and `rosdep update`.
3. **Downloads fail halfway.** One reporter traced part of their errors to a VPN. Fix the network and run the installer again; it resumes.
4. **The docs don't match your code.** Use the docs list above. [Issue #219](https://github.com/Arena-Rosnav/arena-rosnav/issues/219) comes from someone who couldn't find how to install version 3 at all.
5. **Nothing appears after launch.** In 4.0, pass `sim:=gazebo` or `sim:=isaac`, since the default is `dummy`. In 5.0, install the simulator first, or `sim:=` fails with an install hint.
6. **Docker says "Unknown runtime specified 'nvidia'" (5.0).** Run `sudo nvidia-ctk runtime configure --runtime=docker` and restart Docker. If RViz crashes with an OpenGL error, add `LIBGL_ALWAYS_SOFTWARE=1` to the `.env` file in your workspace.
7. **Your system changed in ways you didn't expect.** The 4.0 installer offers to delete apt source files for other ROS versions (the default answer is yes), and it adds pyenv and Poetry to your shell config. The ROS 1 installers add lines to `~/.bashrc` and `~/.zshrc`. Use a spare machine or a fresh Ubuntu install if you can, or the 5.0 container.

[Issue #213](https://github.com/Arena-Rosnav/arena-rosnav/issues/213), opened in July 2025, asks whether Arena 5.0's Isaac Sim support is open source. It was filed on `Arena-Rosnav/arena-rosnav`, whose default branch is the ROS 1 `master`, so the Isaac code isn't visible there. At the time it was on the `humble` branch, and today it lives in `voshch/Arena`. Isaac Sim support matters, because very few social navigation simulators run on the GPU, a gap the [same awesome-list thread](https://github.com/Shuijing725/awesome-robot-social-navigation/issues/12) points out.

### See it running

If you'd like to see Arena before installing it, the conference videos show it in action. Here is Arena 3.0 at RSS 2024:

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include video.liquid path="https://www.youtube.com/embed/V1ltwfrGoWQ" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

And Arena 5.0 at RSS 2025:

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include video.liquid path="https://www.youtube.com/embed/5VdrL1wgMJs" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## SEAN

SEAN, the Social Environment for Autonomous Navigation, comes from Yale. [Nathan Tsoi](https://www.nathantsoi.com/) led its development during his PhD in Marynel Vázquez's [Interactive Machines Group](https://interactive-machines.com/), and he is now a postdoc at UT Austin. SEAN simulates the world in Unity and drives the robot through ROS.

[SEAN 2.0](https://doi.org/10.1109/LRA.2022.3196783) describes the context around a robot as a social situation, and it gives exact, logic-based definitions for five of them. In Cross Path, someone walks across the robot's direction of travel. In Down Path, someone moves parallel to it, alongside or head-on. Join Group and Leave Group cover the robot joining or leaving a conversational group, and Empty means no one is nearby. SEAN generates pedestrian behavior that creates these situations, including a new Behavior Graph method, and scores each run with social metrics like personal-space violations.

| Version                                              | Venue        | Code                                                                                                                                                                                  |
| ---------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SEAN 1.0](https://doi.org/10.1145/3406499.3418760)  | HAI 2020     | [`yale-sean`](https://github.com/yale-sean) GitHub org                                                                                                                                |
| [SEAN 2.0](https://doi.org/10.1109/LRA.2022.3196783) | RA-L 2022    | [`social_sim_unity`](https://github.com/yale-sean/social_sim_unity), [`social_sim_ros`](https://github.com/yale-sean/social_sim_ros), [`sim_ws`](https://github.com/yale-sean/sim_ws) |
| [SEAN-VR](https://doi.org/10.1145/3568294.3580039)   | HRI 2023     | Built on 2.0                                                                                                                                                                          |
| SEAN 3.0                                             | No paper yet | Not public yet                                                                                                                                                                        |

Use 2.0 for now, since it's the version in the public repos. Its [setup guide](https://sean.interactive-machines.com/docs/setup) recommends running Unity on [Windows](https://sean.interactive-machines.com/docs/setup-windows) and ROS in WSL2, because a Unity bug on Ubuntu slows down background camera rendering. There's also an Ubuntu 20.04 path, which pins Unity 2020.3.48f1. Either way, you install Unity through Unity Hub with a Unity account, and the ROS side is Noetic, which reached end of life in May 2025.

The [3.0 docs](https://yale-sean.github.io/documentation/) are already online, but you can't follow them yet. They keep the Windows-plus-WSL2 setup and ROS Noetic, then check out an `hdrp-rl` branch of `yale-img` repos that weren't public when I checked. The [docs' README](https://github.com/yale-sean/documentation) lists publishing those branches as a to-do, so 3.0 looks close. Watch the [`yale-sean`](https://github.com/yale-sean) GitHub org for the release.

Here is SEAN 2.0's video:

<div class="row mt-3">
  <div class="col-sm mt-3 mt-md-0">
    {% include video.liquid path="https://www.youtube.com/embed/Yu3zpxQPizU" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

## How I run them: one container per simulator

I keep each simulator in its own Docker container, started from the official ROS image for its ROS version. A broken install then stays inside one container, and the host and the other simulators never notice.

- **SEAN 2.0** runs in a `ros:noetic` container with host networking, so the Unity side can reach its TCP bridge. The ROS side is a handful of processes (roscore, the TCP bridge, the robot description, the navigation stack, and RViz), so I start them with tmux or tmuxinator.
- **[arena-rosnav-3D](https://github.com/ignc-research/arena-rosnav-3D)**, the Gazebo version of the original Arena, runs in another `ros:noetic` container with GPU access and X11 forwarding, so Gazebo and RViz can open windows on the host.

I needed a few fixes along the way. The `ros:noetic` image is minimal, so expect to install git and `ros-noetic-desktop-full` (for Gazebo and RViz) before anything builds. In arena-rosnav-3D, `spencer_tracking_rviz_plugin`, an RViz plugin that comes with its pedsim fork, failed to build for me, so I skipped it by putting an empty `CATKIN_IGNORE` file in its folder. Its GUI launcher also needed a terminal emulator such as `xterm` inside the container.

## Other simulators

Arena and SEAN aren't the only options. Shuijing Liu's [awesome-robot-social-navigation](https://github.com/Shuijing725/awesome-robot-social-navigation) list is the best index I know of, and besides those two, it lists:

- **2D:** [CrowdNav](https://github.com/vita-epfl/CrowdNav) (and its extension [CrowdSimPlus](https://github.com/sepsamavi/safe-interactive-crowdnav?tab=readme-ov-file#crowdsimplus-simulator)), [SocNavBench](https://github.com/CMU-TBD/SocNavBench), [SocNav1](https://github.com/gnns4hri/SocNav1), [SocNav2](https://github.com/jginesclavero/social_nav2), [ir-sim](https://github.com/hanruihua/ir-sim)
- **3D:** [Pedsim-ROS](https://github.com/srl-freiburg/pedsim_ros), [pedsim_ros_with_gazebo](https://github.com/TempleRAIL/pedsim_ros_with_gazebo), [HuNavSim](https://arxiv.org/pdf/2305.01303), [Habitat 3.0](https://aihabitat.org/habitat3/), [iGibson](https://github.com/StanfordVL/iGibsonChallenge2021), [gym_ped_sim](https://github.com/onlytailei/gym_ped_sim)

For background on the crowd simulators many of these build on, see [_A Review of Software for Crowd Simulation_](https://urban-analytics.github.io/dust/docs/ped_sim_review.pdf).

## Using LLMs for installs

LLMs are useful for reading build errors and porting ROS 1 code to ROS 2. Generating install steps from a repo link is less reliable for these projects, for three reasons:

1. **The sources disagree.** Docs for 4.0 and 5.0, ROS 1 and ROS 2 branches, and moved links can get blended into one set of steps, such as a Humble script run on a Jazzy checkout. Even a paper and its own code can disagree, like Arena 5.0's Figure 2 showing Unity.
2. **Gaps get filled with guesses.** A model may suggest package names or launch arguments that don't exist.
3. **The dependency chain is long.** The OS, ROS distro, Python, Poetry, CUDA, and the Gazebo, Unity, or Isaac version all have to line up.

The result is usually commands that look right, run for an hour, and then fail. Results improve when the model has the README from your exact branch, along with your OS and ROS distro, and is asked which file each step comes from.

## Checklist

1. **Pick your ROS version first** (Noetic on 20.04, Humble on 22.04, Jazzy in Docker), then the matching branch and docs.
2. **Check the simulator against the code**, not the paper or project page.
3. **Start from a clean shell**, with no ROS sourced and no conda or venv active.
4. **Use a container or a spare machine**, because the installers edit apt sources and shell config.
5. **Budget disk, time, and GPU:** about 30 GB for 3.0, 80+ GB and over an hour for 4.0, and an RTX GPU with 16 GB of VRAM for Isaac Sim.
6. **If it fails, re-run it, then read the open issues.** Your error is often already in [issue #215](https://github.com/Arena-Rosnav/arena-rosnav/issues/215).
7. **Write down the commit, and cite the version you used.** Each version is a separate paper.

## Acknowledgments

Thanks to Linh Kästner, Volodymyr Shcherbyna, and everyone who has worked on Arena; to Nathan Tsoi, Marynel Vázquez, and the SEAN team; and to Shuijing Liu for the awesome-robot-social-navigation list. Building and maintaining these tools takes years of work. If I got something wrong here, [email me](mailto:sderh001@ucr.edu) and I'll fix it.

## Links

**Arena, version by version**

- Arena-Rosnav (IROS 2021): [paper](https://ieeexplore.ieee.org/document/9636226), [arXiv](https://arxiv.org/abs/2104.03616), [code](https://github.com/ignc-research/arena-rosnav), [Gazebo code](https://github.com/ignc-research/arena-rosnav-3D)
- Arena-Bench (RA-L/IROS 2022): [paper](https://doi.org/10.1109/LRA.2022.3190086), [arXiv](https://arxiv.org/abs/2206.05728), [code](https://github.com/ignc-research/arena-bench)
- Arena-Rosnav 2.0 (IROS 2023): [paper](https://doi.org/10.1109/IROS55552.2023.10342152), [arXiv](https://arxiv.org/abs/2302.10023), [code tags](https://github.com/Arena-Rosnav/arena-rosnav/tags)
- Arena-Web (RSS 2023): [paper](https://www.roboticsproceedings.org/rss19/p088.html)
- Arena 3.0 (RSS 2024): [paper](https://roboticsproceedings.org/rss20/p074.html), [arXiv](https://arxiv.org/abs/2406.00837), [project page](https://arena-rosnav.org/arena-3/), [code](https://github.com/Arena-Rosnav/arena-rosnav/tree/master), [install guide](https://github.com/Arena-Rosnav/.github/blob/arena3/docs/user_guides/installation.md), [usage guide](https://github.com/Arena-Rosnav/.github/blob/arena3/docs/user_guides/usage.md), [video](https://youtu.be/V1ltwfrGoWQ)
- Arena 4.0 (ICRA 2025): [paper](https://doi.org/10.1109/ICRA55743.2025.11127635), [arXiv](https://arxiv.org/abs/2409.12471), [project page](https://arena-rosnav.org/arena-4/), [code](https://github.com/Arena-Rosnav/arena-rosnav/tree/humble), [docs](https://arena-rosnav.readthedocs.io/en/latest/), [install guide](https://arena-rosnav.readthedocs.io/en/latest/tutorials/installation/), [usage guide](https://arena-rosnav.readthedocs.io/en/latest/tutorials/usage/)
- Arena 5.0 (RSS 2025): [paper](https://www.roboticsproceedings.org/rss21/p092.html), [arXiv](https://arxiv.org/abs/2610.11220), [project page](https://arena-rosnav.org/arena-5/), [code](https://github.com/voshch/Arena), [docs](https://docs.arena-rosnav.org/en/latest/), [v0.0.1 pre-release](https://github.com/voshch/Arena/releases/tag/v0.0.1), [video](https://www.youtube.com/watch?v=5VdrL1wgMJs)
- Arena-Bench 2.0 (IROS 2025): [paper](https://doi.org/10.1109/IROS60139.2025.11246895)
- PEDS (RA-L 2026): [project page](https://arena-rosnav.org/pedsral26/)

**Arena, everything else**

- Project: [arena-rosnav.org](https://arena-rosnav.org/), [ARENA Lab](https://arena-lab.org/), [Linh Kästner](https://linhdoan.io/), [Volodymyr Shcherbyna](https://github.com/voshch), [Discord](https://discord.gg/GNTTf9DKyp), [worksheets](https://edu.arena-rosnav.org/)
- Docs pages: [planners](https://docs.arena-rosnav.org/en/latest/arena_planners/), [MuJoCo](https://docs.arena-rosnav.org/en/latest/arena_mujoco/), [flatsim](https://docs.arena-rosnav.org/en/latest/flatsim/), [4.0 docs source](https://github.com/Arena-Rosnav/.github/blob/master/docs/index.md)
- GitHub: [Arena-Rosnav org](https://github.com/Arena-Rosnav), [`master`](https://github.com/Arena-Rosnav/arena-rosnav/tree/master), [`humble`](https://github.com/Arena-Rosnav/arena-rosnav/tree/humble), [`ros2`](https://github.com/Arena-Rosnav/arena-rosnav/tree/ros2), [`unity-simulator`](https://github.com/Arena-Rosnav/arena-rosnav/tree/unity-simulator), [`dev`](https://github.com/Arena-Rosnav/arena-rosnav/tree/dev)
- Simulator repos: [arena-unity](https://github.com/Arena-Rosnav/arena-unity) ([releases](https://github.com/Arena-Rosnav/arena-unity/releases)), [unity-ros-navigation](https://github.com/Arena-Rosnav/unity-ros-navigation), [arena2d](https://github.com/Arena-Rosnav/arena2d)
- Fork: [ivaROS/arena-rosnav](https://github.com/ivaROS/arena-rosnav)
- Issues: [#213](https://github.com/Arena-Rosnav/arena-rosnav/issues/213), [#215](https://github.com/Arena-Rosnav/arena-rosnav/issues/215), [#219](https://github.com/Arena-Rosnav/arena-rosnav/issues/219), and the [awesome-list thread](https://github.com/Shuijing725/awesome-robot-social-navigation/issues/12) with [Shuijing Liu's comment](https://github.com/Shuijing725/awesome-robot-social-navigation/issues/12#issuecomment-3837153733)

**SEAN**

- SEAN 1.0 (HAI 2020): [paper](https://doi.org/10.1145/3406499.3418760), [arXiv](https://arxiv.org/abs/2009.04300)
- SEAN 2.0 (RA-L 2022): [paper](https://doi.org/10.1109/LRA.2022.3196783), [free copy on the author's site](https://www.nathantsoi.com/papers/SEAN_2.0_Formalizing_and_Generating_Social_Situations_for_Robot_Navigation.pdf), [docs](https://sean.interactive-machines.com), [setup guide](https://sean.interactive-machines.com/docs/setup), [Windows setup](https://sean.interactive-machines.com/docs/setup-windows), [video](https://youtu.be/Yu3zpxQPizU)
- SEAN-VR (HRI 2023): [paper](https://doi.org/10.1145/3568294.3580039), [free copy on NSF PAR](https://par.nsf.gov/servlets/purl/10461833)
- SEAN 3.0: [docs](https://yale-sean.github.io/documentation/), [getting started](https://yale-sean.github.io/documentation/getting_started/), [docs source](https://github.com/yale-sean/documentation)
- Code: [yale-sean org](https://github.com/yale-sean), [social_sim_unity](https://github.com/yale-sean/social_sim_unity), [social_sim_ros](https://github.com/yale-sean/social_sim_ros), [sim_ws](https://github.com/yale-sean/sim_ws)
- People: [Nathan Tsoi](https://www.nathantsoi.com/), [Interactive Machines Group](https://interactive-machines.com/)

**Other simulators**

- [awesome-robot-social-navigation](https://github.com/Shuijing725/awesome-robot-social-navigation)
- 2D: [CrowdNav](https://github.com/vita-epfl/CrowdNav), [CrowdSimPlus](https://github.com/sepsamavi/safe-interactive-crowdnav?tab=readme-ov-file#crowdsimplus-simulator), [SocNavBench](https://github.com/CMU-TBD/SocNavBench), [SocNav1](https://github.com/gnns4hri/SocNav1), [SocNav2](https://github.com/jginesclavero/social_nav2), [ir-sim](https://github.com/hanruihua/ir-sim)
- 3D: [Pedsim-ROS](https://github.com/srl-freiburg/pedsim_ros), [pedsim_ros_with_gazebo](https://github.com/TempleRAIL/pedsim_ros_with_gazebo), [HuNavSim](https://arxiv.org/pdf/2305.01303), [Habitat 3.0](https://aihabitat.org/habitat3/), [iGibson](https://github.com/StanfordVL/iGibsonChallenge2021), [gym_ped_sim](https://github.com/onlytailei/gym_ped_sim)
- [A Review of Software for Crowd Simulation](https://urban-analytics.github.io/dust/docs/ped_sim_review.pdf)

**Tools and references**

- [NVIDIA Container Toolkit install guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
- [Isaac Sim system requirements](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html)
- [ROS Noetic end-of-life announcement](https://discourse.openrobotics.org/t/ros-noetic-end-of-life-may-31-2025/43160)
