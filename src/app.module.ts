import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user.entity';
import { BoardsModule } from './boards/boards.module';
import { Board } from './boards/entity/board.entity';
import { BackgroundsModule } from './backgrounds/backgrounds.module';
import { Background } from './backgrounds/enitity/background.entity';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { BoardColumn } from './columns/entity/column.entity';
import { Card } from './cards/entity/card.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SupportModule } from './support/support.module';
import { Support } from './support/entity/Support.entity';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';
import { JwtConfigModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      // Ensure ConfigModule is available for dependency injection
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        // automatically synchronize the schema with the database
        // synchronize: true, // dangerous, only for dev mode
        entities: [User, Board, BoardColumn, Card, Background, Support],
        migrations: ['dist/migrations/*.js'],
        migrationsTableName: 'typeorm_migrations', // Optional: specify the migrations table name
        synchronize: configService.get<string>('NODE_ENV') === 'development', // Set this to false in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BoardsModule,
    BackgroundsModule,
    ColumnsModule,
    CardsModule,
    CloudinaryModule,
    SupportModule,
    MailerModule,
    JwtConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
