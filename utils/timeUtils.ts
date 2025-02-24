export const getDeliveryFee = (date: Date): number => {
  const hour = date.getHours();
  
  // Standard delivery fee
  return 15;
};

// Change this to always return true and handle tomorrow's orders
export const isOrderingAllowed = (): boolean => {
  return true;
};

export const isOrderForTomorrow = (date: Date): boolean => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  
  // Convert current time to minutes since midnight
  const currentTimeInMinutes = hour * 60 + minutes;
  
  // If it's after cutoff time (e.g., after last delivery slot), order is for tomorrow
  return currentTimeInMinutes >= 20 * 60; // After 8 PM
}; 