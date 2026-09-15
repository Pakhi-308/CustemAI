import { BASE_PERSONAS } from "../data/personas";

export default function PersonaPanel({ selectedPersona, onSelect }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
      <h3 className="mb-4 text-[15px] text-ink">Micro-personas</h3>
      {BASE_PERSONAS.map((p) => {
        const isActive = selectedPersona === p.id;
        return (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`mb-2 cursor-pointer rounded-[10px] border-[1.5px] p-3.5 transition-all hover:translate-x-0.5 hover:bg-[#F0F2EE] ${
              isActive
                ? "border-brand bg-brand-light shadow-[0_4px_12px_rgba(23,139,94,0.1)]"
                : "border-transparent bg-[#F7F8F6]"
            }`}
          >
            <div className="text-sm font-semibold text-ink">{p.name}</div>
            <div className="mt-1 text-xs text-faint">{p.tag}</div>
          </div>
        );
      })}
    </div>
  );
}
