export {};

const server = Bun.spawn(["bun", "--watch", "src/server/index.ts"], {
  stdout: "inherit",
  stderr: "inherit",
  env: { ...process.env, NODE_ENV: "development" },
});

const client = Bun.spawn(["bun", "run", "dev:client"], {
  stdout: "inherit",
  stderr: "inherit",
});

function shutdown(code = 0) {
  server.kill();
  client.kill();
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

await Promise.race([
  server.exited.then((code) => {
    console.error(`Server exited with code ${code}`);
    shutdown(code ?? 1);
  }),
  client.exited.then((code) => {
    console.error(`Client exited with code ${code}`);
    shutdown(code ?? 1);
  }),
]);
