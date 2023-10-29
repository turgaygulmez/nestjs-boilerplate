import { RequestMethod } from '@nestjs/common';
import { IProtectedRoute } from '../interfaces/IProtectedRoute';
import { ROUTE } from './routes';

/**
 * List of roles the request token must have
 */
const ADMIN_ROLES = ['ADMIN'];
const USER_ROLES = ['USER'];

export const PROTECTED_ROUTES: IProtectedRoute[] = [
  {
    path: `/version`,
    isPublic: true,
  },
  {
    path: `/${ROUTE.CLIENTS}*`,
    methods: {
      [RequestMethod.ALL]: [...ADMIN_ROLES, ...USER_ROLES],
    },
  },
];
