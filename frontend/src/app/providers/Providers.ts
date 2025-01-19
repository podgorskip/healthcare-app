import { AuthenticationServiceFactory } from "../authentication/factory/AuthenticationServiceFactory";
import { MongoAuthenticationService } from "../authentication/mongo/MongoAuthenticationService";
import { CartRepositoryFactory } from "../db/factories/CartRepositoryFactory";
import { DoctorRepositoryFactory } from "../db/factories/DoctorRepositoryFactory";
import { PatientRepositoryFactory } from "../db/factories/PatientRepositoryFactory";
import { ReviewRepositoryFactory } from "../db/factories/ReviewRepositoryFactory";
import { UserRepositoryFactory } from "../db/factories/UserRepositoryFactory";
import { VisitRepositoryFactory } from "../db/factories/VisitRepositoryFactory";
import { MongoCartRepository } from "../db/repositories/mongo/cart-repository/cart-repository.service";
import { MongoDoctorRepository } from "../db/repositories/mongo/doctor-repository/doctor-repository.service";
import { MongoPatientRepository } from "../db/repositories/mongo/patient-repository/patient-repository.service";
import { MongoReviewRepository } from "../db/repositories/mongo/review-repository/review-repository.service";
import { MongoUserRepository } from "../db/repositories/mongo/user-repository/user-repository.service";
import { MongoVisitRepository } from "../db/repositories/mongo/visit-repository/visit-repository.service";

export const APP_PROVIDERS = [
    MongoVisitRepository,
    MongoAuthenticationService,
    MongoDoctorRepository,
    MongoPatientRepository,
    MongoCartRepository,
    MongoUserRepository,
    MongoReviewRepository,
    VisitRepositoryFactory,
    AuthenticationServiceFactory,
    DoctorRepositoryFactory,
    PatientRepositoryFactory,
    CartRepositoryFactory,
    UserRepositoryFactory,
    ReviewRepositoryFactory
]