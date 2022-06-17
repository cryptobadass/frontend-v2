import { copperService } from '@/services/copper/coppper.service';
import { computed, onMounted, ref } from 'vue';

export type Country = {
  id: number;
  country: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
};

export default function useUrls() {
  const countries = ref<Array<Country>>([]);
  onMounted(async () => {
    const result = await copperService.pools.lbp.getCountries();
    countries.value = result || [];
  });

  return { countries };
}
