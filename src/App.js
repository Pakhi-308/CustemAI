import { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import { useGenerateContent } from "./hooks/useGenerateContent";
import { BASE_PERSONAS } from "./data/personas";

function App() {
  const [stage, setStage] = useState("landing");
  const [brand, setBrand] = useState("");
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [industry, setIndustry] = useState("Retail");
  const [selectedPersona, setSelectedPersona] = useState(0);
  const [formError, setFormError] = useState("");

  const { loading, loadingText, content, error, generate, reset } =
    useGenerateContent();

  const handleStart = () => {
    if (!brand.trim()) {
      setFormError("Please select or enter a brand");
      return;
    }
    setFormError("");
    setStage("dashboard");
  };

  const handleSelectPersona = (id) => {
    setSelectedPersona(id);
    reset();
  };

  const handleGenerate = () => {
    generate({ brand, industry, persona: BASE_PERSONAS[selectedPersona] });
  };

  return (
    <div className="min-h-screen animate-gradientBG bg-[length:400%_400%] bg-gradient-to-br from-[#F7F8F6] via-[#E8F5EF] to-[#d8f0e6] font-sans text-ink">
      {stage === "landing" ? (
        <LandingPage
          brand={brand}
          setBrand={setBrand}
          isCustomBrand={isCustomBrand}
          setIsCustomBrand={setIsCustomBrand}
          industry={industry}
          setIndustry={setIndustry}
          error={formError}
          onStart={handleStart}
        />
      ) : (
        <Dashboard
          brand={brand}
          industry={industry}
          onChangeBrand={() => setStage("landing")}
          selectedPersona={selectedPersona}
          onSelectPersona={handleSelectPersona}
          contentState={{ loading, loadingText, content, error }}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}

export default App;
