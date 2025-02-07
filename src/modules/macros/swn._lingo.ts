declare const $tw: any;

export const name = "swn._lingo";
export const params = [
  {name: "title"},
];
export function run(this: any, title: string): string {
  const plugin = "justinian/swn";
  const languageTitle = this.getVariable("languageTitle");
  const tiddlerTitle = `$:/plugins/${plugin}/languages/${languageTitle}/${title}`;
  if (this.wiki.isShadowTiddler(tiddlerTitle)) {
    return `{{${tiddlerTitle}}}`;
  }
  // Check if string is defined in dependency.
  const dependents = this.wiki.getTextReference(`$:/languages/${languageTitle}!!dependents`, "");
  const dependentLanguageTitles = $tw.utils.parseStringArray(dependents)
    .map((tiddler: string) => tiddler.replace("$:/languages/", ""));
  for (const dependentLanguageTitle of dependentLanguageTitles) {
    const dependentTiddlerTitle = `$:/plugins/${plugin}/languages/${dependentLanguageTitle}/${title}`;
    if (this.wiki.isShadowTiddler(dependentTiddlerTitle)) {
      return `{{${dependentTiddlerTitle}}}`;
    }
  }
  // Fall back to default string.
  return `{{$:/plugins/${plugin}/language/${title}}}`;
}
