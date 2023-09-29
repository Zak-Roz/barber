import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

const logger = new LoggerService('HTTP');

export function requestResponseLogger(request: Request, response: Response, next: NextFunction): void {
  const { ip, method, originalUrl } = request;
  const userAgent = request.get('user-agent') || '';

  response.on('finish', () => {
    const { statusCode } = response;
    const contentLength = response.get('content-length');

    logger.log(
      `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
    );
  });

  next();
}
