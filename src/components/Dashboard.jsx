import PersonaPanel from "./PersonaPanel";
import ContentPanel from "./ContentPanel";

export default function Dashboard({
  brand,
  industry,
  onChangeBrand,
  selectedPersona,
  onSelectPersona,
  contentState,
  onGenerate,
}) {
  return (
    <div className="mx-auto max-w-[1100px] animate-fadeIn p-8">
      <div className="mb-8 flex items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-[#7209B7] via-[#F72585] to-[#FF9E00] font-serif text-[28px] font-medium text-white shadow-[0_8px_16px_rgba(247,37,133,0.25)]">
            &epsilon;
          </div>
          <div>
            <h2 className="m-0 text-xl font-bold tracking-tight">Cust&epsilon;mAI</h2>
            <p className="mt-1 text-sm text-muted">
              {brand} &middot; {industry}
            </p>
          </div>
        </div>
        <button
          onClick={onChangeBrand}
          className="rounded-lg border border-borderSoft px-3.5 py-2 text-[13px] font-medium text-[#444] transition-colors hover:bg-[#F7F8F6]"
        >
          &larr; Change brand
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <PersonaPanel selectedPersona={selectedPersona} onSelect={onSelectPersona} />
        <ContentPanel
          selectedPersona={selectedPersona}
          onGenerate={onGenerate}
          {...contentState}
        />
      </div>
    </div>
  );
}
