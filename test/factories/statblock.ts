import {Factory} from "rosie";

import {StatBlock} from "../../src/files/swn";


/* tslint:disable:object-literal-sort-keys */
export default new Factory()
  .attrs({
    ac: 10,
    hp: "1d8",
    speed: "30 ft.",
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    morale: 7,
    instinct: 12,
    senses: "passive Perception 10",
    languages: "any one language (usually Common)",
    tags: "any race",
  })
  .after((factory) => {
    // Rosie can pass factory attributes to a constructor function, but the
    // constructor must accept an object instead of positional arguments.
    // Pass the factory values to the StatBlock constructor explicitly.
    return new StatBlock(
      factory.ac,
      factory.hp,
      factory.speed,
      factory.str,
      factory.dex,
      factory.con,
      factory.int,
      factory.wis,
      factory.cha,
      factory.senses,
      factory.languages,
      factory.tags,
      factory.saves,
      factory.skills,
      factory.morale,
      factory.instinct,
    );
  });
/* tslint:enable */
