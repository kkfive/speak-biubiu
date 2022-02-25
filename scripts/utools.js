const axios = require('axios')
const api = 'https://kkapi-dev.vercel.app/api'
const token = '123'
const userId = '61fe93508fd621d39a155725'

const params = {
  token,
  userId,
  content: `{{subinput}}`
}
const tagList = []
const typeList = [
  { title: '公开显示', description: '0' },
  { title: '登录显示', description: '1' },
  { title: '仅自己显示', description: '2' }
]
const showCommentList = [
  { title: '允许评论', description: '1' },
  { title: '不允许评论', description: '0' }
]
async function main() {
  const list = await getTagList()
  if (list.code === 0) {
    list.data.forEach((tag) => {
      tagList.push({
        title: tag.name,
        description: tag._id
      })
    })
  } else {
    quickcommand.showMessageBox('获取标签失败', 'fail')
  }
  const tag = await userSelect(tagList)
  const type = await userSelect(typeList)
  const showComment = await userSelect(showCommentList)
  const sendResult = await sendBiuBiu({ tag, type, ...params })
  if (sendResult.code === 0) {
    quickcommand.showMessageBox('发送成功')
  } else {
    console.log(sendResult)
    quickcommand.showMessageBox(sendResult.message, 'fail')
  }
}

function userSelect(optionsList) {
  return new Promise((resolve) => {
    quickcommand
      .showSelectList(optionsList, { optionType: 'json' })
      .then((choise) => {
        resolve(choise.description)
      })
  })
}

function getTagList() {
  return new Promise((resolve, reject) => {
    axios
      .get(api + '/ispeak/tag/list', {
        params: {
          userId
        }
      })
      .then((result) => {
        resolve(result.data)
      })
      .catch((e) => {
        reject()
      })
  })
}

async function sendBiuBiu(obj) {
  const { data } = await axios.post(api + '/ispeak/addByToken', obj)
  return data
}

// quickcommand.showMessageBox('success')
main()
