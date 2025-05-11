"use client";
import React, { useState, useEffect } from "react";

type StoreHour = { storeHourID: number; day: string; openTime: string; closeTime: string; };
interface Props { storeID: number; }
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function StoreHoursEditor({ storeID }: Props) {
  const [hoursData, setHoursData] = useState<Array<{storeHourID?: number; day: string; openTime: string; closeTime: string}>>([]);

  useEffect(() => {
    fetch(`/api/store-hours/${storeID}`)
      .then(res => res.json())
      .then((data: StoreHour[]) => {
        // Merge fetched hours with all days
        const merged = days.map(d => {
          const entry = data.find(h => h.day === d);
          return entry
            ? { storeHourID: entry.storeHourID, day: d, openTime: to24(entry.openTime), closeTime: to24(entry.closeTime) }
            : { day: d, openTime: '', closeTime: '' };
        });
        setHoursData(merged);
      })
      .catch(err => console.error(err));
  }, [storeID]);

  const handleChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setHoursData(prev => prev.map(h => h.day === day ? { ...h, [field]: value } : h));
  };

  const handleSave = (entry: {storeHourID?: number; day: string; openTime: string; closeTime: string}) => {
    // Frontend-only save: just confirm changes in local state
    alert(`Saved ${entry.day} (frontend only)`);
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Store Hours</h2>
      <table className="table-auto w-full mb-4">
        <thead><tr><th>Day</th><th>Open</th><th>Close</th><th>Action</th></tr></thead>
        <tbody>
          {hoursData.map(h => (
            <tr key={h.day}>
              <td>{h.day}</td>
              <td>
                <input type="time" value={h.openTime} onChange={e=>handleChange(h.day,'openTime',e.target.value)} className="border p-1 rounded" />
              </td>
              <td>
                <input type="time" value={h.closeTime} onChange={e=>handleChange(h.day,'closeTime',e.target.value)} className="border p-1 rounded" />
              </td>
              <td>
                <button onClick={()=>handleSave(h)} className="bg-blue-500 text-white px-2 py-1 rounded">
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// helper: convert '02:30 PM' to '14:30'
function to24(time12: string) {
  const [time, modifier] = time12.split(' ');
  const [hourStr, minuteStr] = time.split(':');
  let hours = Number(hourStr);
  const minutes = Number(minuteStr);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
}
