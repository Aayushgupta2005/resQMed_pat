/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  User,
  PlusCircle,
} from 'lucide-react';

const Records = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showRegistration, setShowRegistration] = useState(false);
  const [newPatientId, setNewPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');

  const mockRecords = [
    {
      id: '1',
      patientId: 'patient1',
      doctorId: 'doctor1',
      date: new Date('2024-03-15'),
      type: 'Lab Report',
      description: 'Complete Blood Count (CBC) Results',
      attachments: ['cbc_report.pdf'],
    },
    {
      id: '2',
      patientId: 'patient2',
      doctorId: 'doctor2',
      date: new Date('2024-03-14'),
      type: 'X-Ray',
      description: 'Chest X-Ray Analysis',
      attachments: ['chest_xray.pdf', 'radiologist_notes.pdf'],
    },
    {
      id: '3',
      patientId: 'patient3',
      doctorId: 'doctor3',
      date: new Date('2024-03-13'),
      type: 'Prescription',
      description: 'Blood pressure medication prescription',
      attachments: ['prescription.pdf'],
    },
  ];

  const filteredRecords = mockRecords.filter((record) => {
    const matchesSearch =
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());

    return typeFilter === 'all' ? matchesSearch : matchesSearch && record.type === typeFilter;
  });

  const handlePatientRegistration = () => {
    console.log('Registering new patient:', newPatientId, newPatientName);
    setShowRegistration(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
 



      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            className="flex-1 border p-2 rounded-md focus:ring focus:ring-blue-500"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded-md focus:ring focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Lab Report">Lab Reports</option>
            <option value="X-Ray">X-Rays</option>
            <option value="Prescription">Prescriptions</option>
          </select>
        </div>

        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Record Details</th>
              <th className="border p-3">Patient & Doctor</th>
              <th className="border p-3">Date</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="p-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{record.description}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div>Patient: {record.patientId}</div>
                  <div>Doctor: {record.doctorId}</div>
                </td>
                <td className="p-3">{record.date.toLocaleDateString()}</td>
                <td className="p-3 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800"><Eye className="h-5 w-5" /></button>
                  <button className="text-blue-600 hover:text-blue-800"><Download className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Records;