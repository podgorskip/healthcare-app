import { AvailabilityRepositoryFactory } from "../db/factories/AvailabilityRepositoryFactory";
import { UserRepositoryFactory } from "../db/factories/UserRepositoryFactory";
import { VisitRepositoryFactory } from "../db/factories/VisitRepositoryFactory";
import { MongoAvailabilityRepository } from "../db/repositories/mongo/availability-repository/availability-repository.service";
import { MongoUserRepository } from "../db/repositories/mongo/user-repository/mongo-user-repository.service";
import { MongoVisitRepository } from "../db/repositories/mongo/visit-repository/visit-repository.service";

export const APP_PROVIDERS = [
    MongoVisitRepository,
    MongoUserRepository,
    MongoAvailabilityRepository,
    VisitRepositoryFactory,
    UserRepositoryFactory,
    AvailabilityRepositoryFactory
]