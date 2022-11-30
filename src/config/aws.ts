import { AwsServiceConfigurationOptionsFactory } from 'nest-aws-sdk';
import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) =>
  ({
    region: configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
    },
  } as AwsServiceConfigurationOptionsFactory);
