import { Get, Path, Query, Route } from "tsoa";
import {
  cmsService,
  GetPageTreeAsArray,
  GetPageTreeResponse,
} from "../services/cms.service.js";

interface ApiResponse<T> {
  status: number;
  body: {
    data: T;
    correlationId?: string;
  };
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
    return { status: !!result ? 200 : 404, body: result };
  }

  @Get("{id}/children")
  public async getContentChildren(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<any[]>> {
    const result = await cmsService.getContentChildren(id, {
      editmode,
      correlationId,
    });
    return {
      status: !!result && result.length > 0 ? 200 : 404,
      body: { data: result, correlationId },
    };
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
      body: { data: result, correlationId },
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
      body: { data: result, correlationId },
    };
  }

  @Get("/pages/{id}")
  public async getPage(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<any>> {
    const result = await cmsService.getPage(id, {
      editmode,
      correlationId,
    });
    return {
      status: !!result ? 200 : 404,
      body: { data: result, correlationId },
    };
  }

  @Get("/pages/{id}/children")
  public async getPageChildren(
    @Path() id: number,
    @Query() editmode?: boolean,
    @Query() correlationId?: string
  ): Promise<ApiResponse<any[]>> {
    const result = await cmsService.getPageChildren(id, {
      editmode,
      correlationId,
    });
    return {
      status: !!result && result.length > 0 ? 200 : 404,
      body: { data: result, correlationId },
    };
  }

  @Get("sites")
  public async getWebsites(
    @Query() correlationId?: string
  ): Promise<ApiResponse<any[]>> {
    const result = await cmsService.getWebsites();
    return {
      status: !!result && result.length > 0 ? 200 : 404,
      body: { data: result, correlationId },
    };
  }
}
