/* tslint:disable:max-line-length object-literal-sort-keys */
import * as swn from "../src/files/swn";

describe("ability", () => {
  [
    {score: 1, expected: "1 (−2)"},
    {score: 5, expected: "5 (−1)"},
    {score: 10, expected:  "10 (0)"},
    {score: 15, expected:  "15 (+1)"},
    {score: 20, expected:  "20 (+2)"},
    {score: 30, expected:  "30 (+2)"},
  ].forEach((example) => {
    it(`should return "${example.expected}" for score "${example.score}"`, () => {
      expect(swn.ability(example.score)).toBe(example.expected);
    });
  });
});


describe("average", () => {
  [
    {expr: "10", expected: "10"},
    {expr: "d20", expected: "10 (1d20)"},
    {expr: "1d20", expected: "10 (1d20)"},
    {expr: "2d20+10", expected:  "31 (2d20 + 10)"},
    {expr: "2d20-10", expected:  "11 (2d20 − 10)"},
  ].forEach((example) => {
    it(`should return "${example.expected}" for score "${example.expr}"`, () => {
      expect(swn.average(example.expr)).toBe(example.expected);
    });
  });
});


describe("capitalize", () => {
  [
    {description: "small beast", expected: "Small beast"},
  ].forEach((example) => {
    it(`should return "${example.expected}" for description "${example.description}"`, () => {
      expect(swn.capitalize(example.description)).toBe(example.expected);
    });
  });
});


describe("check", () => {
  [
    {args: ["cha"], expected: "<<swn._lingo Ability/CHA>>"},
    {args: ["CHA"], expected: "<<swn._lingo Ability/CHA>>"},
    {args: ["charisma"], expected: "<<swn._lingo Ability/CHA>>"},
    {args: ["Charisma"], expected: "<<swn._lingo Ability/CHA>>"},
    {args: ["cha", "sai"], expected: "<<swn._lingo Ability/CHA>> (<<swn._lingo Skill/Sail>>)"},
    {args: ["CHA", "SAI"], expected: "<<swn._lingo Ability/CHA>> (<<swn._lingo Skill/Sail>>)"},
    {args: ["cha", undefined, 15], expected: "<<swn._lingo Check/DC>> 15 <<swn._lingo Ability/CHA>>"},
    {args: ["cha", "sai", 15], expected: "<<swn._lingo Check/DC>> 15 <<swn._lingo Ability/CHA>> (<<swn._lingo Skill/Sail>>)"},
    {args: ["dex", "fix"], expected: "<<swn._lingo Ability/DEX>> (<<swn._lingo Skill/Fix>>)"},
    {args: ["dex", "admin"], expected: "<<swn._lingo Ability/DEX>> (<<swn._lingo Skill/Administer>>)"},
    {args: ["dex", "admini"], expected: "<<swn._lingo Ability/DEX>> (<<swn._lingo Skill/Administer>>)"},
    {args: ["dex", "Administer"], expected: "<<swn._lingo Ability/DEX>> (<<swn._lingo Skill/Administer>>)"},
    // Unknown ability:
    {args: ["foo"], expected: ""},
    {args: ["foo", "perf"], expected: ""},
    {args: ["foo", "perf", 15], expected: ""},
    // Unknown skill:
    {args: ["cha", "foo"], expected: "<<swn._lingo Ability/CHA>>"},
    {args: ["cha", "foo", 15], expected: "<<swn._lingo Check/DC>> 15 <<swn._lingo Ability/CHA>>"},
    // Ambiguous skill:
    {args: ["cha", "p"], expected: "<<swn._lingo Ability/CHA>>"},
    {args: ["cha", "p", 15], expected: "<<swn._lingo Check/DC>> 15 <<swn._lingo Ability/CHA>>"},
    // Unusual combination:
    {args: ["cha", "pun", 15], expected: "<<swn._lingo Check/DC>> 15 <<swn._lingo Ability/CHA>> (<<swn._lingo Skill/Punch>>)"},
  ].forEach((example) => {
    it(`should return "${example.expected}" for (${example.args[0]}, ${example.args[1]}, ${example.args[2]})`, () => {
      const ability = example.args[0] as string;
      const skill = example.args[1] as string;
      const dc = example.args[2] as number;
      expect(swn.check(ability, skill, dc)).toBe(example.expected);
    });
  });
});


