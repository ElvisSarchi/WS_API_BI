module.exports = {
  apps: [
    {
      name: "WS-BI",
      script: "index.js",
      interpreter: "./node_modules/.bin/babel-node",
      watch: true,
    },
  ],


}
