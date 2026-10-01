import { createMastraInstance, resolveRuntimeMode } from "../index.ts";
import { runMockHandoffPipeline } from "./mock-pipeline.ts";
import { runWorkflowHandoffPipeline } from "./workflow-pipeline.ts";

export type HandoffEntry = {
  order: number;
  agentId: string;
  agentName: string;
  status: "complete";
  payloadSummary: string;
  outputPreview: string;
  nextAgentId: string | null;
  nextAgentName: string | null;
};

export type PipelineResult = {
  mode: "llm" | "mock";
  topic: string;
  handoffs: HandoffEntry[];
  research: string;
  draft: string;
  critique: string;
};

export async function runHandoffPipeline(topic: string): Promise<PipelineResult> {
  const trimmed = topic.trim();
  if (!trimmed) {
    throw new Error("Topic is required");
  }

  const mode = resolveRuntimeMode();
  if (mode === "mock") {
    return runMockHandoffPipeline(trimmed);
  }

  const mastra = createMastraInstance("llm");
  return runWorkflowHandoffPipeline(mastra, trimmed);
}
