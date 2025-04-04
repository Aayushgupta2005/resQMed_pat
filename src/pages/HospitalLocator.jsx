import { useState, useEffect } from "react";
import { Loader2, Ambulance, User, Search, Phone, MapPin, ShieldAlert } from "lucide-react";

const HospitalLocator = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sosSent, setSosSent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [useNearbyVehicle, setUseNearbyVehicle] = useState(false);
  const [searchingText, setSearchingText] = useState("Connecting to nearby hospitals");
  const [policeHelpCalled, setPoliceHelpCalled] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchHospitals(latitude, longitude);
          fetchPoliceStations(latitude, longitude);
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
      const hospitalsWithDistance = calculateDistances(data, lat, lon).filter(h => h.distance <= 3);
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

  const fetchPoliceStations = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=police%20station&limit=20&bounded=1&viewbox=${lon - 0.04},${lat + 0.04},${lon + 0.04},${lat - 0.04}`
      );
      const data = await response.json();
      const stationsWithDistance = calculateDistances(data, lat, lon).filter(station => station.distance <= 3);
      setPoliceStations(stationsWithDistance.slice(0, 5));
    } catch {
      setError("Failed to fetch police stations.");
    }
  };

  const calculateDistances = (data, lat, lon) =>
    data.map(place => {
      const dLat = (place.lat - lat) * (Math.PI / 180);
      const dLon = (place.lon - lon) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * (Math.PI / 180)) *
          Math.cos(place.lat * (Math.PI / 180)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c;
      return { ...place, distance: distance.toFixed(2) };
    }).sort((a, b) => a.distance - b.distance);

  const handleSOS = () => {
    setSosSent(true);
    setTimeout(() => setAccepted(true), 10000);
  };

  const handlePoliceHelp = () => {
    setPoliceHelpCalled(true);
    setTimeout(() => setPoliceHelpCalled(false), 5000);
  };

  const getTimeEstimate = (distance) => {
    const speed = 30; // km/h
    const time = (parseFloat(distance) / speed) * 60;
    return `${Math.ceil(time)} min`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-white to-green-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in">
        🚑 ResQMed - Emergency Care on Wheels
      </h1>

      {loading ? (
        <div className="flex flex-col items-center animate-pulse text-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-gray-700 mt-2">Fetching nearby locations...</p>
        </div>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : (
        <>
          {/* Hospitals List */}
          <ul className="w-full max-w-xl bg-white p-4 rounded-lg shadow-lg space-y-3 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🏥 Nearby Hospitals</h2>
            {hospitals.map((hospital, index) => (
              <li
                key={index}
                className="p-4 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition"
              >
                <div className="font-bold text-gray-800 text-lg">
                  {hospital.display_name.split(",")[0]}
                </div>
                <div className="text-sm text-gray-600">
                  {hospital.display_name.split(",").slice(1, 2).join(", ")}
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  {hospital.distance} km away
                </div>
              </li>
            ))}
          </ul>

          {/* Police Stations List */}
          <ul className="w-full max-w-xl bg-white p-4 rounded-lg shadow-lg space-y-3">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🚓 Nearby Police Stations</h2>
            {policeStations.map((station, index) => (
              <li
                key={index}
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition"
              >
                <div className="font-bold text-gray-800 text-lg">
                  {station.display_name.split(",")[0]}
                </div>
                <div className="text-sm text-gray-600">
                  {station.display_name.split(",").slice(1, 2).join(", ")}
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  {station.distance} km away
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Action Buttons */}
      {!sosSent && !loading && (
        <div className="flex space-x-4 mt-6">
          <button
            className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition"
            onClick={handleSOS}
          >
            🚨 Request Emergency Help
          </button>
          <button
            className="bg-yellow-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-700 transition"
            onClick={handlePoliceHelp}
          >
            🚓 Call Nearby Police
          </button>
        </div>
      )}

      {/* Police Alert Popup */}
      {policeHelpCalled && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-yellow-400 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50">
          <ShieldAlert className="text-yellow-500 w-6 h-6" />
          <span className="text-yellow-700 font-medium">
            Police have been alerted. Help is on the way!
          </span>
        </div>
      )}

      {/* SOS Search Overlay */}
      {sosSent && !accepted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Search className="w-16 h-16 text-blue-500 animate-ping absolute" />
                <Search className="w-16 h-16 text-blue-500 relative" />
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Emergency Request Sent
                </h2>
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

      {/* SOS Accepted Overlay + Share Button */}
      {accepted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              🚨 ResQMed Hospital Accepted Your Request!
            </h2>
            <p className="text-gray-700 text-lg mb-2">
              👨‍⚕️ Dr. Dummy will be attending you shortly.
            </p>
            <p className="text-green-700 font-semibold mb-4">
              🚑 Ambulance arriving in {getTimeEstimate("2.0")}.
            </p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                "Just helped save a life using #RescuMed! 🚑 Join the movement: https://resqumed.com"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalLocator;
