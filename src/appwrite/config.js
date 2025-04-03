import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // 1. Create an Appointment
    async createAppointment({ userId, hospitalId, dateTime, description }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId, // Use a dedicated collection for appointments
                ID.unique(),
                {
                    userId,
                    hospitalId,
                    dateTime,
                    description,
                }
            );
        } catch (error) {
            console.log("Appwrite Service :: createAppointment :: error", error);
            return false;
        }
    }

    // 2. Get Appointments for a User
    async getAppointments(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (error) {
            console.log("Appwrite Service :: getAppointments :: error", error);
            return false;
        }
    }

    // 3. Upload Medical Report (Image)
    async uploadMedicalReport(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteMedicalReportsBucketId, // Separate bucket for medical reports
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite Service :: uploadMedicalReport :: error", error);
            return false;
        }
    }

    // 4. Get Medical Report Preview URL
    getMedicalReportPreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteMedicalReportsBucketId,
            fileId
        );
    }

    // 5. Delete Medical Report
    async deleteMedicalReport(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteMedicalReportsBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite Service :: deleteMedicalReport :: error", error);
            return false;
        }
    }

    // 6. Update Patient Personal Info
    async updatePatientInfo(userId, { name, age, gender, contact, address }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwritePatientsCollectionId, // Use a collection for patient details
                userId, // Use the user's ID as the document ID
                {
                    name,
                    age,
                    gender,
                    contact,
                    address,
                }
            );
        } catch (error) {
            console.log("Appwrite Service :: updatePatientInfo :: error", error);
            return false;
        }
    }

    // 7. Get Patient Personal Info
    async getPatientInfo(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwritePatientsCollectionId,
                userId
            );
        } catch (error) {
            console.log("Appwrite Service :: getPatientInfo :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service;
