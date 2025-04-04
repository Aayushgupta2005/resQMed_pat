import React, { useState, useEffect } from "react";
import { Calendar, Clock, Search, Plus, CheckCircle, XCircle, FileText, Trash2, X } from "lucide-react";
import service from "../appwrite/config";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    hospitalName: "",
    dateTime: "",
    description: "",
    status: "scheduled",
  });
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const user = await service.getCurrentUser();
      if (!user) {
        setError("Please login to view appointments");
        setIsLoading(false);
        return;
      }
      setCurrentUser(user);
      const res = await service.getAppointments(user.$id);
      if (res && res.documents) {
        setAppointments(res.documents);
      } else {
        setError("No appointments found");
      }
    } catch (err) {
      setError("Failed to fetch appointments: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAppointment = (appointment) => {
    if (!appointment.hospitalName.trim()) {
      throw new Error("Hospital name is required");
    }
    if (!appointment.dateTime) {
      throw new Error("Date and time are required");
    }
    if (!appointment.description.trim()) {
      throw new Error("Description is required");
    }
    
    const appointmentDate = new Date(appointment.dateTime);
    if (appointmentDate < new Date()) {
      throw new Error("Appointment date must be in the future");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!currentUser) {
        throw new Error("Please login to create an appointment");
      }

      validateAppointment(newAppointment);

      const data = {
        userId: currentUser.$id,
        hospitalId: "67ef8fb4001a141fc205",
        hospitalName: newAppointment.hospitalName.trim(),
        dateTime: new Date(newAppointment.dateTime).toISOString(),
        description: newAppointment.description.trim(),
        status: "scheduled",
      };

      const response = await service.createAppointment(data);
      
      if (!response) {
        throw new Error("Failed to create appointment");
      }

      setShowModal(false);
      setNewAppointment({
        hospitalName: "",
        dateTime: "",
        description: "",
        status: "scheduled",
      });
      await fetchAppointments();
    } catch (err) {
      setError(err.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const success = await service.deleteAppointment(id);
      if (success) {
        await fetchAppointments();
      } else {
        setError("Failed to delete appointment");
      }
    } catch (err) {
      setError("Failed to delete appointment: " + err.message);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const match = a.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusFilter === "all" ? match : match && a.status === statusFilter;
  });

  const totalAppointments = appointments.length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Appointments" value={totalAppointments} color="blue" />
        <Card title="Completed" value={completed} color="green" />
        <Card title="Cancelled" value={cancelled} color="red" />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <button
          onClick={() => setShowModal(true)}
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
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((app) => {
              const status = app.status ?? "scheduled";
              return (
                <tr key={app.$id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <Calendar className="inline-block h-5 w-5 text-gray-400 mr-2" />
                    {new Date(app.dateTime).toLocaleDateString()} -{" "}
                    {new Date(app.dateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">{app.hospitalName || "Unknown Hospital"}</td>
                  <td className="p-4">
                    <FileText className=" inline-block h-5 w-5 text-gray-400 mr-2" />
                    {app.description}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status === "scheduled" && <Clock className="inline h-4 w-4 mr-1" />}
                      {status === "completed" && <CheckCircle className="inline h-4 w-4 mr-1" />}
                      {status === "cancelled" && <XCircle className="inline h-4 w-4 mr-1" />}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(app.$id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ModalForm
          newAppointment={newAppointment}
          setNewAppointment={setNewAppointment}
          onCancel={() => setShowModal(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <h2 className="text-xl font-bold text-gray-700">{title}</h2>
    <p className={`text-2xl font-semibold text-${color}-600`}>{value}</p>
  </div>
);

const ModalForm = ({ newAppointment, setNewAppointment, onCancel, onSubmit, isSubmitting }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">New Appointment</h2>
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <InputField
            label="Hospital Name"
            type="text"
            value={newAppointment.hospitalName}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, hospitalName: e.target.value })
            }
            required
          />
          <InputField
            label="Date & Time"
            type="datetime-local"
            value={newAppointment.dateTime}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, dateTime: e.target.value })
            }
            min={new Date().toISOString().slice(0, 16)}
            required
          />
          <TextAreaField
            label="Description"
            value={newAppointment.description}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, description: e.target.value })
            }
            required
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      rows={3}
    />
  </div>
);

export default Appointments;