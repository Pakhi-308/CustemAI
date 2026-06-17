import React, { useState } from "react";
import Groq from "groq-sdk";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_KEY,
  dangerouslyAllowBrowser: true,
});

const BASE_PERSONAS = [
  {
    id: 0,
    initials: "HB",
    name: "High-Intent Buyer",
    tag: "38% of audience",
    traits: "Browses 6+ times/week, adds to cart often, responds to urgency and limited-time offers, mobile-first shopper",
  },
  {
    id: 1,
    initials: "LS",
    name: "Loyalty Seeker",
    tag: "22% of audience",
    traits: "Long-term customer, high NPS, values exclusive access and recognition over discounts, email-first",
  },
  {
    id: 2,
    initials: "DH",
    name: "Deal Hunter",
    tag: "19% of audience",
    traits: "Highly price-sensitive, compares across multiple sites, takes 3-5 days to decide, responds to flash sales",
  },
  {
    id: 3,
    initials: "BA",
    name: "Brand Advocate",
    tag: "13% of audience",
    traits: "High NPS, refers friends often, creates user-generated content, social-media active",
  },
  {
    id: 4,
    initials: "RT",
    name: "Re-engagement Target",
    tag: "8% of audience",
    traits: "Dormant for 90+ days, previously high lifetime value, at risk of churn, needs a personal win-back moment",
  },
];

function App() {
  const [stage, setStage] = useState("landing");
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState("Retail");
  const [selectedPersona, setSelectedPersona] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!brand.trim()) {
      setError("Please enter a brand or product name");
      return;
    }
    setError("");
    setStage("dashboard");
  };

  const generateContent = async () => {
    setLoading(true);
    setContent(null);
    setError("");

    const persona = BASE_PERSONAS[selectedPersona];

    setLoadingText("Analysing behavioural signals...");
    const t1 = setTimeout(() => setLoadingText("Building persona profile..."), 900);
    const t2 = setTimeout(() => setLoadingText("Crafting personalised content..."), 1800);

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1000,
       temperature: 1.0,
        messages: [
          {
            role: "system",
            content:
              "You are CustεmAI, an AI marketing personalization engine. You analyze customer personas and generate hyper-personalized marketing content. Always respond with ONLY valid JSON, no extra text, no markdown formatting, no code fences.",
          },
          {
            role: "user",
content: `Brand: ${brand}
Industry: ${industry}
Persona name: ${persona.name}
Persona traits: ${persona.traits}

Generate hyper-personalized marketing content for this persona. Respond with ONLY this JSON structure, replacing every value with content specific to this exact brand and persona:
{
  "insight": "one strategic insight, 2 sentences max, about how to engage this persona",
  "email": { "subject": "email subject line", "body": "2 line email body" },
  "push": { "title": "push notification title", "body": "one line push body" },
  "display": { "headline": "display ad headline", "subtext": "short subtext" },
  "engagement_score": "pick a realistic predicted engagement percentage between 60 and 98 based on how well this channel mix fits this specific persona and industry — avoid round numbers like 80, 85, or 90"
}`,
          },
        ],
      });

      clearTimeout(t1);
      clearTimeout(t2);

      const raw = response.choices[0].message.content;
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setContent(parsed);
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      console.error(err);
      setError("Could not generate content. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = BASE_PERSONAS.map((p) => ({
    name: p.name.split(" ")[0],
    score: content && p.id === selectedPersona ? content.engagement_score : 0,
  }));

  if (stage === "landing") {
    return (
      <div className="landing">
        <div className="landing-card">
          <div className="logo-row">
            <div className="logo-badge">C</div>
            <div>
              <h1>Cust&epsilon;mAI</h1>
              <p className="subtitle">Hyper-personalization at scale</p>
            </div>
          </div>
          <p className="powered">
            Powered by AI &middot; built for Epsilon&apos;s identity-first marketing
          </p>

          <label className="field-label">Brand or product name</label>
          <input
            type="text"
            placeholder="e.g. Nike, Zomato, HDFC Bank"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="text-input"
          />

          <label className="field-label">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="select-input"
          >
            <option>Retail</option>
            <option>Finance</option>
            <option>Travel</option>
            <option>CPG</option>
            <option>Automotive</option>
            <option>Healthcare</option>
            <option>Telecom</option>
          </select>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-btn" onClick={handleStart}>
            Generate personas &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="topbar">
        <div className="logo-row">
          <div className="logo-badge">C</div>
          <div>
            <h2>Cust&epsilon;mAI</h2>
            <p className="subtitle">{brand} &middot; {industry}</p>
          </div>
        </div>
        <button className="ghost-btn" onClick={() => setStage("landing")}>
          &larr; Change brand
        </button>
      </div>

      <div className="main-grid">
        <div className="panel persona-panel">
          <h3>Micro-personas</h3>
          {BASE_PERSONAS.map((p) => (
            <div
              key={p.id}
              className={`persona-item ${selectedPersona === p.id ? "active" : ""}`}
              onClick={() => {
                setSelectedPersona(p.id);
                setContent(null);
              }}
            >
              <div className="persona-name">{p.name}</div>
              <div className="persona-tag">{p.tag}</div>
            </div>
          ))}
        </div>

        <div className="panel content-panel">
          <div className="content-header">
            <div>
              <h3>{BASE_PERSONAS[selectedPersona].name}</h3>
              <p className="subtitle">{BASE_PERSONAS[selectedPersona].traits}</p>
            </div>
            <button className="primary-btn" onClick={generateContent} disabled={loading}>
              {loading ? "Generating..." : "Generate content"}
            </button>
          </div>

          {loading && <p className="loading-text">{loadingText}</p>}
          {error && <p className="error-text">{error}</p>}

          {content && (
            <>
              <div className="insight-box">
                <span className="insight-label">AI insight</span>
                <p>{content.insight}</p>
              </div>

              <div className="content-cards">
                <div className="content-card">
                  <span className="card-channel">Email</span>
                  <p className="card-title">{content.email.subject}</p>
                  <p className="card-body">{content.email.body}</p>
                </div>
                <div className="content-card">
                  <span className="card-channel">Push</span>
                  <p className="card-title">{content.push.title}</p>
                  <p className="card-body">{content.push.body}</p>
                </div>
                <div className="content-card">
                  <span className="card-channel">Display</span>
                  <p className="card-title">{content.display.headline}</p>
                  <p className="card-body">{content.display.subtext}</p>
                </div>
              </div>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#178B5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
