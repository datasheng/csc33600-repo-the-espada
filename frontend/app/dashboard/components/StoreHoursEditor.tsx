"use client";
import React, { useState, useEffect } from "react";
import { Clock, Save, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import axios from "axios";

type StoreHour = { storeHourID: number; day: string; openTime: string; closeTime: string; };
interface Props { storeID: number; }
const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function StoreHoursEditor({ storeID }: Props) {
  const [hoursData, setHoursData] = useState<Array<{
    storeHourID?: number;
    day: string;
    openTime: string;
    closeTime: string;
    isModified?: boolean;
    isOpen?: boolean;
    isValid?: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/store-hours/${storeID}`)
      .then(res => res.json())
      .then((data: StoreHour[]) => {
        const merged = days.map(d => {
          const entry = data.find(h => h.day === d);
          return entry
            ? {
                storeHourID: entry.storeHourID,
                day: d,
                openTime: to24(entry.openTime),
                closeTime: to24(entry.closeTime),
                isModified: false,
                isOpen: !!entry.openTime && !!entry.closeTime,
                isValid: true,
              }
            : {
                day: d,
                openTime: '',
                closeTime: '',
                isModified: false,
                isOpen: false,
                isValid: true,
              };
        });
        setHoursData(merged);
      })
      .catch(err => setError("Failed to load store hours."))
      .finally(() => setLoading(false));
  }, [storeID]);

  const validateTime = (openTime: string, closeTime: string, isOpen: boolean): boolean => {
    if (!isOpen) return true;
    if (!openTime || !closeTime) return false;
    return openTime < closeTime;
  };

  const handleChange = (day: string, field: 'openTime' | 'closeTime', value: string) => {
    setHoursData(prev => prev.map(h => {
      if (h.day === day) {
        const newData = { ...h, [field]: value, isModified: true };
        const isValid = validateTime(
          field === 'openTime' ? value : h.openTime,
          field === 'closeTime' ? value : h.closeTime,
          h.isOpen !== false
        );
        return { ...newData, isValid };
      }
      return h;
    }));
  };

  const handleToggleOpen = (day: string) => {
    setHoursData(prev => prev.map(h => {
      if (h.day === day) {
        const isOpen = !h.isOpen;
        return {
          ...h,
          isOpen,
          isModified: true,
          openTime: isOpen ? h.openTime : '',
          closeTime: isOpen ? h.closeTime : '',
          isValid: validateTime(h.openTime, h.closeTime, isOpen),
        };
      }
      return h;
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      // Simulate API call
      const payload = hoursData
      .filter(h => h.isModified && h.isOpen !== false)
      .map(h => ({
        day: h.day,
        openTime: h.openTime,
        closeTime: h.closeTime
      }));
      await axios.put(`/api/store-hours/${storeID}`, payload);
      setHoursData(prev => prev.map(h => ({ ...h, isModified: false })));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const hasUnsaved = hoursData.some(h => h.isModified);
  const hasInvalid = hoursData.some(h => !h.isValid);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800">Weekly Store Hours</span>
        <button
          onClick={handleSaveAll}
          disabled={!hasUnsaved || hasInvalid || saving}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${!hasUnsaved || hasInvalid || saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>
      {error && (
        <div className="mb-2 flex items-center text-red-600 bg-red-50 rounded px-3 py-2">
          <XCircle className="h-5 w-5 mr-2" /> {error}
        </div>
      )}
      {saved && (
        <div className="mb-2 flex items-center text-green-600 bg-green-50 rounded px-3 py-2">
          <CheckCircle2 className="h-5 w-5 mr-2" /> Changes saved!
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Day</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Open?</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Open Time</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Close Time</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {hoursData.map(h => (
              <tr key={h.day} className="border-b last:border-b-0">
                <td className="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">{h.day}</td>
                <td className="px-4 py-2 text-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.isOpen !== false}
                      onChange={() => handleToggleOpen(h.day)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{h.isOpen !== false ? 'Open' : 'Closed'}</span>
                  </label>
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="time"
                    value={h.openTime}
                    onChange={e => handleChange(h.day, 'openTime', e.target.value)}
                    disabled={h.isOpen === false}
                    className={`w-32 rounded-lg border ${!h.isValid ? 'border-red-300' : 'border-gray-300'} bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="time"
                    value={h.closeTime}
                    onChange={e => handleChange(h.day, 'closeTime', e.target.value)}
                    disabled={h.isOpen === false}
                    className={`w-32 rounded-lg border ${!h.isValid ? 'border-red-300' : 'border-gray-300'} bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  {!h.isValid && h.isOpen !== false && (
                    <span className="inline-flex items-center text-red-500 text-xs"><AlertCircle className="h-4 w-4 mr-1" /> Invalid</span>
                  )}
                  {h.isModified && h.isValid && (
                    <span className="inline-flex items-center text-yellow-500 text-xs"><Save className="h-4 w-4 mr-1" /> Unsaved</span>
                  )}
                  {!h.isModified && h.isValid && h.isOpen !== false && (
                    <span className="inline-flex items-center text-green-500 text-xs"><CheckCircle2 className="h-4 w-4 mr-1" /> Saved</span>
                  )}
                  {h.isOpen === false && (
                    <span className="inline-flex items-center text-gray-400 text-xs">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// helper: convert '02:30 PM' to '14:30'
function to24(time12: string) {
  if (!time12) return '';
  if (time12.includes(':') && (time12.includes('AM') || time12.includes('PM'))) {
    const [time, modifier] = time12.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hours = Number(hourStr);
    const minutes = Number(minuteStr);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
  }
  return time12;
}