describe("hit", () => {
  [
    {
      args: ["1d8"],
      expected: "//<<swn._lingo StatBlock/Action/Hit>>:// 4 (1d8)."},
    {
      args: ["1d8", "1d4"],
      expected: "//<<swn._lingo StatBlock/Action/Hit>>:// 4 (1d8) <<swn._lingo StatBlock/Action/Plus>> 2 (1d4).",
    },
    {
      args: ["1d8", "", "1d10", "", "if wielded with two hands"],
      expected: "//<<swn._lingo StatBlock/Action/Hit>>:// 4 (1d8), <<swn._lingo StatBlock/Action/Or>> 5 (1d10) if wielded with two hands.",
    },
    {
      args: ["1d8", "1d4", "1d10", "1d4", "if wielded with two hands"],
      expected: "//<<swn._lingo StatBlock/Action/Hit>>:// 4 (1d8) <<swn._lingo StatBlock/Action/Plus>> 2 (1d4), <<swn._lingo StatBlock/Action/Or>> 5 (1d10) <<swn._lingo StatBlock/Action/Plus>> 2 (1d4) if wielded with two hands.",
    },
    {
      args: ["1d8", "1d4", "1d10", "1d4", "if wielded with two hands", "and the target must make a Strength saving throw (DC 10) or be knocked prone"],
      expected: "//<<swn._lingo StatBlock/Action/Hit>>:// 4 (1d8) <<swn._lingo StatBlock/Action/Plus>> 2 (1d4), <<swn._lingo StatBlock/Action/Or>> 5 (1d10) <<swn._lingo StatBlock/Action/Plus>> 2 (1d4) if wielded with two hands, and the target must make a Strength saving throw (DC 10) or be knocked prone.",
    },
  ].forEach((example) => {
    it(`should return "${example.expected}"`, () => {
      const damage = example.args[0] as string;
      const extraDamage = example.args[1] as string;
      const condDamage = example.args[2] as string;
      const extraCondDamage = example.args[3] as string;
      const when = example.args[4] as string;
      const effect = example.args[5] as string;
      expect(swn.hit(damage, extraDamage, condDamage, extraCondDamage, when, effect)).toBe(example.expected);
    });
  });
});


describe("weaponAttack", () => {
  [
    {
      args: [swn.AttackType.Melee, "+3", "3/15"],
      expected: "//<<swn._lingo StatBlock/Action/Melee>>:// +3 <<swn._lingo StatBlock/Action/ToHit>>, <<swn._lingo StatBlock/Action/Shock>> 3/15.",
    },
    {
      args: [swn.AttackType.Melee, "+3", "4/AC20", ""],
      expected: "//<<swn._lingo StatBlock/Action/Melee>>:// +3 <<swn._lingo StatBlock/Action/ToHit>>, <<swn._lingo StatBlock/Action/Shock>> 4/AC20.",
    },
    {
      args: [swn.AttackType.Ranged, "+3", "", "20/300 ft."],
      expected: "//<<swn._lingo StatBlock/Action/Ranged>>:// +3 <<swn._lingo StatBlock/Action/ToHit>>, <<swn._lingo StatBlock/Action/Range>> 20/300 ft..",
    },
    {
      args: [swn.AttackType.Ranged, "+3", "", "20/300 ft."],
      expected: "//<<swn._lingo StatBlock/Action/Ranged>>:// +3 <<swn._lingo StatBlock/Action/ToHit>>, <<swn._lingo StatBlock/Action/Range>> 20/300 ft..",
    },
    {
      args: [swn.AttackType.Ranged, "+3", "not used", "20/300 ft."],
      expected: "//<<swn._lingo StatBlock/Action/Ranged>>:// +3 <<swn._lingo StatBlock/Action/ToHit>>, <<swn._lingo StatBlock/Action/Range>> 20/300 ft..",
    },
    {
      args: [swn.AttackType.MeleeOrRanged, "+3", "5/16", "10/30 ft."],
      expected: "//<<swn._lingo StatBlock/Action/MeleeOrRanged>>:// +3 <<swn._lingo StatBlock/Action/ToHit>>, <<swn._lingo StatBlock/Action/Shock>> 5/16 <<swn._lingo StatBlock/Action/Or>> <<swn._lingo StatBlock/Action/Range>> 10/30 ft..",
    },
  ].forEach((example) => {
    it(`should return "${example.expected}" for (${example.args[0]}, ${example.args[1]}, ${example.args[2]}, ${example.args[3]}, ${example.args[4]})`, () => {

      const attackType = example.args[0] as swn.AttackType;
      const mod = example.args[1] as string;
      const shock = example.args[2] as string;
      const range = example.args[3] as string;
      expect(swn.weaponAttack(attackType, mod, shock, range)).toBe(example.expected);
    });
  });
});
