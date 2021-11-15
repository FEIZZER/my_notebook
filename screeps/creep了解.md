## Creeps 能力

每个 Creep 的能力由 Creep 的构造部件决定：

- `WORK` – 收集能量，建造和修复结构，升级控制器的能力。100
- `MOVE` – 移动的能力。 50
- `CARRY` – 运输能源的能力。50
- `ATTACK` – 短距离攻击的能力。80
- `RANGED_ATTACK` – 长距离攻击的能力。 150
- `HEAL` – 治疗其他单位的能力。250
- `CLMOVEAIM` - 控制领土的能力。600
- `TOUGH` – “空”部件，唯一作用就是承受伤害。 10

## 移动力MOVE

creep身上的组件会给creep增加疲劳值 *除`MOVE`， 而`CARRY`组件，当creep不带东西时候没有减速效果*，每个组件在道路上为 1 点，平原上为 2 点，沼泽里为 10 点。

每个`MOVE` 会减少两点疲劳值，当疲劳值大于0时，creep移动速度会按比例减少。

- Creep `[CARRY, WORK, MOVE]` 在没有搬运能量的时候一个 tick 可以跑 1 格，搬了能量以后 2 个 tick 才能跑 1 格。
- Creep `[TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE]` 将以满速（1 个 tick 一格）行动。
- Creep `[TOUGH, ATTACK, ATTACK, MOVE, MOVE]` 根据向上取整原则 2 个 tick 移动 1 格。



