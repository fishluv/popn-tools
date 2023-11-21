// eslint-disable-next-line @typescript-eslint/no-var-requires
const gitSha = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim()

module.exports = {
  env: {
    GIT_SHA: gitSha,
  },
  // Ideally this would be a `rewrite` but surge.sh doesn't handle it correctly
  // for some reason...
  async redirects() {
    return [
      {
        source: "/randomizer",
        destination: "https://chinatsu.surge.sh",
        permanent: true,
      },
    ]
  },
}
