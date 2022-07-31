import {AttackType, hit, weaponAttack} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn.attack";

export const params = [
  {name: "name"},
  {name: "type"},
  {name: "bonus"},
  {name: "shock"},
  {name: "range"},
  {name: "damage"},
  {name: "extraDamage"},
  {name: "condDamage"},
  {name: "extraCondDamage"},
  {name: "when"},
  {name: "effect"},
];

// tslint:disable no-shadowed-variable
export function run(
  this: any,
  name: string,
  attackType: string,
  bonus: string,
  shock: string,
  range: string,
  damage: string,
  extraDamage: string,
  condDamage: string,
  extraCondDamage: string,
  when: string,
  effect: string,
): string {
  const attackTypes: {[index: string]: AttackType} = {
    both: AttackType.MeleeOrRanged,
    melee: AttackType.Melee,
    ranged: AttackType.Ranged,
  };
  const eAttackType = attackTypes[attackType.toLowerCase()];
  if (eAttackType == null) {
    return "";
  }
  const output = [
    `//''${name}.''//`,
    weaponAttack(eAttackType, bonus, shock, range),
    hit(
      damage,
      extraDamage,
      condDamage,
      extraCondDamage,
      when,
      effect,
    ),
  ];
  return output.join(" ");
}
