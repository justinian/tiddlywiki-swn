import {capitalize} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn._spellDescription";
export const params = [
  {name: "level"},
  {name: "school"},
];
export function run(this: any, level: string, school: string) {
  let template: string = "Spell/DescriptionFormat/Default";

  const format = this.wiki.renderText("text/plain", "text/vnd.tiddlywiki", `<<swn._lingo ${template}>>`);
  const schoolName = this.wiki.renderText(
    "text/plain",
    "text/vnd.tiddlywiki",
    `<<swn._lingo Spell/School/${capitalize(school)}>>`,
  );

  const replacements: {[index: string]: string | number} = {
    School: schoolName,
    level: `<<swn._lingo Spell/Level/${level}>>`,
    school: schoolName.toLocaleLowerCase(),
  };
  const rendered = format.replace(/\$(\w+)\$/g, (_: string, key: string) => replacements[key]);
  return rendered;
}
