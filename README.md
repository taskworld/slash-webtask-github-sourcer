# slash-webtask-github-sourcer

Make [Slash Webtasks](https://webtask.io/slack) run code directly off GitHub.
This is done by making the webtask load the code from GitHub and evaluate it in webtask’s context.

- Allows Slash Webtasks to be version-controlled and collaboratively edited.

- Uses the GitHub Apps API, so it does not require a personal access token.

## How to set up

1. **Create a GitHub app.**

   1. **For organizations:** Go to your organization settings &rarr; Developer settings &rarr; GitHub Apps &rarr; New GitHub App

      **For personal account:** Go to user settings &rarr; Developer settings &rarr; GitHub Apps &rarr; New GitHub App

   2. Set up your GitHub App permissions as follows:

      - Repository contents: Read-only

   3. Generate and download a **Private Key**.

   4. Note the **App ID**.

   5. Install the app, granting access to the repository where the webtask code is stored.

   6. Note the **Installation ID** which is in the URL.

2. Create a Slash webtask.

   1. In Slack, run `/wt make hello` and click the resulting edit link.

   2. Copy the existing code as-is, and put it in your GitHub Repository. Example: [hello.js](hello.js)

   3. Put in this code, change things as required:

      ```js
      module.exports = require('slash-webtask-github-sourcer')({
        owner: 'taskworld',
        repo: 'slash-webtask-github-sourcer',
        appId: 12345,
        installationId: 1234567,
        path: 'hello.js',
      })
      ```

   4. Configure the webtask **Secrets** &rarr; **Add Secret**

      - Secret key: **GH_APP_PRIVATE_KEY_BASE64**
      - Secret value: _(encode the **Private Key** using Base64 and paste it here)_

   5. Configure the webtask **npm Modules** &rarr; **Add Module** &rarr; Type in **slash-webtask-github-sourcer**.
