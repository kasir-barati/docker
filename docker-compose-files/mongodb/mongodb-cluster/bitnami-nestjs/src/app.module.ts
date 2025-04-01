import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './schemas/cat.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '.env'),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbName = configService.getOrThrow<string>('MONGODB_DATABASE');
        const username = configService.getOrThrow<string>('MONGODB_USERNAME');
        const password = configService.getOrThrow<string>('MONGODB_PASSWORD');
        const replicaSetName = configService.getOrThrow<string>(
          'MONGODB_REPLICA_SET_NAME',
        );
        const uri = `mongodb://${username}:${password}@mongodb-primary:27017,mongodb-secondary:27017,mongodb-arbiter:27017/${dbName}?replicaSet=${replicaSetName}`;

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'schema.gql'),
          sortSchema: true,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          debug: configService.get('NODE_ENV') !== 'production',
        };
      },
    }),
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
