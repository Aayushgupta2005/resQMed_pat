import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Search,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const mockAppointments = [
    {
      id: "1",
      patientName: "John Doe",
      doctorName: "Dr. Smith",
      dateTime: new Date("2024-03-20T09:00:00"),
      status: "scheduled",
      symptoms: "Fever, headache",
    },
    {
      id: "2",
      patientName: "Jane Doe",
      doctorName: "Dr. Brown",
      dateTime: new Date("2024-03-19T14:30:00"),
      status: "completed",
      symptoms: "Back pain",
    },
    {
      id: "3",
      patientName: "Alice Green",
      doctorName: "Dr. Wilson",
      dateTime: new Date("2024-03-21T11:15:00"),
      status: "cancelled",
      symptoms: "Annual checkup",
    },
  ];

  const totalAppointments = mockAppointments.length;
  const completedAppointments = mockAppointments.filter(app => app.status === "completed").length;
  const cancelledAppointments = mockAppointments.filter(app => app.status === "cancelled").length;

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && appointment.status === statusFilter;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-700">Total Appointments</h2>
          <p className="text-2xl font-semibold text-blue-600">{totalAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-700">Completed Appointments</h2>
          <p className="text-2xl font-semibold text-green-600">{completedAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-700">Cancelled Appointments</h2>
          <p className="text-2xl font-semibold text-red-600">{cancelledAppointments}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" /> New Appointment
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients or doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            className="py-2 px-4 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Status</th>
              <th className="p-4">Symptoms</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <Calendar className="inline-block h-5 w-5 text-gray-400 mr-2" />
                  {appointment.dateTime.toLocaleDateString()} - {" "}
                  {appointment.dateTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4">
                  <User className="inline-block h-5 w-5 text-gray-400 mr-2" />
                  {appointment.patientName}
                </td>
                <td className="p-4">{appointment.doctorName}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      appointment.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : appointment.status === "completed"
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-black"
                    }`}>
                    {appointment.status === "scheduled" && <Clock className="inline-block h-4 w-4 mr-1" />}
                    {appointment.status === "completed" && <CheckCircle className="inline-block h-4 w-4 mr-1" />}
                    {appointment.status === "cancelled" && <XCircle className="inline-block h-4 w-4 mr-1" />}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">{appointment.symptoms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;