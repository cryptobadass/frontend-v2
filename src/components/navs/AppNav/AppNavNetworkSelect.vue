<template>
  <BalPopover no-pad>
    <template v-slot:activator>
      <BalBtn
        class="border-gunmetal border dark:bg-dark-222"
        outline
        color="white"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
      >
        <img
          :src="iconSrc(activeNetwork)"
          :alt="activeNetwork.name"
          class="w-6 h-6 rounded-full"
        />
        <span class="ml-2">
          {{ activeNetwork.name }}
        </span>
        <BalIcon name="chevron-down" size="sm" class="ml-2" />
      </BalBtn>
    </template>
    <div class="flex flex-col w-44 rounded-lg overflow-hidden">
      <div
        class="p-3 border-b dark:border-gray-900 whitespace-nowrap text-gray-500 font-medium"
      >
        Select a network
      </div>
      <!-- :href="appUrl(network)" -->
      <a
        v-for="network in networks"
        :key="network.id"
        class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-850"
      >
        <div class="flex items-center">
          <img
            :src="iconSrc(network)"
            :alt="network.name"
            class="w-6 h-6 rounded-full mr-2"
          />
          <span class="ml-1 font-medium">
            {{ network.name }}
          </span>
        </div>
        <BalIcon v-if="isActive(network)" name="check" class="text-cyan" />
      </a>
    </div>
  </BalPopover>
</template>

<script lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import ConfigService from '@/services/config/config.service';
import { defineComponent } from 'vue';

export interface NetworkOption {
  id: string;
  name: string;
  subdomain?: string;
  key?: string;
}

export default defineComponent({
  name: 'AppNavNetworkSelect',

  setup() {
    // SERVICES
    const configService = new ConfigService();

    // COMPOSABLES
    const { upToLargeBreakpoint } = useBreakpoints();

    // DATA
    const networks = [
      {
        id: 'avalanche',
        name: 'Avalanche',
        subdomain: 'app',
        key: '43114'
      },
      {
        id: 'fuji',
        name: 'Avalanche Fuji ',
        subdomain: 'fuji',
        key: '43113'
      }
      // {
      //   id: 'ethereum',
      //   name: 'Ethereum',
      //   subdomain: 'app',
      //   key: '1'
      // },
      // {
      //   id: 'kovan',
      //   name: 'Kovan test',
      //   subdomain: 'kovan',
      //   key: '42'
      // }
      // {
      //   id: 'rinkeby',
      //   name: 'Rinkeby test',
      //   subdomain: 'rinkeby',
      //   key: '4'
      // }
      // {
      //   id: 'polygon',
      //   name: 'Polygon',
      //   subdomain: 'polygon',
      //   key: '137'
      // },
      // {
      //   id: 'arbitrum',
      //   name: 'Arbitrum',
      //   subdomain: 'arbitrum',
      //   key: '42161'
      // }
    ];

    const appNetworkSupported = networks
      .map(network => network.key)
      .includes(configService.network.key);

    const activeNetwork = networks.find(network => {
      if (!appNetworkSupported && network.id === 'ethereum') return true;
      return isActive(network);
    });

    // METHODS
    function iconSrc(network: NetworkOption): string {
      return require(`@/assets/images/icons/networks/${network.id}.svg`);
    }

    function appUrl(network: NetworkOption): string {
      return `https://${network.subdomain}.balancer.fi`;
    }

    function isActive(network: NetworkOption): boolean {
      if (!appNetworkSupported && network.id === 'ethereum') return true;
      return configService.network.key === network.key;
    }

    return {
      // computed
      upToLargeBreakpoint,
      // data
      networks,
      activeNetwork,
      // methods
      isActive,
      appUrl,
      iconSrc
    };
  }
});
</script>
