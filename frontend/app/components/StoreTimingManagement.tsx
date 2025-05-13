'use client';

import { useState, useEffect } from 'react';

interface StoreTiming {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function StoreTimingManagement() {
  const [timings, setTimings] = useState<StoreTiming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch store timings from API
    // This is a placeholder for demonstration
    setTimings(
      DAYS_OF_WEEK.map(day => ({
        day,
        isOpen: true,
        openTime: '09:00',
        closeTime: '17:00',
      }))
    );
    setLoading(false);
  }, []);

  const handleTimingChange = (day: string, field: keyof StoreTiming, value: string | boolean) => {
    setTimings(timings.map(timing =>
      timing.day === day ? { ...timing, [field]: value } : timing
    ));
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update store timings
      console.log('Saving store timings:', timings);
    } catch (error) {
      console.error('Error saving store timings:', error);
    }
  };

  if (loading) {
    return <div className="text-[#FFD700]">Loading store timings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/30 shadow overflow-hidden sm:rounded-md ring-1 ring-[#FFD700]/30">
        <ul className="divide-y divide-[#FFD700]/30">
          {timings.map((timing) => (
            <li key={timing.day} className="px-6 py-4 hover:bg-black/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={timing.isOpen}
                    onChange={(e) => handleTimingChange(timing.day, 'isOpen', e.target.checked)}
                    className="h-4 w-4 text-[#FFD700] focus:ring-[#FFD700] border-[#FFD700]/30 rounded bg-black/50"
                  />
                  <span className="ml-3 text-sm font-medium text-white">{timing.day}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="text-sm text-[#FFD700] mr-2">Open:</label>
                    <input
                      type="time"
                      value={timing.openTime}
                      onChange={(e) => handleTimingChange(timing.day, 'openTime', e.target.value)}
                      className="border border-[#FFD700]/30 rounded px-2 py-1 bg-black/50 text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                      disabled={!timing.isOpen}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm text-[#FFD700] mr-2">Close:</label>
                    <input
                      type="time"
                      value={timing.closeTime}
                      onChange={(e) => handleTimingChange(timing.day, 'closeTime', e.target.value)}
                      className="border border-[#FFD700]/30 rounded px-2 py-1 bg-black/50 text-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                      disabled={!timing.isOpen}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#FFD700] text-black px-4 py-2 rounded-md hover:bg-[#FFD700]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 