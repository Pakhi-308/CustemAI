import { useState, useRef, useCallback } from "react";
import Groq from "groq-sdk";

// SECURITY NOTE (documented limitation, not silently hidden):
// This calls the Groq API directly from the browser using
// `dangerouslyAllowBrowser: true`, which means REACT_APP_GROQ_KEY is bundled
// into the client-side JS and visible to anyone who inspects the deployed
// site. That's acceptable for a demo/hackathon project, but a production
// version should proxy this call through a backend (e.g. a small serverless
// function) so the API key never reaches the browser.
//
// The client is created lazily (on first actual API call) rather than at
// module load. Previously it was constructed eagerly, which meant a missing
// REACT_APP_GROQ_KEY crashed the whole app / test suite before a single
// component even rendered, instead of failing gracefully when content
// generation is actually attempted.
let groqClient = null;
function getGroqClient() {
  if (!process.env.REACT_APP_GROQ_KEY) {
    throw new Error(
      "REACT_APP_GROQ_KEY is not set. Add it to your .env file (see README)."
    );
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.REACT_APP_GROQ_KEY,
      dangerouslyAllowBrowser: true,
    });
  }
  return groqClient;
}

// Model is now configurable via env var instead of hardcoded, so a future
// Groq deprecation (like the llama-3.3-70b-versatile shutdown on 8/16/26)
// only requires an env var change, not a code change + redeploy.
const MODEL = process.env.REACT_APP_GROQ_MODEL || "openai/gpt-oss-120b";

const LOADING_STAGES = [
  { delay: 0, text: "Analysing behavioural signals..." },
  { delay: 900, text: "Building persona profile..." },
  { delay: 1800, text: "Crafting personalised content..." },
];

function buildPrompt({ brand, industry, persona }) {
  return `Brand: ${brand}
Industry: ${industry}
Target Persona: ${persona.name}
Persona traits: ${persona.traits}

Generate hyper-personalized marketing content for this persona in this exact JSON shape:
{
  "insight": "one strategic insight, 2 sentences max, about how to engage the target persona",
  "email": { "subject": "email subject line", "body": "2 line email body" },
  "push": { "title": "push notification title", "body": "one line push body" },
  "display": { "headline": "display ad headline", "subtext": "short subtext" },
  "engagement_score": 0
}

CRITICAL AI INSTRUCTION: Replace the 0 in engagement_score with a specific, unique integer between 58 and 97. Do NOT use generic round numbers like 80, 85, or 90. The score MUST vary drastically based on how inherently difficult the persona is to convert. For example: Deal Hunters are notoriously fickle and should get a lower score (e.g., 63-74). Loyalty Seekers are highly engaged and should get a higher score (e.g., 88-96). Make it realistic and highly specific every single time.`;
}

/**
 * Encapsulates the full "generate marketing content" flow: staged loading
 * text, the Groq chat completion call, defensive JSON parsing, and error
 * state. Kept out of the component tree so components stay presentational.
 */
export function useGenerateContent() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const reset = useCallback(() => {
    setContent(null);
    setError("");
  }, []);

  const generate = useCallback(async ({ brand, industry, persona }) => {
    setLoading(true);
    setContent(null);
    setError("");

    LOADING_STAGES.forEach(({ delay, text }) => {
      const id = setTimeout(() => setLoadingText(text), delay);
      timers.current.push(id);
    });

    try {
      const response = await getGroqClient().chat.completions.create({
        model: MODEL,
        max_tokens: 1000,
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content:
              "You are CustεmAI, an AI marketing personalization engine. You analyze customer personas and generate hyper-personalized marketing content. Always respond with ONLY valid JSON, no extra text, no markdown formatting, no code fences. Ensure engagement_score is a number, not a string.",
          },
          { role: "user", content: buildPrompt({ brand, industry, persona }) },
        ],
      });

      const raw = response.choices[0].message.content;
      // Defensive cleanup: LLMs sometimes wrap JSON in code fences even when
      // explicitly told not to, so we strip those before parsing.
      const cleaned = raw.replace(/```json|```/g, "").trim();
      setContent(JSON.parse(cleaned));
    } catch (err) {
      console.error(err);
      setError("Could not generate content. Check your API key and try again.");
    } finally {
      clearTimers();
      setLoading(false);
    }
  }, []);

  return { loading, loadingText, content, error, generate, reset };
}
