import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { TokenAuthGuard } from '../../auth/guards/token-auth.guard';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateArticleCommand } from './commands/create-article.command';
import { PaginateArticleListQuery } from './queries/paginate-article-list.query';
import { FormDataRequest } from 'nestjs-form-data';
import { SearchArticleDto } from './dto/search-article.dto';
import { PolicyGuard } from '../../auth/guards/policy.guard';
import { Actions, CaslSubject, SubjectProxy, UseAbility } from 'nest-casl';
import { Article } from './entities/article.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { UpdateArticleCommand } from './commands/update-article.command';
import { UpdateArticleDto } from './dto/update-article.dto';
import { MapInterceptor } from '../../../interceptors/map.interceptor';
import { JsonIndexResponseDto } from './dto/response/json-index-response.dto';
import { JsonIndexSingleResponseDto } from './dto/response/json-index-single-response.dto';

@Controller('sample/article')
export class ArticleController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  @UseGuards(TokenAuthGuard)
  @FormDataRequest()
  @Redirect('/sample/article')
  async store(@Req() req: Request, @Body() dto: CreateArticleDto) {
    await this.commandBus.execute(
      new CreateArticleCommand(req.user.id, dto.title, dto.content, dto.image),
    );

    return {};
  }

  @Get('create')
  @Render('sample/article/create')
  async create() {
    return {};
  }

  @Get(':id/edit')
  @UseGuards(TokenAuthGuard, PolicyGuard)
  @UseAbility(Actions.update, Article, [
    getRepositoryToken(Article),
    (repo: Repository<Article>, { params }) =>
      repo.findOne({ where: { id: params.id } }),
  ])
  @Render('sample/article/edit')
  async edit(@CaslSubject() subjectProxy: SubjectProxy<Article>) {
    const article = await subjectProxy.get();

    return {
      article,
    };
  }

  @Put(':id')
  @UseGuards(TokenAuthGuard, PolicyGuard)
  @FormDataRequest()
  @UseAbility(Actions.update, Article, [
    getRepositoryToken(Article),
    (repo: Repository<Article>, { params }) =>
      repo.findOne({ where: { id: params.id } }),
  ])
  async update(
    @CaslSubject() subjectProxy: SubjectProxy<Article>,
    @Res() res: Response,
    @Body() dto: UpdateArticleDto,
  ) {
    const article = await subjectProxy.get();

    await this.commandBus.execute(new UpdateArticleCommand(article, dto));

    return res.redirect(`/sample/article/${article.id}/edit`);
  }

  @Get()
  @Render('sample/article/index')
  async index(@Query() searchDto: SearchArticleDto) {
    const articles = await this.queryBus.execute(
      new PaginateArticleListQuery(searchDto),
    );

    return {
      articles,
      searchDto,
    };
  }

  @Get('json')
  @UseInterceptors(new MapInterceptor(['private']))
  async jsonIndex(@Query() searchDto: SearchArticleDto) {
    const articles = await this.queryBus.execute(
      new PaginateArticleListQuery(searchDto),
    );

    return new JsonIndexResponseDto(articles.items, articles.meta);
  }

  @Get('json-single')
  @UseInterceptors(new MapInterceptor(['private']))
  async jsonIndexSingle(@Query() searchDto: SearchArticleDto) {
    const articles = await this.queryBus.execute(
      new PaginateArticleListQuery(searchDto),
    );

    return new JsonIndexSingleResponseDto(articles.items[0]);
  }
}
