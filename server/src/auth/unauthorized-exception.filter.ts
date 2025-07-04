import {
  ArgumentsHost,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const acceptHeader = request.headers['accept'] || request.headers['Accept'];
    if (acceptHeader && acceptHeader.includes('text/html')) {
      response.redirect('/login');
    } else {
      response.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
  }
}
