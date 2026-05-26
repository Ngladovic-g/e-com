
import { test as base } from '@playwright/test';
import { ApiSession } from '../utils/ApiSession'
import { UserApi } from '../pages-api/UserApi';
//import { ProductApi } from '../pages-api/ProductApi';

type ApiFixtures = {
  session: ApiSession;
  userApi: UserApi;
 // productApi: ProductApi;
};

export const test = base.extend<ApiFixtures>({
  session: async ({ request }, use) => {
    const session = new ApiSession(request);
    await session.login();
    await use(session);
  },

  userApi: async ({ request, session }, use) => {
    await use(new UserApi(request, session.getToken()));
  },
/*
  productApi: async ({ request, session }, use) => {
    await use(new ProductApi(request, session.getToken()));
  },
  */
});
export { expect } from '@playwright/test';