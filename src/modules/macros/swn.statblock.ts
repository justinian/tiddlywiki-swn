import {StatBlock} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn.statblock";

export const params = [
  // All monsters/NPCs have these attributes:
  {name: "hd"},
  {name: "ac"},
  {name: "attack"},
  {name: "damage"},
  {name: "shock"},
  {name: "move"},
  {name: "morale"},
  {name: "instinct"},
  {name: "skills"},
  {name: "saves"},

  // These attributes are optional:
  {name: "tags"},
  {name: "senses"},
  {name: "languages"},
];

export function run(
  hd: string,
  ac: string,
  attack: string,
  damage: string,
  shock: string,
  move: string,
  morale: string,
  instinct: string,
  skills: string,
  saves: string,
  tags: string,
  senses: string,
  languages: string,
) {
  const statblock = new StatBlock(
    hd,
    ac,
    attack,
    damage,
    shock,
    move,
    morale,
    instinct,
    skills,
    saves,
    tags,
    senses,
    languages,
  );
  return statblock.render();
}
