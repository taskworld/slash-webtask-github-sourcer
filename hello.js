/*

Slash Webtasks: Extend Slack with Node.js, powered by Auth0 (https://auth0.com)
You can find us on Slack at https://webtask-chat.slack.com (join via https://skynet.run.webtask.io/webtask-signup)

*/

module.exports = (ctx, cb) => {
  // TIPS:
  // 1. Input and output: https://github.com/auth0/slash#inputs-and-outputs
  // 2. Response formatting: https://api.slack.com/docs/messages/builder
  // 3. Secrets you configure using the key icon are available on `ctx.secrets`

  cb(null, { text: `Hello, <@${ctx.body.user_id}>!` })
}
