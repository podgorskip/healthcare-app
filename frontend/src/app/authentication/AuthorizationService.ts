import { Role } from "../model/enum/Role";

export class Authorization {
    static isAdmin = (role: Role | undefined): boolean => {
        if (!role || role === undefined) return false;
        return role === Role.ADMIN;
    }

    static isDoctor = (role: Role | undefined): boolean => {
        if (!role || role === undefined) return false;
        return role === Role.DOCTOR;
    }

    static isPatient = (role: Role | undefined | null): boolean => {
        if (!role || role === undefined) return false;
        return role === Role.PATIENT;
    }
}