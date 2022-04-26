import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/index.vue';
import PoolPage from '@/pages/pool/_id.vue';
import PoolInvestPage from '@/pages/pool/invest.vue';
import PoolWithdrawPage from '@/pages/pool/withdraw.vue';
import LiquidityMiningPage from '@/pages/liquidity-mining.vue';
import TradePage from '@/pages/trade.vue';
import CreatePoolPage from '@/pages/pool/create.vue';
import TermsOfUsePage from '@/pages/terms-of-use.vue';
import PrivacyPolicyPage from '@/pages/privacy-policy.vue';
import CookiesPolicyPage from '@/pages/cookies-policy.vue';

import CreateCopperPage from '@/pages/copper/create.vue';
import UI from '@/pages/ui.vue';
// import GetVeBalPage from '@/pages/get-vebal.vue';
// import UnlockVeBalPage from '@/pages/unlock-vebal.vue';
// import VeBalPage from '@/pages/vebal.vue';
// import ClaimPage from '@/pages/claim.vue';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    bgColors?: {
      dark: string;
      light: string;
    };
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/trade/:assetIn?/:assetOut?',
    name: 'trade',
    component: TradePage
  },
  {
    path: '/swap/:assetIn?/:assetOut?',
    redirect: to => {
      return `/trade${to.path.split('/swap')[1]}`;
    }
  },
  {
    path: '/pool/create',
    name: 'create-pool',
    component: CreatePoolPage,
    meta: { layout: 'FocusedLayout' }
  },
  {
    path: '/pool/:id',
    name: 'pool',
    component: PoolPage
  },
  {
    path: '/pool/:id/invest',
    name: 'invest',
    component: PoolInvestPage,
    meta: { layout: 'PoolTransferLayout' }
  },
  {
    path: '/pool/:id/withdraw',
    name: 'withdraw',
    component: PoolWithdrawPage,
    meta: { layout: 'PoolTransferLayout' }
  },
  {
    path: '/copper/create',
    name: 'create-copper',
    component: CreateCopperPage,
    meta: { layout: 'FocusedLayout' }
  },
  {
    path: '/ui',
    name: 'ui',
    component: UI,
    meta: { layout: 'BlankLayout' },
    // redirect: '/'
  },
  {
    path: '/liquidity-mining',
    name: 'liquidity-mining',
    component: LiquidityMiningPage,
    redirect: '/'
  },
  {
    path: '/terms-of-use',
    name: 'terms-of-use',
    component: TermsOfUsePage,
    meta: { layout: 'ContentLayout' },
    redirect: '/'
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyPage,
    meta: { layout: 'ContentLayout' },
    redirect: '/'
  },
  {
    path: '/cookies-policy',
    name: 'cookies-policy',
    component: CookiesPolicyPage,
    meta: { layout: 'ContentLayout' },
    redirect: '/'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
  // {
  //   path: '/vebal',
  //   name: 'vebal',
  //   component: VeBalPage
  // },
  // {
  //   path: '/get-vebal',
  //   name: 'get-vebal',
  //   component: GetVeBalPage,
  //   meta: { layout: 'FocusedLayout' }
  // },
  // {
  //   path: '/unlock',
  //   name: 'unlock',
  //   component: UnlockVeBalPage,
  //   meta: { layout: 'FocusedLayout' }
  // },
  // {
  //   path: '/claim',
  //   name: 'claim',
  //   component: ClaimPage
  // }
];

/**
 * DEV/STAGING ONLY ROUTES
 */
// if (
//   ['development', 'staging'].includes(process.env.VUE_APP_ENV || 'development')
// ) {
//   routes.push();
// }

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
