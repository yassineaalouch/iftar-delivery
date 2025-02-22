export const getDeliveryFee = (orderTime: Date): number | null => {
  const hour = orderTime.getHours();
  
  if (hour >= 8 && hour < 13) {
    return 10; // 8 AM to 1 PM: 10 MAD
  } else if (hour >= 13 && hour < 15) {
    return 15; // 1 PM to 3 PM: 15 MAD
  } else {
    return null; // Orders not allowed
  }
};

export const isOrderingAllowed = (orderTime: Date): boolean => {
  const hour = orderTime.getHours();
  return hour >= 8 && hour < 15; // Allow orders between 8 AM and 3 PM
}; 