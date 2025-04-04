import { useState, useEffect } from "react";
import { Loader2, Ambulance, User, Search, Phone, MapPin } from 'lucide-react';

const HospitalLocator = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sosSent, setSosSent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [useNearbyVehicle, setUseNearbyVehicle] = useState(false);
  const [searchingText, setSearchingText] = useState("Connecting to nearby hospitals");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchHospitals(latitude, longitude);
        },
        () => setError("Failed to get location."),
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (sosSent && !accepted) {
      const texts = [
        "Connecting to nearby hospitals",
        "Searching for available ambulances",
        "Checking hospital capacity",
        "Contacting emergency response team"
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setSearchingText(texts[i]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sosSent, accepted]);

  const fetchHospitals = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=30&bounded=1&viewbox=${lon - 0.04},${lat + 0.04},${lon + 0.04},${lat - 0.04}`
      );
      const data = await response.json();

      const hospitalsWithDistance = data.map(hospital => {
        const dLat = (hospital.lat - lat) * (Math.PI / 180);
        const dLon = (hospital.lon - lon) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * (Math.PI / 180)) * Math.cos(hospital.lat * (Math.PI / 180)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = 6371 * c;
        return { ...hospital, distance: distance.toFixed(2) };
      })
        .filter(hospital => hospital.distance <= 3)
        .sort((a, b) => a.distance - b.distance);

      const dummyHospital = {
        display_name: "ResQMed Hospital, Your Local Area, India",
        lat: String(lat + 0.001),
        lon: String(lon + 0.001),
        distance: "2.0"
      };

      setHospitals([dummyHospital, ...hospitalsWithDistance.slice(0, 7)]);
    } catch {
      setError("Failed to fetch hospitals.");
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = () => {
    setSosSent(true);
    setTimeout(() => {
      setAccepted(true);
    }, 10000);
  };

  const getTimeEstimate = (distance) => {
    const speed = 30; // km/h
    const time = (parseFloat(distance) / speed) * 60;
    return `${Math.ceil(time)} min`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-green-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in">🚑 ResQMed - Emergency Care on Wheels</h1>
      {loading ? (
        <div className="flex flex-col items-center animate-pulse text-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-gray-700 mt-2">Fetching hospitals near you...</p>
        </div>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : (
        <ul className="w-full max-w-xl bg-white p-4 rounded-lg shadow-lg space-y-3">
          {hospitals.map((hospital, index) => (
            <li key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition">
              <div className="font-bold text-gray-800 text-lg">{hospital.display_name.split(",")[0]}</div>
              <div className="text-sm text-gray-600">{hospital.display_name.split(",").slice(1, 2).join(", ")}</div>
              <div className="text-sm text-green-600 font-semibold">{hospital.distance} km away</div>
            </li>
          ))}
        </ul>
      )}
      {!sosSent && !loading && (
        <button
          className="mt-6 bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition"
          onClick={handleSOS}
        >
          🚨 Request Emergency Help
        </button>
      )}

      {sosSent && !accepted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Search className="w-16 h-16 text-blue-500 animate-ping absolute" />
                <Search className="w-16 h-16 text-blue-500 relative" />
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Emergency Request Sent</h2>
                <p className="text-lg text-gray-700 animate-pulse">{searchingText}...</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>Location confirmed</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Phone className="w-5 h-5 mr-2" />
                    <span>Emergency services notified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {accepted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">🚨 ResQMed Hospital Accepted Your Request!</h2>
            <p className="text-gray-700 text-lg mb-2">👨‍⚕️ Dr. Dummy will be attending you shortly.</p>
            <p className="text-green-700 font-semibold mb-4">
              🚑 Ambulance arriving in {getTimeEstimate("2.0")}.
            </p>
            <button
              onClick={() => setUseNearbyVehicle(true)}
              className="mt-3 bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-600 transition"
            >
              Try with nearby vehicles
            </button>
            <button
              onClick={() => setAccepted(false)}
              className="mt-3 ml-3 bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {useNearbyVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md text-center">
            <div className="relative mb-6">
              <User className="w-12 h-12 text-yellow-500 animate-bounce" />
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-12 h-12 bg-yellow-500 rounded-full animate-ping opacity-25"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">🚘 Nearby Volunteer Accepted!</h2>
            <p className="text-lg text-gray-700 mb-2">👤 Dummy Helper is 5 min away from you.</p>
            <p className="text-green-700 font-semibold mb-4">Hang tight, help is coming!</p>
            <video 
              className="w-full rounded-lg mb-4 shadow-lg"
              autoPlay 
              loop 
              muted 
              playsInline
              src="https://cdn.jsdelivr.net/gh/stackblitz/stackblitz-demos@master/car-approaching.mp4"
            />
            <button
              onClick={() => setUseNearbyVehicle(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalLocator;
