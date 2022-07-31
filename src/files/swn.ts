const SKILL_CODES_TO_CAPTIONS: {[index: string]: string} = {
  adm: "Administer",
  con: "Connect",
  cnv: "Convince",
  crf: "Craft",
  exr: "Exert",
  fix: "Fix",
  hea: "Heal",
  kno: "Know",
  lea: "Lead",
  mag: "Magic",
  not: "Notice",
  per: "Perform",
  pil: "Pilot",
  pry: "Pray",
  prg: "Program",
  pun: "Punch",
  rid: "Ride",
  sai: "Sail",
  sht: "Shoot",
  snk: "Sneak",
  stb: "Stab",
  srv: "Survive",
  tlk: "Talk",
  trd: "Trade",
  wrk: "Work",
};
const ABILITY_REGEX = /^(STR|DEX|CON|INT|WIS|CHA).*/i;
const SKILL_REGEX = new RegExp(`^(${Object.keys(SKILL_CODES_TO_CAPTIONS).join("|")}).*`, "i");


export enum AttackType {
  Melee,
  Ranged,
  MeleeOrRanged,
}


interface ITableRow {
  caption: string;
  value: string | number;
}


export class Character {
  constructor(
    public cls: string,
    public race: string,
    public str: number,
    public dex: number,
    public con: number,
    public int: number,
    public wis: number,
    public cha: number,
    public ac: string,
    public hp: string,
    public saves: string,
    public move: string,
    public skills: string,
    public languages: string,
    public factions: string,
  ) {}

  public render(): string {
    let fields = [
      {caption: "Character/Class", value: this.cls},
      {caption: "Character/Race", value: this.race},
      {caption: "StatBlock/Skills", value: this.skills},
    ];
    let output = renderFields(fields, false);
    output.push("");

    const allTens = 
        (this.str === 10) &&
        (this.dex === 10) &&
        (this.con === 10) &&
        (this.int === 10) &&
        (this.wis === 10) &&
        (this.cha === 10);

    if (!allTens) {
      output.push("---");
      const abilities = [
        {caption: "Character/STR", value: this.str},
        {caption: "Character/DEX", value: this.dex},
        {caption: "Character/CON", value: this.con},
        {caption: "Character/INT", value: this.int},
        {caption: "Character/WIS", value: this.wis},
        {caption: "Character/CHA", value: this.cha},
      ];
      output = output.concat(this.renderAbilities(abilities));
      output.push("");
      output.push("---");
    }

    fields = [
      {caption: "StatBlock/AC", value: this.ac},
      {caption: "StatBlock/HP", value: average(this.hp)},
      {caption: "StatBlock/Move", value: this.move},
      {caption: "StatBlock/Saves", value: this.saves},
      {caption: "Character/Languages", value: this.languages},
      {caption: "Character/Factions", value: this.factions},
    ];
    output = output.concat(renderFields(fields, false));
    output.push("");
    output.push("---");

    return output.join("\n");
  }

  private renderAbilities(abilities: ITableRow[]): string[] {
    return [
      "| " + abilities.map((field) => `<<swn._lingo ${field.caption}>>`).join(" | ") + " |h",
      "| " + abilities.map((field) => ability(field.value as number)).join(" | ") + " |",
    ];
  }
}


export class Spell {
  constructor(
    public level: number,
    public school: string,
    public cast: string,
    public ritual: boolean,
    public range: string,
    public verbal: boolean,
    public somatic: boolean,
    public material: string,
    public duration: string,
  ) {}

  get isCantrip(): boolean {
    return !isNaN(this.level) && this.level === 0;
  }

  public render(): string {
    const descriptionLevel = Number.isNaN(this.level) ? "" : this.level;
    let output = [
      `//<<swn._spellDescription level:"${descriptionLevel}" school:"${this.school}" ritual:"${this.ritual}">>//`,
      "",
    ];

    const componentFragments: string[] = [];
    if (this.verbal) {
      componentFragments.push("<<swn._lingo Spell/Verbal>>");
    }
    if (this.somatic) {
      componentFragments.push("<<swn._lingo Spell/Somatic>>");
    }
    if (this.material) {
      componentFragments.push(`<<swn._lingo Spell/Material>> (${this.material})`);
    }
    const components = componentFragments.join(", ");

    const fields = [
      {caption: "Spell/CastingTime", value: this.cast},
      {caption: "Spell/Range", value: this.range},
      {caption: "Spell/Components", value: components},
      {caption: "Spell/Duration", value: this.duration},
    ];
    output = output.concat(renderFields(fields, true));
    output.push("");

    return output.join("\n");
  }
}


export class StatBlock {
  constructor(
    public hd: string,
    public ac: string,
    public attack: string,
    public damage: string,
    public shock: string,
    public move: string,
    public morale: string,
    public instinct: string,
    public skills: string,
    public saves: string,
    public tags: string,
    public senses: string,
    public languages: string,
  ) {}

