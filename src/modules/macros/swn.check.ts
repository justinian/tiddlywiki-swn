import {check} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn.check";

export const params = [
  {name: "ability"},
  {name: "skill"},
  {name: "dc"},
];

export function run(ability: string, skill: string, dc: string): string {
  const nDC = Number.parseInt(dc, 10);
  return check(ability, skill, nDC);
}
