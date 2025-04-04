import React, { useState, useEffect } from "react";
import { Users, Calendar, Activity, FileText, MapPin, Bell, Search, AlertTriangle, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const API_KEY = "de73f4aaaa9143e1a3d2a2fac1206a8a";
  // const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async (countryCode = "in") => {
    try {
      let response = await fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&q=medical%20schemes&apiKey=${API_KEY}`);
      let data = await response.json();
  
      if (!data.articles || data.articles.length === 0){
        response = await fetch(`https://newsapi.org/v2/everything?q=medical%20schemes&language=en&apiKey=${API_KEY}`);
        data = await response.json();
      }
  
      setNews(data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  const navigate = useNavigate();
  const handleSOSClick = () => {
    navigate("/sos");
  };

  useEffect(() => {
    // Simulated API data
    setHospitals([
      { name: "AIIMS Delhi", state: "Delhi", beds: 120, doctors: 200 },
      { name: "KGMU Lucknow", state: "Uttar Pradesh", beds: 300, doctors: 400 },
      { name: "Apollo Chennai", state: "Tamil Nadu", beds: 150, doctors: 220 },
    ]);
  }, []);

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8 space-y-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Healthcare Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-600 hover:text-blue-500 transition" />
          <span className="text-gray-600 text-sm">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: "Appointments Today", value: "48", icon: Calendar },
          { name: "Medical Records", value: "5,248", icon: FileText }].map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition">
            <stat.icon className="h-10 w-10 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{stat.name}</h2>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
  <div className="flex items-center justify-center h-">
    <button
      onClick={handleSOSClick}
      className="px-6 py-3 text-white text-lg font-bold bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition"
    >
      🚨 SOS
    </button>
  </div>
      {/* Hospital Search & List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center space-x-4 border-b pb-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search hospitals or states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-none focus:ring-0 text-lg text-gray-700"
          />
        </div>
        <ul className="mt-4 divide-y divide-gray-200">
          {filteredHospitals.map((hospital, index) => (
            <li key={index} className="py-4 flex justify-between items-center hover:bg-gray-50 transition">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">{hospital.name}</h3>
                <p className="text-gray-500">{hospital.state}</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Beds: {hospital.beds}</p>
                <p className="text-green-600 font-medium">Doctors: {hospital.doctors}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Alerts */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-2" /> Emergency Alerts
        </h2>
        <ul className="mt-4 space-y-2">
          <li className="text-red-600 font-medium">Low blood supply in Delhi hospitals.</li>
          <li className="text-orange-600 font-medium">System maintenance tonight at 11 PM.</li>
        </ul>
      </div>




      {/* News Alerts */}
<div className="bg-white p-6 rounded-xl shadow-md">
<h2 className="text-lg font-semibold flex justify-start text-gray-900 flex items-center"><AlertTriangle className="h-6 w-6 text-red-600 mr-2" /> Latest news</h2>
<div className=" pt-4 mx-auto ">
  
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {news.slice(0,5).map((article, index) => (
          <div key={index} className="border rounded-lg p-4">
            {article.urlToImage && <img src={article.urlToImage} alt="news" className="w-full h-40 object-cover mb-2 rounded-md" />}
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 inline-block">Read more</a>
          </div>
        ))}
      </div>
    </div>
    

    </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        <ul className="mt-4 divide-y divide-gray-200">
          {[{ patient: "Sarah Johnson", doctor: "Dr. Michael Chen", time: "09:00 AM", status: "scheduled" },
            { patient: "Robert Smith", doctor: "Dr. Emily Wong", time: "10:30 AM", status: "completed" },
            { patient: "Maria Garcia", doctor: "Dr. James Wilson", time: "11:45 AM", status: "cancelled" }].map((appointment, index) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{appointment.patient}</h3>
                <p className="text-gray-500">{appointment.doctor} - {appointment.time}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                appointment.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                appointment.status === "completed" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"}`}>{appointment.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;