import { Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ERRORS } from '../constants';

// inject any generic error message through filter
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let ex = null;

    if (exception instanceof UnauthorizedException) {
      ex = new UnauthorizedException(ERRORS.UNAUTHORIZED);
    }

    console.log('error: ', exception);

    super.catch(ex, host);
  }
}
