import { Get, Path, Query, Route } from "tsoa";
import { HttpError } from "../models/httpError.ts/index";

interface ApiResponse<T> {
  status: number;
  body: T;
}

interface Content {
  message: number;
}

interface ContentResponse {
  message: number;
}

interface GetPagesTreeResponseBody {
  tree: any;
  count: number;
}

@Route("api/content")
export default class ContentController {
  @Get("{id}")
  public async getContent(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ApiResponse<Content>> {
    throw new HttpError({ statusCode: 404 });
  }

  @Get("{id}/children")
  public async getContentChildren(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ApiResponse<ContentResponse[] | null>> {
    throw new HttpError({ statusCode: 400 });
  }

  @Get("/pages")
  public async allPages(
    @Query() editmode?: boolean
  ): Promise<ApiResponse<ContentResponse[] | null>> {
    return {
      status: 200,
      body: [],
    };
  }

  @Get("/pages/tree")
  public async allPagesAsTree(
    @Query() editmode?: boolean
  ): Promise<ApiResponse<GetPagesTreeResponseBody>> {
    return { status: 200, body: { tree: 123, count: 1337 } };
  }

  @Get("/pages/{id}")
  public async getPage(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ContentResponse[] | null> {
    if (id !== 3) return null;
    return [{ message: 3 }];
  }

  @Get("/pages/{id}/children")
  public async getPageChildren(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ContentResponse[] | null> {
    return [];
  }
}
