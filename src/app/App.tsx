import { useState } from "react";
import { CasinoWheel } from "./components/CasinoWheel";
import { Button } from "./components/ui/button";
import { Beer, Sparkles } from "lucide-react";
import barsData from "./bars_lyon.json";

// Interface for pub data
interface PubData {
  name: string;
  address: string;
}

// Function to check if a pub is open now
function isOpenNow(openingHours: string | undefined): boolean {
  if (!openingHours) return false;

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

  // Map day numbers to opening_hours format
  const dayMap = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = dayMap[dayOfWeek];

  // Handle "24/7" or always open
  if (openingHours.includes("24/7") || openingHours === "Mo-Su 00:00-24:00") {
    return true;
  }

  // Handle "off" or closed
  if (openingHours.toLowerCase().includes("off")) {
    return false;
  }

  // Parse opening hours (simplified parser)
  // Format examples: "Mo-Fr 17:00-01:00", "Tu-Sa 18:00-24:00", etc.
  const parts = openingHours.split(";");

  for (const part of parts) {
    const trimmed = part.trim();

    // Check if this part applies to today
    if (trimmed.includes(today)) {
      // Extract time range
      const timeMatch = trimmed.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
      if (timeMatch) {
        const openHour = parseInt(timeMatch[1]);
        const openMin = parseInt(timeMatch[2]);
        const closeHour = parseInt(timeMatch[3]);
        const closeMin = parseInt(timeMatch[4]);

        const openTime = openHour * 60 + openMin;
        let closeTime = closeHour * 60 + closeMin;

        // Handle closing after midnight
        if (closeTime < openTime) {
          closeTime += 24 * 60;
        }

        // Check if current time is within opening hours
        if (currentTime >= openTime && currentTime <= closeTime) {
          return true;
        }

        // Handle case where we're past midnight but bar is still open
        if (closeTime > 24 * 60 && currentTime < closeTime - 24 * 60) {
          return true;
        }
      }
    }

    // Handle day ranges like "Mo-Fr"
    const rangeMatch = trimmed.match(/([A-Z][a-z])-([A-Z][a-z])/);
    if (rangeMatch) {
      const startDay = dayMap.indexOf(rangeMatch[1]);
      const endDay = dayMap.indexOf(rangeMatch[2]);

      if (startDay !== -1 && endDay !== -1) {
        const isInRange =
          startDay <= endDay
            ? dayOfWeek >= startDay && dayOfWeek <= endDay
            : dayOfWeek >= startDay || dayOfWeek <= endDay;

        if (isInRange) {
          const timeMatch = trimmed.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/);
          if (timeMatch) {
            const openHour = parseInt(timeMatch[1]);
            const openMin = parseInt(timeMatch[2]);
            const closeHour = parseInt(timeMatch[3]);
            const closeMin = parseInt(timeMatch[4]);

            const openTime = openHour * 60 + openMin;
            let closeTime = closeHour * 60 + closeMin;

            if (closeTime < openTime) {
              closeTime += 24 * 60;
            }

            if (currentTime >= openTime && currentTime <= closeTime) {
              return true;
            }

            if (closeTime > 24 * 60 && currentTime < closeTime - 24 * 60) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

// Function to format address from tags
function formatAddress(tags: any): string {
  const parts = [];

  if (tags["addr:housenumber"]) {
    parts.push(tags["addr:housenumber"]);
  }
  if (tags["addr:street"]) {
    parts.push(tags["addr:street"]);
  }
  if (tags["addr:postcode"]) {
    parts.push(tags["addr:postcode"]);
  }
  if (tags["addr:city"]) {
    parts.push(tags["addr:city"]);
  }

  return parts.length > 0 ? parts.join(", ") : "Address not available";
}

// Extract pub data from the JSON and filter for open pubs
const lyonPubsData: PubData[] = barsData.elements
  .filter((element: any) => {
    const name = element.tags?.name;
    const openingHours = element.tags?.opening_hours;
    return (
      name &&
      typeof name === "string" &&
      name.length > 0 &&
      isOpenNow(openingHours)
    );
  })
  .map((element: any) => ({
    name: element.tags.name,
    address: formatAddress(element.tags),
  }))
  .sort(() => Math.random() - 0.5);

// Extract just the names for the wheel
const lyonPubs = lyonPubsData.map((pub) => pub.name);

export default function App() {
  const [selectedPub, setSelectedPub] = useState<PubData | null>(null);
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
    // Find the full pub data from the name
    const pubData = lyonPubsData.find((pub) => pub.name === result);
    setSelectedPub(pubData || null);
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
                {selectedPub.name}
              </p>
              <p className="text-2xl text-gray-800">📍 {selectedPub.address}</p>
              <p className="text-2xl text-gray-800">🍺 Enjoy your night! 🍺</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-yellow-200 text-lg">
            Featuring {lyonPubs.length} pubs open right now in Lyon
          </p>
        </div>
      </div>
    </div>
  );
}
