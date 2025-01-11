import { Authentication } from "../../model/Authentication";

export interface AuthenticationServiceInterface {
    authenticate(credentials: Authentication): void;
}