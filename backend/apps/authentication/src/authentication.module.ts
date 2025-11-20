import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { databaseConfig } from '@core/config';
import { DatabaseModule } from '@core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserRepository],
})
export class AuthenticationModule {}
