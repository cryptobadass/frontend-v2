<template>
  <div class="bg-white min-h-screen p-2">
    <el-tabs v-model="activeName" class="text-black p-2">
      <el-tab-pane label="Group" name="groupList">
        <el-button class="mb-2" @click="getGroup">reload</el-button>
        <el-button class="mb-2" @click="createGroup">create group</el-button>
        <el-button class="mb-2" @click="saveToYotei">save one pool</el-button>
        <el-table
          :data="groupData"
          style="width: 100%"
          stripe
          v-loading="loadingGroupList"
        >
          <el-table-column prop="id" label="id" width="80" />
          <el-table-column prop="title" label="title" width="180" />
          <el-table-column prop="description" label="description" />
          <el-table-column prop="image_url" label="image_url" />
          <el-table-column prop="link" label="link" />
          <el-table-column prop="seq" label="seq" />
          <el-table-column label="Operations">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEditGroup(scope.$index, scope.row)"
                >Edit</el-button
              >
              <el-button
                size="small"
                @click="handleGetPoolsByGroup(scope.$index, scope.row)"
                >Pools</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Pools" name="Pools">
        <div class="w-40 mr-2 inline-block">
          <el-input v-model="searchGroup"></el-input>
        </div>
        <el-button @click="getPools">search</el-button>
        <el-table
          :data="poolsData"
          style="width: 100%"
          stripe
          v-loading="loadingPoolsList"
        >
          <el-table-column prop="id" label="id" width="80" />
          <el-table-column prop="lbp_name" label="lbp_name" />
          <el-table-column prop="price" label="price" width="180" />
          <el-table-column prop="start_time" label="start_time" />
          <el-table-column prop="end_time" label="end_time" />
          <el-table-column prop="network_id" label="network" />
          <el-table-column prop="image_url" label="image_url" />
          <el-table-column label="Operations">
            <template #default="scope">
              <!-- <el-button
                size="small"
                @click="handleEditGroup(scope.$index, scope.row)"
                >Edit</el-button
              > -->
              <el-button
                size="small"
                @click="handleGetPoolDetailByid(scope.$index, scope.row)"
                >Pools</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-drawer v-model="showGroutDraw" direction="rtl">
      <template #title>
        <h4>{{ isCreateGroup ? 'create' : 'edit' }} Group</h4>
      </template>
      <template #default>
        <div>
          <el-form :model="editGroupState" label-width="100px">
            <el-form-item label="title"
              ><el-input v-model="editGroupState.title"
            /></el-form-item>
            <el-form-item label="description"
              ><el-input v-model="editGroupState.description"
            /></el-form-item>
            <el-form-item label="image_url"
              ><el-input v-model="editGroupState.image_url"
            /></el-form-item>
            <el-form-item label="link"
              ><el-input v-model="editGroupState.link"
            /></el-form-item>
            <el-form-item label="seq"
              ><el-input v-model="editGroupState.seq" type="number"
            /></el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="showGroutDraw = false">cancel</el-button>
          <el-button
            type="primary"
            :loading="loadingGroup"
            @click="confirmGroupClick"
            >confirm</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue';

import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { lsGet, lsSet, sleep } from '@/lib/utils';
import { isRequired } from '@/lib/utils/validations';
// import axios from 'axios';
import { ElMessage } from 'element-plus';
import { copperService } from '@/services/copper/coppper.service';
import request from '@/lib/utils/request';

const { t } = useI18n();
const emptyGroupState = {
  id: '',
  title: '',
  description: '',
  image_url: '',
  link: '',
  seq: ''
};
/**
 * STATE
 */
const activeName = ref('groupList');
const isCreateGroup = ref(true);
const showGroutDraw = ref(false);
const groupData = ref<Array<any>>([]);
const poolsData = ref<Array<any>>([]);
const editGroupState = reactive({ ...emptyGroupState });
const searchGroup = ref('');
const loadingGroup = ref(false);
const loadingGroupList = ref(false);
const loadingPoolsList = ref(false);
/**
 * COMPOSABLES
 */

/**
 * COMPUTED
 */
// const appLoading = computed(() => store.state.app.loading);
// const tradeInterface = computed(() => store.state.app.tradeInterface);

/**
 * METHODS
 */
