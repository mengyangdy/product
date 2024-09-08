import {  ArgumentsHost, Catch, ExceptionFilter, HttpException,LoggerService } from "@nestjs/common";

@Catch(HttpException)// 这个catch不设置参数就是捕获所有的异常 包含websocket 现在只捕获了http的异常
export class HttpExceptionFilter implements ExceptionFilter{
  constructor(private logger:LoggerService){}
  // host就相当于是nest的整个进程 switchtoHttp就是找到当前程序运行的上下文 程序上面是从哪里走过来的  下面该做什么了
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx=host.switchToHttp()
    // 响应对象 
    // 请求对象
    const response=ctx.getResponse()
    const request=ctx.getRequest()
    // http状态码
    const status=exception.getStatus()
    this.logger.error(exception.message,exception.stack)
    response.status(status).json({
      code:status,
      timestamp:new Date().toISOString(),
      path:request.url,
      method:request.method,
      message:exception.message || exception.name
    })
    throw new Error("Method not implemented.");
  }

}