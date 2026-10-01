import { type ChangeEvent, useEffect, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type HandoffEntry = {
  order: number;
  agentId: string;
  agentName: string;
  status: "complete";
  payloadSummary: string;
  outputPreview: string;
  nextAgentId: string | null;
  nextAgentName: string | null;
};

type PipelineResult = {
  mode: "llm" | "mock";
  topic: string;
  handoffs: HandoffEntry[];
  research: string;
  draft: string;
  critique: string;
};

const DEFAULT_TOPIC = "Visible multi-agent handoffs with Mastra";

export function App() {
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [mode, setMode] = useState<"llm" | "mock" | "unknown">("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [visibleHandoffs, setVisibleHandoffs] = useState(0);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data: { mode?: "llm" | "mock" }) => setMode(data.mode ?? "mock"))
      .catch(() => setMode("mock"));
  }, []);

  useEffect(() => {
    if (!result) {
      setVisibleHandoffs(0);
      return;
    }
    setVisibleHandoffs(0);
    const timers = result.handoffs.map((_, index) =>
      window.setTimeout(() => setVisibleHandoffs(index + 1), (index + 1) * 450),
    );
    return () => timers.forEach(clearTimeout);
  }, [result]);

  async function runPipeline() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Pipeline failed");
      }
      setResult(data as PipelineResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pipeline failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">
            <Sparkles className="mr-1 size-3" />
            Mastra Handoff Console
          </Badge>
          <Badge variant="secondary">Research → Draft → Critique</Badge>
          <Badge variant="outline">
            Runtime: {mode === "unknown" ? "…" : mode === "llm" ? "LLM" : "Mock (no API key)"}
          </Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          See multi-agent handoffs in one pass
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Enter a topic and run a three-step Mastra pipeline. The timeline shows which agent ran,
          what it received, and who it handed off to next.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Run pipeline</CardTitle>
          <CardDescription>Short topics work best for the MVP demo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={topic}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
            placeholder="e.g. Agent observability for product teams"
            disabled={loading}
          />
          <Button onClick={runPipeline} disabled={loading || !topic.trim()} className="sm:min-w-36">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running…
              </>
            ) : (
              "Run handoffs"
            )}
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <Card className="border-red-500/40">
          <CardContent className="p-6 text-sm text-red-300">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[420px]">
          <CardHeader>
            <CardTitle>Handoff timeline</CardTitle>
            <CardDescription>
              {result
                ? `${result.handoffs.length} sequential agent steps`
                : "Run the pipeline to populate handoffs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[340px] pr-3">
              <ol className="space-y-4">
                {(result?.handoffs ?? []).slice(0, visibleHandoffs).map((handoff) => (
                  <li
                    key={handoff.order}
                    className="rounded-lg border border-border bg-background/40 p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge>{handoff.agentName}</Badge>
                      <span className="text-xs text-muted-foreground">{handoff.agentId}</span>
                    </div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Input: </span>
                      {handoff.payloadSummary}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{handoff.outputPreview}</p>
                    {handoff.nextAgentName ? (
                      <p className="mt-3 flex items-center gap-1 text-xs text-primary">
                        Handoff to {handoff.nextAgentName}
                        <ArrowRight className="size-3" />
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-muted-foreground">Pipeline complete</p>
                    )}
                  </li>
                ))}
                {!result ? (
                  <li className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Waiting for a run…
                  </li>
                ) : null}
              </ol>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Draft output</CardTitle>
              <CardDescription>From the Draft Agent</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {result?.draft ?? "—"}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Critique output</CardTitle>
              <CardDescription>From the Critique Agent</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {result?.critique ?? "—"}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Research notes</CardTitle>
              <CardDescription>Passed into the draft step</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-36 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {result?.research ?? "—"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
