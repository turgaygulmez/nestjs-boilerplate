import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AuthUtil {
  public static client = null;
  public static authorization = null;

  public static setToken(req) {
    AuthUtil.authorization = req?.headers?.authorization?.replace(
      'Bearer ',
      '',
    );

    if (AuthUtil.authorization) {
      AuthUtil.client = JSON.parse(
        Buffer.from(AuthUtil.authorization?.split('.')[1], 'base64').toString(
          'utf-8',
        ),
      );
    }
  }

  public static getUserRoles(filter = undefined) {
    let roles = AuthUtil.client?.roles;
    if (filter) {
      roles = roles?.filter((x) => x.includes(filter));
    }

    return roles;
  }
}
