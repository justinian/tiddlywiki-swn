import {modifier} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn.modifier";

export const params = [{name: "score"}];

export function run(this: any, score: string): string {
  const nScore = Number.parseInt(score, 10);
  return modifier(nScore);
}
