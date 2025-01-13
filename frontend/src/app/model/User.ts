import { Role } from "./enum/Role";
import { Sex } from "./enum/Sex";

export interface User {
    id: string;
    role: Role;
    firstName: string;
    lastName: string;
    username: string;
    sex?: Sex;
    age?: number;
    password?: String;
}