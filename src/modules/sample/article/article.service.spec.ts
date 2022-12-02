import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { when } from 'jest-when';
import { CreateArticle } from './types/create-article.interface';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { articleFactory } from '../../../database/factories/article.factory';
import { UpdateArticle } from './types/update-article.interface';

describe('ArticleService', () => {
  let service: ArticleService;
  const articleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const fileStorage = {
    upload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: FileStorageService,
          useValue: fileStorage,
        },
        {
          provide: getRepositoryToken(Article),
          useValue: articleRepository,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('create', async () => {
    const dto: CreateArticle = {
      content: 'content',
      image: {
        path: 'imagePath',
      } as FileSystemStoredFile,
      title: 'title',
      userId: 1,
    };
    const uploadedImage = 'path/to/image.jpg';
    const article = articleFactory(),
      savedArticle = articleFactory();

    when(articleRepository.create)
      .calledWith({
        userId: dto.userId,
        title: dto.title,
        content: dto.content,
      })
      .mockReturnValueOnce(article);

    when(fileStorage.upload)
      .calledWith(dto.image, 'article')
      .mockReturnValueOnce(uploadedImage);

    when(articleRepository.save)
      .calledWith({
        ...article,
        image: uploadedImage,
      })
      .mockResolvedValueOnce(savedArticle);

    const result = await service.create(dto);

    expect(result).toBe(savedArticle);
  });

  it('delete', async () => {
    const article = articleFactory();

    await service.delete(article);

    expect(fileStorage.delete).toHaveBeenCalledWith(article.image);
    expect(articleRepository.delete).toHaveBeenCalledWith(article.id);
  });

  describe('update', () => {
    it('이미지 포함', async () => {
      const dto = {
        userId: 2,
        title: 'title',
        content: 'content',
        image: {
          path: 'image-path',
        } as FileSystemStoredFile,
      } as UpdateArticle;
      const article = articleFactory(),
        savedArticle = articleFactory();
      const uploadedImage = 'path/to/image.jpg';

      when(fileStorage.upload)
        .calledWith(dto.image, 'article')
        .mockReturnValueOnce(uploadedImage);

      when(articleRepository.save)
        .calledWith({
          ...article,
        })
        .mockResolvedValueOnce(savedArticle);

      await service.update(
        {
          ...article,
        },
        dto,
      );

      expect(fileStorage.delete).toHaveBeenCalledWith(article.image);
    });

    it('이미지 없음', async () => {
      const dto = {
        userId: 2,
        title: 'title',
        content: 'content',
      } as UpdateArticle;
      const article = articleFactory(),
        savedArticle = articleFactory();

      when(articleRepository.save)
        .calledWith({
          ...article,
        })
        .mockResolvedValueOnce(savedArticle);

      await service.update(
        {
          ...article,
        },
        dto,
      );

      expect(fileStorage.delete).not.toHaveBeenCalled();
    });
  });
});
