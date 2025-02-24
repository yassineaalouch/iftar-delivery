import { useState } from 'react';

interface LocationInputProps {
  value: string;
  onChange: (address: string) => void;
}

const LocationInput = ({ value, onChange }: LocationInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocationByIP = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return `${data.city}, ${data.region}, ${data.country_name}`;
    } catch (error) {
      console.error('Error getting IP location:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getGPSLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            resolve(data.display_name);
          } catch (error) {
            reject('Error converting coordinates to address');
            console.error('Error getting GPS location:', error);
          }
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  };

  const handleGetLocation = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Try GPS first
      const gpsAddress = await getGPSLocation();
      onChange(gpsAddress);
    } catch (gpsError) {
      console.log('GPS failed, trying IP location:', gpsError);
      
      // Fall back to IP geolocation
      const ipAddress = await getLocationByIP();
      if (ipAddress) {
        onChange(ipAddress);
      } else {
        setError('Could not determine location');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your address"
          className="w-full rounded-lg border p-2"
        />
        <button
          onClick={handleGetLocation}
          disabled={isLoading}
          className="px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#2c5545] disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Locating...
            </span>
          ) : (
            'Get Location'
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LocationInput; 