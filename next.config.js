module.exports = {
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
