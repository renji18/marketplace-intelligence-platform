import { envData } from 'src/utils/env.manager';

export const jwtConstants = {
  secret: envData().access_secret,
};
