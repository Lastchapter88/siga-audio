"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const TIMES = ["09:00", "11:00", "13:00", "15:00"];

type Props = {
  selectedDate: string;
  value: string | null;
  onChange: (time: string) => void;
};

export default function TimeSlots({ selectedDate, value, onChange }: Props) {
  const [slots, setSlots] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) return;
      const ref = doc(db, "slots", selectedDate);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSlots(snap.data() as Record<string, string>);
      } else {
        setSlots({});
      }
    }
    fetchSlots();
  }, [selectedDate]);

  if (!selectedDate) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {TIMES.map((time) => {
        const isBooked = slots[time] === "booked";
        const isSelected = value === time;
        return (
          <button
            key={time}
            type="button"
            disabled={isBooked}
            onClick={() => onChange(time)}
            className={`py-2 rounded-lg text-xs font-medium border transition ${
              isBooked
                ? "bg-gray-800 text-gray-500 border-gray-800 cursor-not-allowed"
                : isSelected
                  ? "bg-sigaYellow text-black border-sigaYellow"
                  : "bg-[#111] text-gray-200 border-gray-700 hover:border-sigaYellow"
            }`}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}

