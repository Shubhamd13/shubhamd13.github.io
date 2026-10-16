---
layout: page
title: 12-DOF Quadruped Robot
description: A four-legged walking robot we designed in SolidWorks, 3D-printed, wired up, and controlled over Wi-Fi from a Python GUI.
img: assets/img/Assembly.png
importance: 1
category: work
---

<div class="row justify-content-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/Assembly.png" title="SolidWorks assembly" alt="SolidWorks assembly of the 12-DOF quadruped" class="img-fluid rounded z-depth-1" caption="Full SolidWorks assembly of the robot." %}
  </div>
</div>

**UC Riverside, 2025** · with Shubham Jangle and Soumya Mondal · [Source on GitHub](https://github.com/Shubhamd13/12-DOF-Quadruped-Robot)

## Overview

This robot is a hardware platform for experimenting with legged locomotion on rough terrain. It has four legs with three joints each, for 12 degrees of freedom in total. We built all of it ourselves: the mechanical design, fabrication, electronics, and control software. A laptop sends joint angles to the robot over Wi-Fi, and an onboard camera streams video back.

## Mechanical design

- We designed the chassis and the articulated leg linkages in **SolidWorks**.
- We chose the 12 servos (MG996R and SG90) based on torque requirements worked out from the leg geometry and the robot's weight.
- All body and leg parts are printed in PLA. It took several print-and-fit iterations before the parts went together cleanly.

<div class="row justify-content-center">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include video.liquid path="assets/video/quadruped/3d-printing.mp4" class="img-fluid rounded z-depth-1" controls=true muted=true loop=true caption="Printing leg and body parts on a Bambu Lab printer." %}
  </div>
</div>

## Electronics and the Wi-Fi link

<div class="row justify-content-center">
  <div class="col-sm-12 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/projects/quadruped/wifi-link.svg" title="Electronics and Wi-Fi link" alt="Laptop GUI sends HTTP commands over Wi-Fi to an Arduino UNO R4 WiFi, which drives a PCA9685 PWM board and 12 servos; an ESP32-CAM streams video back to an OpenCV viewer on the laptop" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

- An **Arduino UNO R4 WiFi** runs a small HTTP server. `/servo?ch0=…&ch1=…` sets joint angles, and `/ping` lets the GUI check the connection every few seconds.
- The Arduino drives a **PCA9685** 16-channel PWM board at 50 Hz, which drives the servos.
- Early on, the Arduino kept resetting. We traced it to voltage sag on the servo power wiring and fixed it by moving to a heavier wire gauge.
- An **ESP32-CAM** streams live video over the local network. A small OpenCV viewer (`cam.py`) sets the camera's resolution and quality over HTTP, then shows the feed with an FPS overlay so we could monitor streaming performance during tests.

## Control software and gait

The control GUI (`wifisend.py`) groups the servos by leg, three joints per leg. It has sliders for each joint and can save and reload poses from `servo_positions.json`, which we used for calibration and for a repeatable standing pose.

The walking script (`walk.py`) adds a gait loop that moves the legs in two alternating pairs:

1. Lift and swing the first pair of legs forward, then lower them.
2. Return that pair to its neutral position.
3. Repeat with the second pair.

Swing angle, lift height, and step timing can all be tuned live from the GUI (defaults: 20° swing, 15° lift, 600 ms per step). `invwalk.py` flips the lift direction so the same gait can be tested the other way.

<div class="row align-items-center">
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include video.liquid path="assets/video/quadruped/stand-up.mp4" class="img-fluid rounded z-depth-1" controls=true muted=true loop=true caption="The robot standing up on its own from rest." %}
  </div>
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include video.liquid path="assets/video/quadruped/gait-test.mp4" class="img-fluid rounded z-depth-1" controls=true muted=true loop=true caption="Gait test with the robot held by hand, used to tune timing before ground tests." %}
  </div>
</div>

## Next steps

The current controller is open-loop: it plays back joint angles with no feedback from the body. Planned work:

- IMU feedback so the gait can adapt to keep the body stable
- Ultrasonic obstacle detection, and object or person detection on the camera feed
- Autonomous navigation (A\* / SLAM) and smoother, more power-efficient gait transitions
