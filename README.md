# Translation Website Template

This is a trimmed-down version of the Sails website that can be used to host documentation in other languages.

### Pages included

Since the original website has a lot of hard-coded content which can quickly get out-of-date, this app mostly just includes the pages that are dynamically compiled from GitHub. Any pages from the original website that aren't included here are already set up to redirect to the applicable page on sailsjs.com.

The two pages _not_ compiled from markdown that are still included in this app are:

+ Homepage
+ Get Started


### Compiling the documentation from a translation repo

##### Compiling docs locally

First, in `package.json`, edit the `"1.0"` and `"0.12"` scripts so that `sails_remote` is set up to point to your translation repo.

```json
sails_remote="git://github.com/marrouchi/sails-docs-fr"
```

Lift your app

```bash
npm run 0.12
```

Then send an HTTP request to http://localhost:1337/refresh with the `X-Hub-Signature` header set to `whatever`
[![Run in Postman](https://s3.amazonaws.com/postman-static/run-button.png)](https://www.getpostman.com/run-collection/0b8126a8c7ae514d8418)

After a moment, you will see messages like the following showing up in the terminal:

```bash
Compiling `reference` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
Compiling `anatomy` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
Compiling `concepts` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
Compiling `getting-started` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
Compiling `support/irc` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
Compiling `version-notes` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
Compiling `security` docs from the `0.12` branch of `git://github.com/marrouchi/sails-docs-fr`...
```

##### Compiling docs automatically

Once your site is online, if you want to automatically compile the docs when there are changes to the translation repo,
you can set up a webhook in GitHub. In your translation repo, go to **Settings > Webhooks > Add Webhook**, and configure the following settings:

| Setting      |                                          |
| ------------ | ---------------------------------------- |
| Payload URL  | http://YOUR-TRANSLATION-SITE.com/refresh |
| Content type | application/json                         |
| Secret       | (Your super secret password)             |

Then, in your production app's config vars, set 'GITHUB_HOOK_SECRET' to be the super secret password you provided to GitHub. 

### Typography

The original Sails website uses Proxima Nova Soft for the header font, and [Lato](https://fonts.google.com/specimen/Lato) for the body.
Since Proxima Nova Soft is hosted on Typekit and is not available for free, this app uses a similar Google Font, [Mallanna](https://fonts.google.com/specimen/Mallanna?selection.family=Mallanna), instead. The fonts are included in a link in `layout.ejs`, but if you'd rather, you can download them from Google Fonts and host them yourself. ([Font Squirrel's webfont generator](https://www.fontsquirrel.com/tools/webfont-generator) is handy for setting that up.)
