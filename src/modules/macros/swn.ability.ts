import {ability} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn.ability";

export const params = [{name: "score"}];

export function run(this: any, score: string): string {
  const nScore = Number.parseInt(score, 10);
  return ability(nScore);
}
