import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService, } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import * as requestIp from 'request-ip';
import { QueryFailedError } from "typeorm";

@Catch()
export class AllExceptionfilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    let msg:string=exception['response'] || 'Internal Server Error'
    // 加入更多的异常错误逻辑
    if(exception instanceof QueryFailedError){
      msg=exception.message
      if(exception.driverError.errno === 1062){
        msg='唯一索引冲突'
      }
    }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // 还可以加入一些用户信息
      // IP信息
      ip: requestIp.getClientIp(request),
      exceptioin: exception['name'],
      error: msg
    }

    this.logger.error('[toimc]',responseBody)
    httpAdapter.reply(response,responseBody,httpStatus)
  }
}