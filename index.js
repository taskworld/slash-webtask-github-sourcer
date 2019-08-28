const { App } = require('@octokit/app')
const Octokit = require('@octokit/rest')

module.exports = function slashWebtaskFromGitHub({
  owner,
  repo,
  appId,
  installationId,
  path,
  ref,
}) {
  return async (ctx, cb) => {
    const misconfigured = reason => {
      cb(null, {
        text: `slash-webtask-github-sourcer is misconfigured: ${reason}`,
      })
    }
    if (!owner) {
      return misconfigured('Missing parameter: `owner`')
    }
    if (!repo) {
      return misconfigured('Missing parameter: `repo`')
    }
    if (!appId) {
      return misconfigured('Missing parameter: `appId`')
    }
    if (!installationId) {
      return misconfigured('Missing parameter: `installationId`')
    }
    if (!path) {
      return misconfigured('Missing parameter: `path`')
    }
    if (!ctx.secrets.GH_APP_PRIVATE_KEY_BASE64) {
      return misconfigured('Missing secret: `GH_APP_PRIVATE_KEY_BASE64`')
    }
    try {
      const app = new App({
        id: appId,
        privateKey: Buffer.from(
          ctx.secrets.GH_APP_PRIVATE_KEY_BASE64,
          'base64',
        ).toString(),
      })
      const octokit = new Octokit({
        async auth() {
          const installationAccessToken = await app.getInstallationAccessToken({
            installationId,
          })
          return `token ${installationAccessToken}`
        },
      })
      const fileResponse = await octokit.repos.getContents({
        owner,
        repo,
        path,
        ref,
      })
      const myModule = {}
      new Function(
        'require',
        'module',
        Buffer.from(fileResponse.data.content, 'base64').toString(),
      )(require, myModule)
      myModule.exports(ctx, cb)
    } catch (error) {
      console.error(error)
      cb(null, {
        text: `Error while running code from GitHub:\`\`\`${error &&
          error.stack}\`\`\``,
      })
    }
  }
}
