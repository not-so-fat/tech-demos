import { resolveRuntimeMode } from "../mastra/index.ts";
import { runHandoffPipeline } from "../mastra/pipeline/run-pipeline.ts";

const PORT = Number(process.env.PORT ?? 8787);
const isProd = process.env.NODE_ENV === "production";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function handleApi(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === "/api/health" && req.method === "GET") {
    return Response.json({
      ok: true,
      mode: resolveRuntimeMode(),
    });
  }

  if (url.pathname === "/api/run" && req.method === "POST") {
    try {
      const body = (await req.json()) as { topic?: string };
      const result = await runHandoffPipeline(body.topic ?? "");
      return Response.json(result, { headers: corsHeaders });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return Response.json({ error: message }, { status: 400, headers: corsHeaders });
    }
  }

  return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
}

async function fetchFromVite(req: Request): Promise<Response> {
  const viteUrl = new URL(req.url);
  viteUrl.protocol = "http:";
  viteUrl.host = "127.0.0.1:5173";
  return fetch(viteUrl.toString(), req);
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(req);
    }

    if (isProd) {
      const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = Bun.file(`dist/client${filePath}`);
      if (await file.exists()) {
        return new Response(file);
      }
      return new Response(Bun.file("dist/client/index.html"));
    }

    try {
      return await fetchFromVite(req);
    } catch {
      return new Response(
        "Vite dev server not running. Start with `bun run dev` from apps/mastra-handoff-console/.",
        { status: 503 },
      );
    }
  },
  development: !isProd && {
    hmr: true,
    console: true,
  },
});

console.log(`Mastra Handoff Console API on http://localhost:${server.port} (${resolveRuntimeMode()} mode)`);
if (!isProd) {
  console.log("Proxying non-API traffic to Vite at http://127.0.0.1:5173");
}

export default server;
