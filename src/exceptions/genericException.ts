import { HttpException, HttpStatus } from '@nestjs/common';
import { ERRORS } from 'src/constants';

export class GenericException extends HttpException {
  constructor(message?: string) {
    super(message || ERRORS.GENERIC, HttpStatus.BAD_REQUEST);
  }
}
