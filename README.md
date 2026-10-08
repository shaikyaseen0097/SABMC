# SABMC
## Scenario-Aware Biomedical Monitoring Controller

SABMC is a software-based biomedical monitoring and visualization system developed as part of a VLSI/SystemVerilog project.

The system continuously monitors simulated biomedical parameters such as Heart Rate (HR), SpO₂, and Blood Pressure (BP), analyzes their combined condition, and classifies the person's condition into different scenarios.

---

## 🚀 Project Overview

Conventional monitoring systems often consider each vital sign independently.

SABMC introduces a **scenario-aware approach**, where multiple vital parameters are evaluated together to determine the overall scenario:

- 🟢 Normal
- 🟡 Reduced Activity
- 🟠 Distress
- 🔴 Emergency

The monitoring results are displayed through a responsive web dashboard.

---

## 🧠 System Concept

```text
SystemVerilog / VLSI DUT
          │
          ▼
   Biomedical Inputs
   ┌──────┼──────┐
   │      │      │
   HR    SpO₂    BP
   │      │      │
   └──────┼──────┘
          ▼
 Scenario-Aware
 Biomedical Controller
          │
          ▼
    Scenario Detection
          │
 ┌────────┼──────────────┐
 ▼        ▼       ▼      ▼
Normal  Reduced  Distress Emergency
Activity
          │
          ▼
     Web Dashboard
          │
 ┌────────┼─────────┐
 ▼        ▼         ▼
Live    History    Alerts
Data     Data     System
