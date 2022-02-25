<template>
  <div class="max-w-5xl px-10 py-10 mx-3 my-3 bg-white rounded-lg shadow-xl">
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
              v-model:value="settingFromModel.api"
              type="text"
              placeholder="请输入api地址"
            />
          </n-form-item>
          <n-form-item path="userId" label="你的用户Id">
            <n-input
              v-model:value="settingFromModel.userId"
              type="text"
              placeholder="请输入你的用户Id"
            />
          </n-form-item>
          <n-form-item path="token" label="用户Token">
            <n-input
              v-model:value="settingFromModel.token"
              type="text"
              placeholder="请输入你的token"
            />
          </n-form-item>
        </n-collapse-item>
        <n-collapse-item title="发送设置" name="2">
          <n-form-item path="type" label="可视范围">
            <n-select
              v-model:value="fromModel.type"
              placeholder="选择可视范围"
              :options="typeOptions"
            />
          </n-form-item>
          <n-form-item path="tag" label="选择标签">
            <n-select
              v-model:value="fromModel.tag"
              placeholder="选择可视范围"
              :options="tagOptions"
            />
          </n-form-item>
          <n-form-item path="showComment" label="是否允许评论">
            <n-select
              v-model:value="fromModel.showComment"
              placeholder="选择可视范围"
              :options="showCommentOptions"
            />
          </n-form-item>
          <n-form-item path="content" label="发布内容">
            <n-input
              v-model:value="fromModel.content"
              placeholder="speak内容"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
            />
          </n-form-item>
          <div class="text-center">
            <n-button
              type="success"
              class="text-green-700 w-28"
              @click="handleValidateButtonClick"
            >
              发布
            </n-button>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import {
  NForm,
  NCollapse,
  NCollapseItem,
  NFormItem,
  NInput,
  FormRules,
  NSelect,
  FormInst,
  useMessage,
  NButton
} from 'naive-ui'
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formRules: FormRules = {
  api: {
    required: true
  },
  userId: { required: true },
  token: { required: true },
  type: { required: true },
  tag: { required: true },
  showComment: { required: true },
  content: { required: true }
}
const typeOptions = [
  {
    label: '全部可见',
    value: '0'
  },
  {
    label: '登录可见',
    value: '1'
  },
  {
    label: '自己可见',
    value: '2'
  }
]
const tagOptions = ref<any[]>([])
const showCommentOptions = ref([
  {
    label: '允许评论',
    value: '1'
  },
  {
    label: '不允许评论',
    value: '0'
  }
])
const settingFromModel = ref({
  api: '',
  userId: '',
  token: ''
})
const fromModel = ref({
  type: '0',
  tag: '',
  showComment: '1',
  content: ''
})
const getTagList = async (api: string, userId: string): Promise<any[]> => {
  if (api && userId) {
    const tagList = await (
      await fetch(api + '/ispeak/tag/list?userId=' + userId)
    )
      .json()
      .catch((e) => {
        return { data: [] }
      })
    return tagList.data
  } else {
    return []
  }
}
const sendSpeak = async () => {
  const result = await (
    await fetch(settingFromModel.value.api + '/ispeak/addByToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: settingFromModel.value.userId,
        token: settingFromModel.value.token,
        ...fromModel.value
      })
    })
  ).json()
  console.log(result)
  if (result.code !== 0) {
    message.error(result.message)
  } else {
    message.success('发布成功')
  }
  return result
}
const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      sendSpeak()
    } else {
      message.error('请检查必填参数')
    }
  })
}

onMounted(() => {
  const setting = window.localStorage.getItem('speakOptions')
  const jsonSetting = JSON.parse(setting || '{}')
  if (jsonSetting.api) {
    settingFromModel.value.api = jsonSetting.api
  }
  if (jsonSetting.token) {
    settingFromModel.value.token = jsonSetting.token
  }
  if (jsonSetting.userId) {
    settingFromModel.value.userId = jsonSetting.userId
  }
})
debouncedWatch(
  settingFromModel.value,
  async (newVal, val) => {
    if (newVal.api && newVal.userId && tagOptions.value.length === 0) {
      const tagList = await getTagList(newVal.api, newVal.userId)
      if (tagList.length) {
        fromModel.value.tag = tagList[0]._id
        tagList.forEach((item) => {
          tagOptions.value.push({
            label: item.name,
            value: item._id
          })
        })
      }
    }
    const { api, token, userId } = settingFromModel.value
    localStorage.setItem('speakOptions', JSON.stringify({ api, token, userId }))
  },
  { debounce: 500 }
)
</script>

<style scoped></style>
