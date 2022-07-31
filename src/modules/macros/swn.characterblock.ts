import {Character} from "$:/plugins/justinian/swn/swn.js";


export const name = "swn.characterblock";

export const params = [
  {name: "class"},
  {name: "race"},
  {name: "str", default:10},
  {name: "dex", default:10},
  {name: "con", default:10},
  {name: "int", default:10},
  {name: "wis", default:10},
  {name: "cha", default:10},
  {name: "ac"},
  {name: "hp"},
  {name: "saves"},
  {name: "move"},
  {name: "skills"},
  {name: "languages"},
  {name: "factions"},
];

export function run(
  this: any,
  cls: string,
  race: string,
  str: string,
  dex: string,
  con: string,
  int: string,
  wis: string,
  cha: string,
  ac: string,
  hp: string,
  saves: string,
  move: string,
  skills: string,
  languages: string,
  factions: string,
): string {
  if (this.wiki.getTiddler(cls)) {
    cls = `[[${cls}]]`;
  }
  if (this.wiki.getTiddler(race)) {
    race = `[[${race}]]`;
  }
  const nStr = Number.parseInt(str, 10);
  const nDex = Number.parseInt(dex, 10);
  const nCon = Number.parseInt(con, 10);
  const nInt = Number.parseInt(int, 10);
  const nWis = Number.parseInt(wis, 10);
  const nCha = Number.parseInt(cha, 10);
  const character = new Character(
    cls,
    race,
    nStr,
    nDex,
    nCon,
    nInt,
    nWis,
    nCha,
    ac,
    hp,
    saves,
    move,
    skills,
    languages,
    factions,
  );
  return character.render();
}
