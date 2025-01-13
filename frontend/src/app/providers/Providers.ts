import { AuthenticationServiceFactory } from "../authentication/factory/AuthenticationServiceFactory";
import { MongoAuthenticationService } from "../authentication/mongo/MongoAuthenticationService";
import { AvailabilityRepositoryFactory } from "../db/factories/AvailabilityRepositoryFactory";
import { DoctorRepositoryFactory } from "../db/factories/DoctorRepositoryFactory";
import { UserRepositoryFactory } from "../db/factories/UserRepositoryFactory";
import { VisitRepositoryFactory } from "../db/factories/VisitRepositoryFactory";
import { JsonAvailabilityRepository } from "../db/repositories/json/availability-repository/availability-repository.service";
import { JsonUserRepository } from "../db/repositories/json/user-repository/user-repository.service";
import { JsonVisitRepository } from "../db/repositories/json/visit-repository/visit-repository.service";
import { MongoAvailabilityRepository } from "../db/repositories/mongo/availability-repository/availability-repository.service";
import { MongoDoctorRepository } from "../db/repositories/mongo/doctor-repository/doctor-repository.service";
import { MongoUserRepository } from "../db/repositories/mongo/user-repository/mongo-user-repository.service";
import { MongoVisitRepository } from "../db/repositories/mongo/visit-repository/visit-repository.service";

export const APP_PROVIDERS = [
    MongoVisitRepository,
    MongoUserRepository,
    MongoAvailabilityRepository,
    MongoAuthenticationService,
    MongoDoctorRepository,
    JsonVisitRepository,
    JsonUserRepository,
    JsonAvailabilityRepository,
    VisitRepositoryFactory,
    UserRepositoryFactory,
    AvailabilityRepositoryFactory,
    AuthenticationServiceFactory,
    DoctorRepositoryFactory
]