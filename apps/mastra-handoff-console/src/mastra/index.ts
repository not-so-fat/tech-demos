import { Agent } from "@mastra/core/agent";
import { Mastra } from "@mastra/core/mastra";
import {
  critiqueAgentConfig,
  draftAgentConfig,
  researchAgentConfig,
} from "./agents/research-agent.ts";
import { handoffPipelineWorkflow } from "./workflows/handoff-pipeline.ts";

export type RuntimeMode = "llm" | "mock";

export function resolveRuntimeMode(): RuntimeMode {
  if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
    return "llm";
  }
  return "mock";
}

export function resolveModelId(): string {
  if (process.env.OPENAI_API_KEY) {
    return "openai/gpt-4o-mini";
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return "anthropic/claude-haiku-4-5";
  }
  return "openai/gpt-4o-mini";
}

export function createMastraInstance(mode: RuntimeMode): Mastra {
  const model = resolveModelId();

  if (mode === "mock") {
    return new Mastra({
      workflows: { handoffPipelineWorkflow },
    });
  }

  const researchAgent = new Agent({
    ...researchAgentConfig,
    model,
  });
  const draftAgent = new Agent({
    ...draftAgentConfig,
    model,
  });
  const critiqueAgent = new Agent({
    ...critiqueAgentConfig,
    model,
  });

  return new Mastra({
    agents: { researchAgent, draftAgent, critiqueAgent },
    workflows: { handoffPipelineWorkflow },
  });
}
