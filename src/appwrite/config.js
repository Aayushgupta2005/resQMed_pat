import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
        this.account = new Account(this.client);
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (err) {
            console.error("Appwrite Service :: getCurrentUser :: error", err);
            return null;
        }
    }

    async createAppointment({ userId, hospitalId, hospitalName, dateTime, description, status }) {
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                ID.unique(),
                {
                    userId,
                    hospitalId,
                    hospitalName,
                    dateTime,
                    description,
                    status: status || "scheduled",
                }
            );
            console.log("Appointment created:", response);
            return response;
        } catch (err) {
            console.error("Appwrite Service :: createAppointment :: error", err.message, err.code, err.response);
            return false;
        }
    }
    

    async getAppointments(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (err) {
            console.error("Appwrite Service :: getAppointments :: error", err);
            return false;
        }
    }

    async deleteAppointment(appointmentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                appointmentId
            );
            return true;
        } catch (err) {
            console.error("Appwrite Service :: deleteAppointment :: error", err);
            return false;
        }
    }

    async uploadMedicalReport(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteMedicalReportsBucketId,
                ID.unique(),
                file
            );
        } catch (err) {
            console.error("Appwrite Service :: uploadMedicalReport :: error", err);
            return false;
        }
    }

    getMedicalReportPreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteMedicalReportsBucketId,
            fileId
        );
    }

    async deleteMedicalReport(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteMedicalReportsBucketId,
                fileId
            );
            return true;
        } catch (err) {
            console.error("Appwrite Service :: deleteMedicalReport :: error", err);
            return false;
        }
    }

    async updatePatientInfo(userId, { name, age, gender, contact, address }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwritePatientsCollectionId,
                userId,
                {
                    name,
                    age,
                    gender,
                    contact,
                    address,
                }
            );
        } catch (err) {
            console.error("Appwrite Service :: updatePatientInfo :: error", err);
            return false;
        }
    }

    async getPatientInfo(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwritePatientsCollectionId,
                userId
            );
        } catch (err) {
            console.error("Appwrite Service :: getPatientInfo :: error", err);
            return false;
        }
    }

    async getMedicalReports(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteMedicalReportsCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (err) {
            console.error("Appwrite Service :: getMedicalReports :: error", err);
            return false;
        }
    }
}

const service = new Service();
export default service;
