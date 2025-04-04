import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Search, Plus, CheckCircle, XCircle, Guitar as Hospital, FileText } from "lucide-react";
import authService from "../appwrite/auth";
import service from "../appwrite/config";

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    hospitalName: "",
    dateTime: "",
    description: "",
    status: "scheduled"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        setError("Please login to view appointments");
        setIsLoading(false);
        return;
      }

      const appointmentsData = await service.getAppointments(currentUser.$id);
      if (appointmentsData) {
        setAppointments(appointmentsData.documents);
      }
    } catch (error) {
      setError("Failed to fetch appointments");
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAppointment = async (e) => {
    console.log("fuck off")
    e.preventDefault();
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        setError("Please login to create an appointment");
        return;
      }

      // In a real application, you would have an API to get hospitalId from hospitalName
      // For now, we'll use a mock hospitalId
      const hospitalId = "67ef8fb4001a141fc205";

      const appointmentData = {
        userId: currentUser.$id,
        hospitalId,
        dateTime: new Date(newAppointment.dateTime).toISOString(),
        description: newAppointment.description,
        status: newAppointment.status
      };

      const result = await service.createAppointment(appointmentData);
      if (result) {
        setShowNewAppointmentModal(false);
        setNewAppointment({
          hospitalName: "",
          dateTime: "",
          description: "",
          status: "scheduled"
        });
        fetchAppointments();
      }
    } catch (error) {
      setError("Failed to create appointment");
      console.error("Error creating appointment:", error);
    }
  };

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(app => app.status === "completed").length;
  const cancelledAppointments = appointments.filter(app => app.status === "cancelled").length;

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && appointment.status === statusFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-100 min-h-screen">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-700">Total Appointments</h2>
          <p className="text-2xl font-semibold text-blue-600">{totalAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-700">Completed</h2>
          <p className="text-2xl font-semibold text-green-600">{completedAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-700">Cancelled</h2>
          <p className="text-2xl font-semibold text-red-600">{cancelledAppointments}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <button 
          onClick={() => setShowNewAppointmentModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" /> New Appointment
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search appointments..."
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
              <th className="p-4">Hospital</th>
              <th className="p-4">Description</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.$id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <Calendar className="inline-block h-5 w-5 text-gray-400 mr-2" />
                  {new Date(appointment.dateTime).toLocaleDateString()} - {" "}
                  {new Date(appointment.dateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4">
                  <Hospital className="inline-block h-5 w-5 text-gray-400 mr-2" />
                  {appointment.hospitalName || "Hospital Name"}
                </td>
                <td className="p-4">
                  <FileText className="inline-block h-5 w-5 text-gray-400 mr-2" />
                  {appointment.description}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    appointment.status === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : appointment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {appointment.status === "scheduled" && <Clock className="inline-block h-4 w-4 mr-1" />}
                    {appointment.status === "completed" && <CheckCircle className="inline-block h-4 w-4 mr-1" />}
                    {appointment.status === "cancelled" && <XCircle className="inline-block h-4 w-4 mr-1" />}
                    {/* {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} */}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">New Appointment</h2>
            <form onSubmit={handleCreateAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                  <input
                    type="text"
                    value={newAppointment.hospitalName}
                    onChange={(e) => setNewAppointment({...newAppointment, hospitalName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newAppointment.dateTime}
                    onChange={(e) => setNewAppointment({...newAppointment, dateTime: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newAppointment.description}
                    onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newAppointment.status}
                    onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;