  public render(): string {
    let output = [];
    if (this.tags) {
        output.push(`//${capitalize(this.tags)}//`);
        output.push("");
    }

    const hdDice = parseInt(this.hd, 10);
    let hp = this.hd;
    if (hdDice > 0) {
        const avg = Math.floor(hdDice * 9 / 2);
        hp = `${hdDice} (${avg} hp)`;
    }

    let fields = [
      {caption: "StatBlock/AC", value: this.ac},
      {caption: "StatBlock/HD", value: hp},
      {caption: "StatBlock/Move", value: this.move},
    ];
    output = output.concat(renderFields(fields, true));
    output.push("");
    output.push("---");

    fields = [
      {caption: "StatBlock/Saves", value: this.saves},
      {caption: "StatBlock/Morale", value: this.morale},
      {caption: "StatBlock/Instinct", value: this.instinct},
      {caption: "StatBlock/Skills", value: this.skills},
    ];
    output = output.concat(renderFields(fields, false));

    fields = [
      {caption: "StatBlock/Senses", value: this.senses},
      {caption: "StatBlock/Languages", value: this.languages},
    ];
    output = output.concat(renderFields(fields, true));
    output.push("");
    output.push("---");

    return output.join("\n");
  }

}


export function ability(score: number): string {
  return `${score} (${modifier(score)})`;
}


export function modifier(score: number): string {
  if (score <=  3) return "−2";
  if (score <=  7) return "−1";
  if (score <= 13) return  "0";
  if (score <= 17) return "+1";
  return "+2";
}


export function average(expr: string): string {
  const regexp = /(\d+)?d(\d+)\s?(?:(-|\+)\s?(\d+))?/i;
  const match = expr.match(regexp);

  if (!match) {
    return expr;
  }

  const nDice = parseInt(match[1], 10) || 1;
  const nSides = parseInt(match[2], 10);
  let op = match[3];
  const mod = parseInt(match[4], 10) || 0;
  let avg;

  if (!op) {
    avg = Math.floor(nDice * (1 + nSides) / 2 + mod);
    return `${avg} (${nDice}d${nSides})`;
  }

  if (op === "+") {
    avg = Math.floor(nDice * (1 + nSides) / 2 + mod);
  } else {
    op = "−";
    avg = Math.floor(nDice * (1 + nSides) / 2 - mod);
  }
  return `${avg} (${nDice}d${nSides} ${op} ${mod})`;
}


export function capitalize(s: string): string {
  return s.charAt(0).toLocaleUpperCase() + s.slice(1);
}


// tslint:disable-next-line:no-shadowed-variable
export function check(ability: string, skill?: string, dc?: number): string {
  const abilityMatch = ability.match(ABILITY_REGEX);
  if (!abilityMatch) {
    return "";
  }
  const abilityCode = abilityMatch[1].toLocaleUpperCase();
  const fragments = [`<<swn._lingo Ability/${abilityCode}>>`];

  if (skill) {
    const skillMatch = skill.match(SKILL_REGEX);
    if (skillMatch) {
      const skillCode = skillMatch[1].toLocaleLowerCase();
      fragments.push(`(<<swn._lingo Skill/${SKILL_CODES_TO_CAPTIONS[skillCode]}>>)`);
    }
  }

  if (dc) {
    fragments.unshift(`<<swn._lingo Check/DC>> ${dc}`);
  }
  return fragments.join(" ");
}


function renderFields(fields: ITableRow[], alwaysRender?: boolean): string[] {
  const output: string[] = [];
  for (const field of fields) {
    if (alwaysRender || field.value) {
      output.push(`|!<<swn._lingo ${field.caption}>> |${field.value} |`);
    }
  }
  return output;
}


export function hit(
  damage: string,
  extraDamage: string,
  condDamage: string,
  extraCondDamage: string,
  when: string,
  effect: string,
): string {
  const buffer = ["//<<swn._lingo StatBlock/Action/Hit>>://"];
  buffer.push(renderDamage(damage, extraDamage));
  let or = "";
  if (condDamage && when) {
    or = `${renderDamage(condDamage, extraCondDamage)} ${when}`;
  }
  let output = buffer.join(" ");
  if (or) {
    output = `${output}, <<swn._lingo StatBlock/Action/Or>> ${or}`;
  }
  if (effect) {
    output = `${output}, ${effect}`;
  }
  return `${output}.`;
}


function renderDamage(damage: string, extraDamage: string): string {
  let buffer = [
    average(damage),
  ];
  if (extraDamage) {
    buffer = buffer.concat([
      "<<swn._lingo StatBlock/Action/Plus>>",
      average(extraDamage),
    ]);
  }
  return buffer.join(" ");
}


export function weaponAttack(
  attackType: AttackType,
  bonus: string,
  shock: string,
  range: string,
) {
  // tslint:disable max-line-length
  let shockTxt = "<<swn._lingo StatBlock/Action/NoShock>>";
  if (shock) {
      shockTxt = `<<swn._lingo StatBlock/Action/Shock>> ${shock}`;
  }
  const attackTypesToCaptions = {
    [AttackType.Melee]: {
      attack: "<<swn._lingo StatBlock/Action/Melee>>",
      shockOrRange: shockTxt,
    },
    [AttackType.Ranged]: {
      attack: "<<swn._lingo StatBlock/Action/Ranged>>",
      shockOrRange: `<<swn._lingo StatBlock/Action/Range>> ${range}`,
    },
    [AttackType.MeleeOrRanged]: {
      attack: "<<swn._lingo StatBlock/Action/MeleeOrRanged>>",
      shockOrRange: `${shockTxt} <<swn._lingo StatBlock/Action/Or>> <<swn._lingo StatBlock/Action/Range>> ${range}`,
    },
  };
  const captions = attackTypesToCaptions[attackType];
  const output = [
    `//${captions.attack}:// ${bonus} <<swn._lingo StatBlock/Action/ToHit>>`,
    captions.shockOrRange,
  ];
  return `${output.join(", ")}.`;
}
