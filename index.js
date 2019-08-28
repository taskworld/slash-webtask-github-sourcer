function slashWebtaskFromGitHub({ owner, repo, appId, installationId, path }) {
  return async (ctx, cb) => {
    try {
      const app = new App({ id: appId, privateKey: Buffer.from(ctx.secrets.GH_APP_PRIVATE_KEY_BASE64, 'base64').toString() })
      const octokit = new Octokit({
        async auth () {
          const installationAccessToken = await app.getInstallationAccessToken({ installationId })
          return `token ${installationAccessToken}`
        }
      })
      const fileResponse = await octokit.repos.getContents({ owner, repo, path })
      const myModule = {}
      new Function('require', 'module', Buffer.from(fileResponse.data.content, 'base64').toString())(require, myModule)
      myModule.exports(ctx, cb)
    } catch (error) {
      console.error(error)
      cb(null, { text: `Error while running code from GitHub:\`\`\`${error && error.stack}\`\`\`` })
    }
  }
}
