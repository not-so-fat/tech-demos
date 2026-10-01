import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import {
  critiqueAgentConfig,
  draftAgentConfig,
  researchAgentConfig,
} from "../agents/research-agent.ts";

const topicInputSchema = z.object({
  topic: z.string(),
});

const afterResearchSchema = z.object({
  topic: z.string(),
  research: z.string(),
});

const afterDraftSchema = z.object({
  topic: z.string(),
  research: z.string(),
  draft: z.string(),
});

const pipelineOutputSchema = z.object({
  topic: z.string(),
  research: z.string(),
  draft: z.string(),
  critique: z.string(),
});

const researchStep = createStep({
  id: "research-step",
  inputSchema: topicInputSchema,
  outputSchema: afterResearchSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById(researchAgentConfig.id);
    if (!agent) {
      throw new Error("Research agent is not registered");
    }
    const response = await agent.generate(
      `Topic: ${inputData.topic}\n\nProduce research bullets only.`,
    );
    return {
      topic: inputData.topic,
      research: response.text,
    };
  },
});

const draftStep = createStep({
  id: "draft-step",
  inputSchema: afterResearchSchema,
  outputSchema: afterDraftSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById(draftAgentConfig.id);
    if (!agent) {
      throw new Error("Draft agent is not registered");
    }
    const response = await agent.generate(
      `Topic: ${inputData.topic}\n\nResearch:\n${inputData.research}\n\nWrite the draft.`,
    );
    return {
      topic: inputData.topic,
      research: inputData.research,
      draft: response.text,
    };
  },
});

const critiqueStep = createStep({
  id: "critique-step",
  inputSchema: afterDraftSchema,
  outputSchema: pipelineOutputSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById(critiqueAgentConfig.id);
    if (!agent) {
      throw new Error("Critique agent is not registered");
    }
    const response = await agent.generate(
      `Topic: ${inputData.topic}\n\nResearch:\n${inputData.research}\n\nDraft:\n${inputData.draft}\n\nProvide critique.`,
    );
    return {
      topic: inputData.topic,
      research: inputData.research,
      draft: inputData.draft,
      critique: response.text,
    };
  },
});

export const handoffPipelineWorkflow = createWorkflow({
  id: "handoff-pipeline",
  inputSchema: topicInputSchema,
  outputSchema: pipelineOutputSchema,
})
  .then(researchStep)
  .then(draftStep)
  .then(critiqueStep)
  .commit();
