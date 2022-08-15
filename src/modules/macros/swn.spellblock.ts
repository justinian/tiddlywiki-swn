import {Spell} from "$:/plugins/justinian/swn/swn.js";


export const name = "swn.spellblock";

export const params = [
  {name: "level"},
  {name: "school"},
];

export function run(
  level: string,
  school: string,
) {
  const nLevel = Number.parseInt(level, 10);
  const spell = new Spell(
    nLevel,
    school,
  );
  return spell.render();
}
