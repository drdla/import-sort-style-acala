# import-sort-style-acala

Custom sort style for [import-sort](https://github.com/renke/import-sort).

This sort style offers a general first-party group plus up to four specific groups for first-party modules.

Install import-sort in your project like this:

```bash
$ yarn add -D import-sort import-sort-cli import-sort-config import-sort-parser-babylon import-sort-parser-typescript
```

Also add this sort style:

```bash
$ yarn add -D import-sort-style-acala
```

Now you should add an .importsortrc with a configuration for this sort style.

It will look something like this:

```
{
  ".ts, .tsx, .mdx": {
    "parser": "typescript",
    "style": "acala",
    "options": {
      "knownFirstParty": [
        "~/"
      ],
      "groupByPrefix1": [
        "~/constants"
      ],
      "groupByPrefix2": [
        "~/modules"
      ],
      "groupByPrefix3": [
        "~/components"
      ]
    }
  },
  ".js, .jsx": {
    "parser": "babylon",
    "style": "acala",
    "options": {
      "knownFirstParty": [
        "~/"
      ],
      "groupByPrefix1": [
        "~/constants"
      ],
      "groupByPrefix2": [
        "~/modules"
      ],
      "groupByPrefix3": [
        "~/components"
      ]
    }
  }
}
```

With that in place, you can run import-sort. For convenience you should add a script to your package.json, which will look something like this:

```
...
scripts: {
  "sort-imports": "import-sort --write \"src/**/*.{js,jsx,ts,tsx,mdx}\" \"!src/**/*.d.ts\"",
  ...
},
...
```

When you now run

```bash
$ yarn sort-import
```

it will automatically sort all imports in your src folder and write the changes.
