import { Observable } from "rxjs";
import { Authentication } from "../../../model/Authentication";
import { User } from "../../../model/User";

export interface AuthenticationServiceInterface {
    authenticate(credentials: Authentication): Observable<User | null>;

    logout(): void;

    refreshAccessToken(): Observable<any>;
}