function getGroup() {
  loadingGroupList.value = true;
  request
    .get<any, { success: boolean; result: Array<any> }>('/api/lbps')
    .then(data => {
      groupData.value = data.result || [];
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      loadingGroupList.value = false;
    });
}
async function getPools() {
  loadingPoolsList.value = true;
  request
    .get<any, { success: boolean; result: Array<any> }>(
      `/api/pools?group_id=${searchGroup.value}`
    )
    .then(data => {
      poolsData.value = data.result || [];
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      loadingPoolsList.value = false;
    });
}
function handleGetPoolDetailByid(index, row) {
  request
    .get<any, { success: boolean; result: any }>(`/api/pool/${row.pool_id}`)
    .then(data => {
      console.log(`pool- ${row.pool_id} -`, data);
      ElMessage.success('see result in console');
    })
    .catch(e => {
      console.log(e);
    });
}
function handleEditGroup(index, row) {
  console.log(index, row);
  setGroup(row);
  isCreateGroup.value = false;
  showGroutDraw.value = true;
}
function handleGetPoolsByGroup(index, row) {
  activeName.value = 'Pools';
  searchGroup.value = row.id || '';
  getPools();
}
function confirmGroupClick() {
  if (isCreateGroup.value) {
    createGroupAxios();
  } else {
    updateGroupAxios();
  }
}
function setGroup(obj) {
  editGroupState.id = obj.id || '';
  editGroupState.description = obj.description || '';
  editGroupState.image_url = obj.image_url || '';
  editGroupState.link = obj.link || '';
  editGroupState.seq = obj.seq || '';
  editGroupState.title = obj.title || '';
}
function createGroup() {
  setGroup({});
  isCreateGroup.value = true;
  showGroutDraw.value = true;
}
async function createGroupAxios() {
  loadingGroup.value = true;
  const params = {
    title: editGroupState.title,
    description: editGroupState.description,
    image_url: editGroupState.image_url,
    link: editGroupState.link,
    seq: editGroupState.seq
  };
  request
    .post('/api/lbp/group/create', {
      ...params
    })
    .then(data => {
      // if (data.success) {
      ElMessage.success('create success');
      showGroutDraw.value = false;
      getGroup();
      // }
    })
    .catch(e => {
      // ElMessage.error(e.data?.message || ' create error');
    })
    .finally(() => {
      loadingGroup.value = false;
    });
}
function updateGroupAxios() {
  loadingGroup.value = true;
  const params = {
    title: editGroupState.title,
    description: editGroupState.description,
    image_url: editGroupState.image_url,
    link: editGroupState.link,
    seq: editGroupState.seq
    // deleted: 1
  };
  request
    .post(`/api/lbp/group/update/${editGroupState.id}`, {
      ...params
    })
    .then(data => {
      ElMessage.success('update success');
      showGroutDraw.value = false;
      getGroup();
    })
    .catch(e => {
      // ElMessage.error(e.data?.message || ' update error');
    })
    .finally(() => {
      loadingGroup.value = false;
    });
}

function saveToYotei() {
  const data = {
    base_token: '0x286EA60Cb66ba7647C8143c5d467594B92A3734C',
    blocked_countries: ['us', 'cn'],
    description: 'des',
    end_time: 1652671469,
    group_id: 6,
    image_url:
      'https://img-operation.csdnimg.cn/csdn/silkroad/img/1607569674685.png',
    lbp_creation_tx:
      '0x5fbf09ef013bbc1534f643743a35c0ad15ad84f710dbbe4ce136df3548fe55e5',
    lbp_name: 'lance Copper LBP',
    lbp_symbol: 'LC_LBP',
    learn_more_url: 'https://www.baidu.com',
    main_token: '0x32F106297E28bBf71FFC41b74DA98D78b703B479',
    network_id: 43113,
    owner_address: '0xD3aac8967515aF9647506B6a5E0C9F9C44a38e08',
    pool_address: '0x8b5311Bb17F0677CE9fDBB16598DCb367cCB4fEf',
    pool_id:
      '0x8b5311bb17f0677ce9fdbb16598dcb367ccb4fef000200000000000000000031',
    price: '1',
    start_time: 1652412269,
    swap_fee: '0.025'
  };
  console.log('save lbp to Yotei', data);
  copperService.pools.lbp.saveLBP(data);
}

/**
 * CALLBACKS
 */
onMounted(async () => {
  // selectedPoolTokens are only persisted between the Home/Pool pages
  // setSelectedTokens([]);
  // const { token } = await copperService.pools.lbp.getToken();
  // // console.log('token:', token);
  // lsSet('token', token);
  getGroup();
});
</script>

<style scoped>
.graph-modal {
  height: 450px;
}
.subsection {
  @apply p-4;
}
</style>
