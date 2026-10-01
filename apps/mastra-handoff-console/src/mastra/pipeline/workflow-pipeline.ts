import type { Mastra } from "@mastra/core/mastra";
import {
  critiqueAgentConfig,
  draftAgentConfig,
  researchAgentConfig,
} from "../agents/research-agent.ts";
import type { HandoffEntry, PipelineResult } from "./run-pipeline.ts";

function summarize(text: string, max = 120): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

export async function runWorkflowHandoffPipeline(
  mastra: Mastra,
  topic: string,
): Promise<PipelineResult> {
  const workflow = mastra.getWorkflow("handoffPipelineWorkflow");
  const run = await workflow.createRun();
  const result = await run.start({
    inputData: { topic },
  });

  if (result.status !== "success") {
    const message =
      result.status === "failed"
        ? result.error.message
        : `Pipeline ended with status: ${result.status}`;
    throw new Error(message);
  }

  const { research, draft, critique } = result.result;

  const handoffs: HandoffEntry[] = [
    {
      order: 1,
      agentId: researchAgentConfig.id,
      agentName: researchAgentConfig.name,
      status: "complete",
      payloadSummary: `Topic: "${summarize(topic, 80)}"`,
      outputPreview: summarize(research, 200),
      nextAgentId: draftAgentConfig.id,
      nextAgentName: draftAgentConfig.name,
    },
    {
      order: 2,
      agentId: draftAgentConfig.id,
      agentName: draftAgentConfig.name,
      status: "complete",
      payloadSummary: `Research (${research.length} chars)`,
      outputPreview: summarize(draft, 200),
      nextAgentId: critiqueAgentConfig.id,
      nextAgentName: critiqueAgentConfig.name,
    },
    {
      order: 3,
      agentId: critiqueAgentConfig.id,
      agentName: critiqueAgentConfig.name,
      status: "complete",
      payloadSummary: `Draft (${draft.length} chars)`,
      outputPreview: summarize(critique, 200),
      nextAgentId: null,
      nextAgentName: null,
    },
  ];

  return {
    mode: "llm",
    topic,
    handoffs,
    research,
    draft,
    critique,
  };
}
