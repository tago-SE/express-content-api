import { Get, Path, Query, Route } from "tsoa";
import { NotImplemented } from "../models/http.error.ts/index";
import { CmsService } from "../services/cms.service";

const host = "https://dev.prod.cms.developer.if-insurance.com/// ";
const cmsService = new CmsService({ host });

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
export default class ContentController {
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

  @Get("/pages/tree")
  public async allPagesAsTree(
    @Query() editmode?: boolean
  ): Promise<ApiResponse<any>> {
    throw new NotImplemented();
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
