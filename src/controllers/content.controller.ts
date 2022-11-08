import { Get, Path, Query, Route } from "tsoa";
import { NotImplemented } from "../models/http.error/index.js";
import { cmsService } from "../services/cms.service.js";

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

@Route("/content")
export class ContentController {
  @Get("{id}")
  public async getContent(
    @Path() id: number,
    @Query("editmode") editmode?: boolean
  ): Promise<ApiResponse<any>> {
    console.log("Yo");
    const content = await cmsService.getContent(id, { editmode });
    return { status: 200, body: content };
  }

  @Get("{id}/children")
  public async getContentChildren(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<ApiResponse<any[]>> {
    const content = await cmsService.getContentChildren(id, { editmode });
    return { status: 200, body: content };
  }

  @Get("/pages")
  public async allPages(
    @Query() editmode?: boolean
  ): Promise<ApiResponse<any>> {
    throw new NotImplemented();
  }

  @Get("/pages/{id}/tree")
  public async getPageTree(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<any>> {
    const content = await cmsService.getPageTree(id, {
      editmode,
      correlationId,
    });
    return {
      status: !!content.data && content.children.length > 0 ? 200 : 404,
      body: content,
    };
  }

  @Get("/pages/{id}")
  public async getPage(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<any> {
    throw new NotImplemented();
  }

  @Get("/pages/{id}/children")
  public async getPageChildren(
    @Path() id: number,
    @Query() editmode?: boolean
  ): Promise<any> {
    throw new NotImplemented();
  }

  @Get("sites")
  public async getWebsites(): Promise<any> {
    const content = await cmsService.getWebsites();
    return { status: 200, body: content };
  }
}
