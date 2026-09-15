import { SUGGESTED_BRANDS, INDUSTRIES } from "../data/personas";

export default function LandingPage({
  brand,
  setBrand,
  isCustomBrand,
  setIsCustomBrand,
  industry,
  setIndustry,
  error,
  onStart,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] rounded-[20px] border border-white/80 border-t-4 border-t-brand bg-white/95 p-10 shadow-[0_24px_48px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.5)_inset] backdrop-blur-md animate-fadeInUp">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-[#7209B7] via-[#F72585] to-[#FF9E00] font-serif text-[28px] font-medium text-white shadow-[0_8px_16px_rgba(247,37,133,0.25)]">
            &epsilon;
          </div>
          <div>
            <h1 className="m-0 text-2xl font-bold tracking-tight">Cust&epsilon;mAI</h1>
            <p className="mt-1 text-sm text-muted">Hyper-personalization at scale</p>
          </div>
        </div>

        <p className="mb-7 mt-4 text-xs font-medium text-faint">
          Powered by AI &middot; built for Epsilon&apos;s identity-first marketing
        </p>

        <label className="mb-2 mt-5 block text-[13px] font-semibold text-[#333]">
          Brand or product name
        </label>
        <select
          value={isCustomBrand ? "Other" : brand}
          onChange={(e) => {
            if (e.target.value === "Other") {
              setIsCustomBrand(true);
              setBrand("");
            } else {
              setIsCustomBrand(false);
              setBrand(e.target.value);
            }
          }}
          className="w-full rounded-[10px] border-[1.5px] border-borderSoft bg-white px-3.5 py-3 text-sm transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(23,139,94,0.15)] focus:outline-none"
        >
          <option value="" disabled>
            Select a brand...
          </option>
          {SUGGESTED_BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
          <option value="Other">Other (Type custom brand)...</option>
        </select>

        {isCustomBrand && (
          <div className="mt-3 animate-fadeIn">
            <input
              type="text"
              placeholder="e.g. Uber, Tesla, Adidas"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              autoFocus
              className="w-full rounded-[10px] border-[1.5px] border-borderSoft bg-white px-3.5 py-3 text-sm transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(23,139,94,0.15)] focus:outline-none"
            />
          </div>
        )}

        <label className="mb-2 mt-5 block text-[13px] font-semibold text-[#333]">
          Industry
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full rounded-[10px] border-[1.5px] border-borderSoft bg-white px-3.5 py-3 text-sm transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(23,139,94,0.15)] focus:outline-none"
        >
          {INDUSTRIES.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>

        {error && <p className="mt-2.5 animate-shake text-[13px] font-medium text-[#E74C3C]">{error}</p>}

        <button
          onClick={onStart}
          className="mt-7 w-full rounded-[10px] bg-gradient-to-b from-brand to-brand-dark px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(23,139,94,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(23,139,94,0.35)] active:translate-y-px"
        >
          Generate personas &rarr;
        </button>
      </div>
    </div>
  );
}
