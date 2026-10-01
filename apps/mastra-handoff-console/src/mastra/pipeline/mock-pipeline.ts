import type { PipelineResult } from "./run-pipeline.ts";
import {
  critiqueAgentConfig,
  draftAgentConfig,
  researchAgentConfig,
} from "../agents/research-agent.ts";

function summarize(text: string, max = 120): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

export async function runMockHandoffPipeline(topic: string): Promise<PipelineResult> {
  const research = [
    `- ${topic} is a practical entry point for multi-agent UX demos.`,
    "- Sequential handoffs make ownership changes visible in the UI.",
    "- Mastra workflows/agents map cleanly to research → draft → critique.",
    "- Mock mode keeps the demo runnable without API keys.",
  ].join("\n");

  const draft = `# ${topic}\n\nMulti-agent pipelines shine when each specialist passes structured context to the next. Research narrows the problem, drafting turns findings into narrative, and critique closes the loop with actionable feedback.\n\nThis console makes those transitions explicit so builders can reason about handoffs before adding auth, storage, or deployment hardening.`;

  const critique = `Score: 8/10\n\nImprovements:\n1. Add one concrete example sentence in the opening paragraph.\n2. Tie the critique step back to the original research bullets.\n3. Shorten the middle paragraph by one sentence.\n\nVerdict: Solid MVP draft with clear structure; minor tightening would improve punch.`;

  const handoffs = [
    {
      order: 1,
      agentId: researchAgentConfig.id,
      agentName: researchAgentConfig.name,
      status: "complete" as const,
      payloadSummary: `Topic: "${summarize(topic, 80)}"`,
      outputPreview: summarize(research, 200),
      nextAgentId: draftAgentConfig.id,
      nextAgentName: draftAgentConfig.name,
    },
    {
      order: 2,
      agentId: draftAgentConfig.id,
      agentName: draftAgentConfig.name,
      status: "complete" as const,
      payloadSummary: `Research notes (${research.split("\n").length} bullets)`,
      outputPreview: summarize(draft, 200),
      nextAgentId: critiqueAgentConfig.id,
      nextAgentName: critiqueAgentConfig.name,
    },
    {
      order: 3,
      agentId: critiqueAgentConfig.id,
      agentName: critiqueAgentConfig.name,
      status: "complete" as const,
      payloadSummary: `Draft (${draft.length} chars) + topic context`,
      outputPreview: summarize(critique, 200),
      nextAgentId: null,
      nextAgentName: null,
    },
  ];

  // Small delay so the UI can show sequential progress when polled
  await Bun.sleep(350);

  return {
    mode: "mock",
    topic,
    handoffs,
    research,
    draft,
    critique,
  };
}
