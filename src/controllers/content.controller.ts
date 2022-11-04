import { Get, Path, Query, Route } from "tsoa";
import { NotImplemented } from "../models/httpError.ts/index";

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
    throw new NotImplemented();
  }

  @Get("{id}/children")
  public async getContentChildren(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ApiResponse<ContentResponse[] | null>> {
    throw new NotImplemented();
  }

  @Get("/pages")
  public async allPages(
    @Query() editmode?: boolean
  ): Promise<ApiResponse<ContentResponse[] | null>> {
    throw new NotImplemented();
  }

  @Get("/pages/tree")
  public async allPagesAsTree(
    @Query() editmode?: boolean
  ): Promise<ApiResponse<GetPagesTreeResponseBody>> {
    throw new NotImplemented();
  }

  @Get("/pages/{id}")
  public async getPage(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ContentResponse[] | null> {
    throw new NotImplemented();
  }

  @Get("/pages/{id}/children")
  public async getPageChildren(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ContentResponse[] | null> {
    throw new NotImplemented();
  }
}
