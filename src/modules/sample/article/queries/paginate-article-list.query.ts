interface Parameter {
  title?: string;
  firstName?: string;
  page: number;
}

export class PaginateArticleListQuery {
  constructor(public readonly params: Parameter) {}
}
