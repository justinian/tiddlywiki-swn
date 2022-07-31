import {average} from "$:/plugins/justinian/swn/swn.js";

export const name = "swn.average";

export const params = [{name: "expr"}];

export function run(expr: string): string {
  return average(expr);
}
