import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BASE_PERSONAS } from "../data/personas";

export default function ContentPanel({
  selectedPersona,
  loading,
  loadingText,
  content,
  error,
  onGenerate,
}) {
  const persona = BASE_PERSONAS[selectedPersona];

  const chartData = BASE_PERSONAS.map((p) => ({
    name: p.name.split(" ")[0],
    score: content && p.id === selectedPersona ? content.engagement_score : 0,
  }));

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] text-ink">{persona.name}</h3>
          <p className="mt-1 text-sm text-muted">{persona.traits}</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="whitespace-nowrap rounded-[10px] bg-gradient-to-b from-brand to-brand-dark px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(23,139,94,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(23,139,94,0.35)] active:translate-y-px disabled:translate-y-0 disabled:bg-[#C8C8C2] disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate content"}
        </button>
      </div>

      {loading && (
        <div className="mb-5 flex items-center gap-3 rounded-[10px] border border-dashed border-brand bg-brand-light p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-brand/30 border-t-brand" />
          <p className="m-0 animate-pulse text-sm font-semibold text-brand">{loadingText}</p>
        </div>
      )}

      {error && <p className="mt-2.5 animate-shake text-[13px] font-medium text-[#E74C3C]">{error}</p>}

      {content && (
        <>
          <div className="mb-6 animate-fadeInUp rounded-r-[10px] border-l-4 border-brand bg-gradient-to-r from-[#F7F8F6] to-white p-4 px-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="text-xs font-bold uppercase tracking-wide text-brand">AI insight</span>
            <p className="mt-2 text-sm leading-relaxed text-[#333]">{content.insight}</p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { channel: "Email", title: content.email.subject, body: content.email.body },
              { channel: "Push", title: content.push.title, body: content.push.body },
              { channel: "Display", title: content.display.headline, body: content.display.subtext },
            ].map((card, i) => (
              <div
                key={card.channel}
                style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                className="animate-fadeInUp rounded-xl border border-border bg-white p-4 transition-all [animation-fill-mode:backwards] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
              >
                <span className="text-[11px] font-bold uppercase tracking-wide text-faint">{card.channel}</span>
                <p className="mb-1.5 mt-2 text-sm font-semibold text-ink">{card.title}</p>
                <p className="m-0 text-[13px] leading-relaxed text-muted">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 animate-fadeIn border-t border-border pt-4">
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

          <div className="mt-6 flex animate-fadeIn justify-end gap-3 border-t border-border pt-5">
            <button
              onClick={() => alert("Campaign saved as draft.")}
              className="rounded-lg border border-borderSoft px-3.5 py-2 text-[13px] font-medium text-[#444] transition-colors hover:bg-[#F7F8F6]"
            >
              Save Draft
            </button>
            <button
              onClick={() => alert("Success! JSON payload exported to Epsilon COREai pipeline.")}
              className="rounded-[10px] bg-ink px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(26,26,26,0.2)]"
            >
              Export to Epsilon COREai &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
