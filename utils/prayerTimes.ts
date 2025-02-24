interface PrayerTimes {
  data: {
    timings: {
      Maghrib: string;
    };
  };
}

const fetchPrayerTime = async (date: string) => {
  const response = await fetch(
    `https://api.aladhan.com/v1/timingsByCity/${date}?city=Casablanca&country=Morocco&method=3`
  );
  const data: PrayerTimes = await response.json();
  return data.data.timings.Maghrib;
};

export const getDeliverySlots = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Fetch both today's and tomorrow's Maghrib times
    const [todayMaghrib, tomorrowMaghrib] = await Promise.all([
      fetchPrayerTime(today),
      fetchPrayerTime(tomorrowStr)
    ]);

    const createSlotsForDate = (maghribTime: string, isToday: boolean) => {
      const [hours, minutes] = maghribTime.split(':').map(Number);
      const maghribDate = new Date();
      if (!isToday) maghribDate.setDate(maghribDate.getDate() + 1);
      maghribDate.setHours(hours, minutes, 0, 0);

      const slots = [];
      const slotTimes = [
        {
          date: new Date(maghribDate.getTime() - 4 * 60 * 60 * 1000),
          label: '3 heures avant Iftar'
        },
        {
          date: new Date(maghribDate.getTime() - 3 * 60 * 60 * 1000),
          label: '2 heures avant Iftar'
        },
        {
          date: new Date(maghribDate.getTime() - 2 * 60 * 60 * 1000),
          label: '1 heures avant Iftar'
        }
      ];

      for (const slot of slotTimes) {
        if (isToday && slot.date <= new Date()) continue;
        
        slots.push({
          id: slot.date.toISOString(),
          time: slot.date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          label: `${slot.date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })} (${slot.label}${!isToday ? ' Demain' : ''})`
        });
      }
      return slots;
    };

    // Get today's slots
    let slots = createSlotsForDate(todayMaghrib, true);

    // If no slots available today, get tomorrow's slots
    if (slots.length === 0) {
      slots = createSlotsForDate(tomorrowMaghrib, false);
      return [
        {
          id: 'notice',
          time: '',
          label: 'Pas de livraison pour aujourd huit '
        },
        ...slots
      ];
    }

    return slots;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return [{
      id: '1',
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      label: 'Error loading delivery times'
    }];
  }
}; 