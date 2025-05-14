"use client";
import { useState } from "react";

// Add helper function from business-setup page
const to24Hour = (time: string): string | null => {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

interface Props {
    storeID: number;
    initialHours: {
        daysOpen: string;
        openTime: string;
        closeTime: string;
    }[];
    onSave: (hours: any[]) => Promise<void>;
    onCancel: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StoreHoursEditor({ storeID, initialHours, onSave, onCancel }: Props) {
    // Add console.log to debug initialHours
    console.log('Initial hours received:', initialHours);

    const [hours, setHours] = useState(() => {
        const defaultHours = DAYS_OF_WEEK.reduce((acc, day) => {
            // First set default values
            acc[day] = { 
                closed: false,
                open: '09:00',
                close: '17:00'
            };

            // Then override with actual values if they exist
            const dayHours = initialHours.find(h => h.daysOpen === day);
            if (dayHours) {
                // Process both times the same way
                const isClosed = dayHours.openTime === 'CLOSED' || dayHours.closeTime === 'CLOSED';
                const openTime = dayHours.openTime && dayHours.openTime !== 'CLOSED' ? dayHours.openTime : '09:00';
                const closeTime = dayHours.closeTime && dayHours.closeTime !== 'CLOSED' ? dayHours.closeTime : '17:00';
                
                acc[day] = {
                    closed: isClosed,
                    open: openTime.substring(0, 5),  // Consistently format both times
                    close: closeTime.substring(0, 5)  // Consistently format both times
                };
            }

            return acc;
        }, {} as Record<string, { closed: boolean; open: string; close: string; }>);

        console.log('Final processed hours:', defaultHours);
        return defaultHours;
    });

    const handleSubmit = async () => {
        const formattedHours = DAYS_OF_WEEK.map(day => ({
            daysOpen: day,
            openTime: hours[day].closed ? null : to24Hour(hours[day].open),
            closeTime: hours[day].closed ? null : to24Hour(hours[day].close)
        }));

        await onSave(formattedHours);
    };

    return (
        <div className="space-y-6">
            {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex items-center space-x-4">
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700">
                            {day}
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={hours[day].closed}
                            onChange={(e) => setHours(prev => ({
                                ...prev,
                                [day]: { ...prev[day], closed: e.target.checked }
                            }))}
                            className="h-4 w-4 text-yellow-400"
                        />
                        <span className="text-sm text-gray-500">Closed</span>
                    </div>
                    {!hours[day].closed && (
                        <>
                            <input
                                type="time"
                                value={hours[day].open}
                                onChange={(e) => setHours(prev => ({
                                    ...prev,
                                    [day]: { ...prev[day], open: e.target.value }
                                }))}
                                className="p-2 border border-gray-300 rounded-md"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="time"
                                value={hours[day].close}
                                onChange={(e) => setHours(prev => ({
                                    ...prev,
                                    [day]: { ...prev[day], close: e.target.value }
                                }))}
                                className="p-2 border border-gray-300 rounded-md"
                            />
                        </>
                    )}
                </div>
            ))}

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
