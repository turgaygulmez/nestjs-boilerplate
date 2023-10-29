import { IProtectedMethods } from './IProtectedMethods';

export interface IProtectedRoute {
  path: string;
  isPublic?: boolean;
  methods?: IProtectedMethods;
}
