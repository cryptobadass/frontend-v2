<template>
  <div class="bg-white min-h-screen p-2">
    <el-tabs v-model="activeName" class="text-black p-2">
      <el-tab-pane label="Group" name="groupList">
        <el-button class="mb-2" @click="getGroup">reload</el-button>
        <el-button class="mb-2" @click="createGroup">create group</el-button>
        <el-table :data="groupData" style="width: 100%" stripe>
          <el-table-column prop="date" label="id" width="80" />
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
                >Edit</el-button
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
        <el-table :data="poolsData" style="width: 100%" stripe>
          <el-table-column prop="id" label="id" width="80" />
          <el-table-column prop="lbp_name" label="lbp_name" />
          <el-table-column prop="price" label="price" width="180" />
          <el-table-column prop="start_time" label="start_time" />
          <el-table-column prop="end_time" label="end_time" />
          <el-table-column prop="network" label="network" />
          <el-table-column prop="image_url" label="image_url" />
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
                >Edit</el-button
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
          <el-button type="primary" @click="confirmGroupClick"
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
import axios from 'axios';
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
const groupData = ref([]);
const poolsData = ref([]);
const editGroupState = reactive({ ...emptyGroupState });
const searchGroup = ref('');
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
async function getGroup() {
  const response = await request.get('/api/lbps', {
    // headers: {
    //   token: lsGet('token')
    // }
  });
  if (response.data.success) {
    groupData.value = response.data.result || [];
  }
}
async function getPools() {
  const response = await request.get(
    `/api/pools?group_id=${searchGroup.value}`
  );
  if (response.data.success) {
    poolsData.value = response.data.result || [];
  }
}
function handleEditGroup(index, row) {
  console.log(index, row);
  isCreateGroup.value = false;
  showGroutDraw.value = true;
}
function handleGetPoolsByGroup(index, row) {
  activeName.value = 'Pools';
  searchGroup.value = row.id || '';
}
function confirmGroupClick() {
  if (isCreateGroup.value) {
    createGroupAxios();
  } else {
    updateGroupAxios();
  }
}
function createGroup() {
  editGroupState.id = '';
  editGroupState.description = '';
  editGroupState.image_url = '';
  editGroupState.link = '';
  editGroupState.seq = '';
  editGroupState.title = '';
  isCreateGroup.value = true;
  showGroutDraw.value = true;
}
async function createGroupAxios() {
  // console.log(1);
  const params = {
    title: editGroupState.title,
    description: editGroupState.description,
    image_url: editGroupState.image_url,
    link: editGroupState.link,
    seq: editGroupState.seq
  };
  const response = await request.get('/api/lbp/group/create', {
    headers: { 'Content-Type': 'application/json' },
    data: params
  });
  if (response.data.success) {
    // todo
    ElMessage.success('create success');
    showGroutDraw.value = false;
    getGroup();
  } else {
    ElMessage.error(response.data.message || ' create error');
  }
}
async function updateGroupAxios() {
  const params = {
    title: editGroupState.title,
    description: editGroupState.description,
    image_url: editGroupState.image_url,
    link: editGroupState.link,
    seq: editGroupState.seq,
    deleted: 1
  };
  const response = await axios.get(
    `/api/lbp/group/update/${editGroupState.id}`,
    {
      headers: { 'Content-Type': 'application/json' },
      data: params
    }
  );
  if (response.data.success) {
    // todo
    ElMessage.success('update success');
    showGroutDraw.value = false;
    getGroup();
  } else {
    ElMessage.error(response.data.message || ' update error');
  }
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
