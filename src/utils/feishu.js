
import { generateState } from '@/utils/generate-stata'
import { saveToLocalStorage } from '@/utils/localStorage'
export function FeishuQrLogin(query) {
  // 如果是 OAuth2.0认证，则将 state 参数保存至本地，然后删除 URL 中的 state 参数，防止在进行飞书扫码时 state 参数重复
  if ('state' in query) {
    saveToLocalStorage('oauth_state', query.state)
    delete query.state
  }

  // 重新生成 URL Query 参数
  const searchParams = new URLSearchParams(query)

  // 指定回调地址，需要带上原本所有请求参数，并带上自定义参数："byte=true"，表示飞书扫码登录
  const redirect_uri = window.location.protocol + '//' + window.location.host + '/login?byte=true&' + searchParams.toString()

  // 生成随机state
  const state = generateState()
  // 将state存储到localStorage，防止回调时页面刷新导致state丢失
  saveToLocalStorage('feishu_state', state)

  // 组装二维码获取接口地址
  const goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${process.env.VUE_APP_FEISHU_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&state=${state}`

  // 请求生成二维码
  const QRLoginObj = window.QRLogin({
    id: 'feishu_login',
    goto: `${goto}`,
    style: 'width: 255px;height: 255px;border: none'
  })

  // 监听用户扫码事件
  const handleMessage = function(event) {
    // 使用matchOrigin和matchData方法来判断message和来自的页面url是否合法
    if (QRLoginObj.matchOrigin(event.origin) && QRLoginObj.matchData(event.data)) {
      // 获取临时授权码
      const loginTmpCode = event.data.tmp_code

      // 获取授权码，并跳转至redirect_uri（回调地址）
      window.location.href = `${goto}&tmp_code=${loginTmpCode}`
    }
  }

  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('message', handleMessage, false)
  } else if (typeof window.attachEvent !== 'undefined') {
    window.attachEvent('onmessage', handleMessage)
  }
}

