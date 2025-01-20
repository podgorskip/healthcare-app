import { Observable } from "rxjs";
import { Authentication } from "../../model/Authentication";

export interface AuthenticationServiceInterface {
    authenticate(credentials: Authentication): void;

    logout(): void;

    refreshAccessToken(): Observable<any>;
}