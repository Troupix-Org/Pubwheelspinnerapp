import { useState } from "react";
import { CasinoWheel } from "./components/CasinoWheel";
import { Button } from "./components/ui/button";
import { Beer, Sparkles } from "lucide-react";
import barsData from "./bars_lyon.json";

// Extract pub names from the JSON data
const lyonPubs = barsData.elements
  .map((element: any) => element.tags?.name)
  .filter(
    (name: any): name is string => typeof name === "string" && name.length > 0,
  )
  .sort(() => Math.random() - 0.5);

export default function App() {
  const [selectedPub, setSelectedPub] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);

  const handleSpin = () => {
    setIsSpinning(true);
    setHasSpun(true);
    setSelectedPub(null);
    setSpinTrigger((prev) => prev + 1);
  };

  const handleSpinComplete = (result: string) => {
    setSelectedPub(result);
    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-orange-600 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beer className="w-12 h-12 text-yellow-300 animate-pulse" />
            <h1
              className="text-6xl text-yellow-300 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]"
              style={{
                textShadow:
                  "0 0 20px rgba(250,204,21,0.8), 0 0 40px rgba(250,204,21,0.4)",
              }}
            >
              Lyon Pub Casino
            </h1>
            <Beer className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-2xl text-yellow-100">
            🎰 Spin to discover your next pub! 🎰
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <CasinoWheel
            options={lyonPubs}
            onSpinComplete={handleSpinComplete}
            spinTrigger={spinTrigger}
          />

          <Button
            onClick={handleSpin}
            disabled={isSpinning}
            size="lg"
            className="text-2xl px-16 py-8 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 shadow-2xl border-4 border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning
              ? "🎰 SPINNING..."
              : hasSpun
                ? "🎲 SPIN AGAIN!"
                : "🎰 SPIN THE WHEEL!"}
          </Button>

          {selectedPub && !isSpinning && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-3xl p-8 shadow-2xl border-4 border-yellow-600">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-10 h-10 text-red-600 animate-pulse" />
                <h2 className="text-4xl text-gray-900">🎉 WINNER! 🎉</h2>
                <Sparkles className="w-10 h-10 text-red-600 animate-pulse" />
              </div>
              <p className="text-3xl text-gray-900">
                Tonight, you're going to:
              </p>
              <p className="text-5xl text-red-700 drop-shadow-lg">
                {selectedPub}
              </p>
              <p className="text-2xl text-gray-800">🍺 Enjoy your night! 🍺</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-yellow-200 text-lg">
            Featuring {lyonPubs.length} amazing pubs in Lyon
          </p>
        </div>
      </div>
    </div>
  );
}
