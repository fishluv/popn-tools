// eslint-disable-next-line @typescript-eslint/no-var-requires
const gitSha = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim()

module.exports = {
  env: {
    GIT_SHA: gitSha,
  },
  async redirects() {
    return [
      {
        source: "/randomizer",
        destination: "https://popn-randomizer.vercel.app",
        permanent: true,
      },
    ]
  },
}
