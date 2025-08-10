import { Json } from '@/core/types/general/json.type';
import { QueryParser as Parser } from '@/core/types/general/query-parser.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MongooseQueryParser, QueryOptions } from 'mongoose-query-parser';

export const QueryParser = createParamDecorator(
  (param: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const parser = new MongooseQueryParser();

    const parsedQuery: Json = parser.parse(request.query);

    parsedQuery.options = {};
    parsedQuery.search = request.query.search;

    const page = parsedQuery?.filter?.page && Number(parsedQuery.filter.page);
    parsedQuery.options.limit = parsedQuery.limit && Number(parsedQuery.limit);
    parsedQuery.options.sort = parsedQuery.sort;
    parsedQuery.options.page = page;

    delete parsedQuery.filter.page;
    delete parsedQuery.limit;
    delete parsedQuery.filter.limit;
    delete parsedQuery.filter.search;
    delete parsedQuery.options.filter;
    delete parsedQuery.options.offset;

    const payload = <Parser>{
      filter: parsedQuery.filter,
      options: parsedQuery.options,
      search: parsedQuery.search,
    };

    const result = param ? payload && payload[param] : payload;

    return <QueryOptions>result;
  },
);
