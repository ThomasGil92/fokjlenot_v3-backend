import { Module } from '@nestjs/common';
//import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
    DatabaseModule,
    UserModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
