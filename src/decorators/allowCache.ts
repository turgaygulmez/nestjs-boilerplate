import { SetMetadata } from '@nestjs/common';
import { CACHE_METADATA } from '../constants';

export const AllowCache = () => SetMetadata(CACHE_METADATA, true);
