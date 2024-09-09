import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
     const ctx=host.switchToHttp()
     const response=ctx.getResponse()
  }
}
