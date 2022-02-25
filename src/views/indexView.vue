<template>
  <div class="max-w-5xl px-10 py-10 mx-2 my-3 bg-white rounded-lg shadow-xl">
    <n-form
      ref="formRef"
      :model="fromModel"
      :rules="formRules"
      size="medium"
      label-placement="top"
    >
      <n-collapse default-expanded-names="2" accordion>
        <n-collapse-item title="基础设置" name="1">
          <n-form-item path="api" label="API地址">
            <n-input
              v-model:value="fromModel.api"
              type="text"
              placeholder="请输入api地址"
            />
          </n-form-item>
          <n-form-item path="userId" label="你的用户Id">
            <n-input
              v-model:value="fromModel.userId"
              type="text"
              placeholder="请输入你的用户Id"
            />
          </n-form-item>
          <n-form-item path="token" label="用户Token">
            <n-input
              v-model:value="fromModel.token"
              type="text"
              placeholder="请输入你的token"
            />
          </n-form-item>
        </n-collapse-item>
        <n-collapse-item title="发送设置" name="2">
          <div>Java</div>
        </n-collapse-item>
      </n-collapse>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import {
  NForm,
  NCollapse,
  NCollapseItem,
  NFormItem,
  NInput,
  FormRules
} from 'naive-ui'
const formRules: FormRules = {
  api: {
    required: true
  },
  userId: { required: true },
  token: { required: true }
}
const fromModel = ref({
  api: '',
  userId: '',
  token: ''
})
</script>

<style scoped></style>
