import { Get, Path, Query, Route } from "tsoa";
import { NotImplemented } from "../models/http.error/index.js";
import {
  cmsService,
  GetPageTreeAsArray,
  GetPageTreeResponse,
} from "../services/cms.service.js";

interface ApiResponse<T> {
  status: number;
  body: T;
}

@Route("/content")
export class ContentController {
  @Get("{id}")
  public async getContent(
    @Path() id: number,
    @Query("editmode") editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<any>> {
    const result = await cmsService.getContent(id, { editmode, correlationId });
    return { status: 200, body: result };
  }

  @Get("{id}/children")
  public async getContentChildren(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<any[]>> {
    const content = await cmsService.getContentChildren(id, {
      editmode,
      correlationId,
    });
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
  ): Promise<ApiResponse<GetPageTreeResponse>> {
    const result = await cmsService.getPageTree(id, {
      editmode,
      correlationId,
    });
    return {
      status: result.count > 0 ? 200 : 404,
      body: result,
    };
  }

  @Get("/pages/{id}/array")
  public async getPageTreeAsArray(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<GetPageTreeAsArray>> {
    const result = await cmsService.getPageTreeAsArray(id, {
      editmode,
      correlationId,
    });
    return {
      status: result.count > 0 ? 200 : 404,
      body: result,
    };
  }

  @Get("/pages/{id}")
  public async getPage(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<any> {
    throw new NotImplemented();
  }

  @Get("/pages/{id}/children")
  public async getPageChildren(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<any> {
    throw new NotImplemented();
  }

  @Get("sites")
  public async getWebsites(): Promise<any> {
    const result = await cmsService.getWebsites();
    return { status: 200, body: result };
  }
}
