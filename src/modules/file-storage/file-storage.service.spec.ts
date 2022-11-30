import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageService } from './file-storage.service';
import { getAwsServiceToken } from 'nest-aws-sdk/dist/lib/tokens';
import { S3 } from 'aws-sdk';
import { when } from 'jest-when';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

jest.mock('fs');

describe('FileStorageService', () => {
  let service: FileStorageService;
  const s3 = {
    headObject: jest.fn(),
    upload: jest.fn(),
    deleteObject: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileStorageService,
        {
          provide: getAwsServiceToken(S3),
          useValue: s3,
        },
        {
          provide: ConfigService,
          useValue: { get: (key) => key },
        },
      ],
    }).compile();

    service = module.get<FileStorageService>(FileStorageService);
  });

  describe('upload', () => {
    async function callUploadMethod() {
      const filePath = faker.system.filePath();

      when(fs.readFileSync)
        .calledWith(filePath)
        .mockReturnValueOnce('file-body');

      when(s3.upload)
        .calledWith(
          expect.objectContaining({
            Body: 'file-body',
            Bucket: 'AWS_S3_BUCKET',
            Key: expect.stringMatching(
              new RegExp(path.join('AWS_S3_BASE_PATH', '/test') + '*'),
            ),
          }),
        )
        .mockReturnValueOnce({
          promise: () => new Promise((resolve) => resolve({ Key: 'result' })),
        });

      const result = await service.upload(
        { path: filePath } as FileSystemStoredFile,
        '/test',
      );

      expect(result).toEqual('result');
    }

    it('파일명 중복 없음', async () => {
      when(s3.headObject)
        .calledWith(
          expect.objectContaining({
            Bucket: 'AWS_S3_BUCKET',
            Key: expect.stringMatching(
              new RegExp(path.join('AWS_S3_BASE_PATH', '/test') + '*'),
            ),
          }),
        )
        .mockReturnValue({
          promise: () =>
            new Promise((resolve, reject) => {
              reject();
            }),
        });

      await callUploadMethod();
    });

    it('파일명 중복 있음', async () => {
      when(s3.headObject)
        .calledWith(
          expect.objectContaining({
            Bucket: 'AWS_S3_BUCKET',
            Key: expect.stringMatching(
              new RegExp(path.join('AWS_S3_BASE_PATH', '/test') + '*'),
            ),
          }),
        )
        .mockReturnValueOnce({
          promise: () =>
            new Promise((resolve) => {
              resolve(1);
            }),
        })
        .mockReturnValueOnce({
          promise: () => new Promise((resolve, reject) => reject()),
        });

      await callUploadMethod();
      expect(s3.headObject).toHaveBeenCalledTimes(2);
    });
  });

  describe('delete', () => {
    it('삭제 성공', async () => {
      const filePath = '/a/97be31e948ddf53f0052818a1d9a3083674d17e2.jpg';

      when(s3.deleteObject)
        .calledWith({
          Key: path.join('AWS_S3_BASE_PATH', filePath),
          Bucket: 'AWS_S3_BUCKET',
        })
        .mockReturnValueOnce({
          promise: () => new Promise((resolve) => resolve(1)),
        });

      const result = await service.delete(filePath);

      expect(result).toEqual(true);
    });

    it('삭제 실패', async () => {
      const filePath = '/a/97be31e948ddf53f0052818a1d9a3083674d17e2.jpg';

      when(s3.deleteObject)
        .calledWith({
          Key: path.join('AWS_S3_BASE_PATH', filePath),
          Bucket: 'AWS_S3_BUCKET',
        })
        .mockReturnValueOnce({
          promise: () => new Promise((resolve, reject) => reject()),
        });

      const result = await service.delete(filePath);

      expect(result).toEqual(false);
    });
  });
});
