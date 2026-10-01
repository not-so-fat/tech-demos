export const researchAgentConfig = {
  id: "research-agent",
  name: "Research Agent",
  instructions: `You are a research assistant. Given a topic, produce concise bullet-point findings (3-5 bullets).
Do not write a full essay. No preamble — start with bullets.
Simulate credible research from general knowledge; do not claim live web access.`,
};

export const draftAgentConfig = {
  id: "draft-agent",
  name: "Draft Agent",
  instructions: `You are a technical writer. Turn research bullets into a short blog-style draft (2-4 paragraphs).
Keep it clear and concrete. Do not repeat the bullets verbatim as a list.`,
};

export const critiqueAgentConfig = {
  id: "critique-agent",
  name: "Critique Agent",
  instructions: `You are an editor. Review the draft against the original topic and research.
Return: (1) a score 1-10, (2) three specific improvements, (3) one sentence overall verdict.`,
};
