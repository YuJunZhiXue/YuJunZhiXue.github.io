/**
 * 动漫封面：覆盖主题默认的 post 生成器，给动漫随机图 API 的封面 URL
 * 追加每篇文章唯一的 ?u= 参数。
 *
 * 原因：浏览器按 URL 缓存图片。若全站共用同一个 API 地址，
 * 每篇文章的封面会被缓存成同一张图（首页只剩 2~3 张图反复出现）。
 * 每篇文章用唯一 URL，每张卡片请求到的都是不同的随机动漫图。
 *
 * 注意：注册放在 after_init 里——Hexo 并发加载主题脚本和站点脚本，
 * 直接在顶层注册会被主题后加载的同名生成器覆盖；after_init 在所有
 * 脚本加载完成后才执行，此时注册必定生效。
 *
 * BUILD_SALT 每次 hexo generate 重新生成：每次部署后全站封面换一批新图；
 * 同一次构建内 URL 稳定，浏览器跨页面缓存正常工作。
 */

'use strict'

const crypto = require('crypto')

// 构建盐值：一次构建内稳定，重新构建则变化
const BUILD_SALT = Date.now().toString(36)

// 需要追加唯一参数的动漫随机图 API（与 _config.butterfly.yml 的 default_cover 对应）
const ANIME_API_RE = /(dmoe\.cc\/random\.php|t\.mwm\.moe\/pc|moe\.jitsu\.top\/img\/|api\.paugram\.com\/wallpaper)/i

function animeCover (url, postPath) {
  if (typeof url !== 'string' || !ANIME_API_RE.test(url)) return url
  const tag = crypto.createHash('md5').update(postPath + '|' + BUILD_SALT).digest('hex').slice(0, 10)
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}u=${tag}`
}

function registerAnimePostGenerator () {
  const hexo = this

  hexo.extend.generator.register('post', locals => {
  const imgTestReg = /\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i
  const remoteImgReg = /^(?:https?:)?\/\//i
  const dataImgReg = /^data:image\//i

  const { post_asset_folder: postAssetFolder } = hexo.config
  const { cover: { default_cover: defaultCover } } = hexo.theme.config

  const isImage = value => {
    return typeof value === 'string' &&
      (remoteImgReg.test(value) || dataImgReg.test(value) || imgTestReg.test(value))
  }

  function * createCoverGenerator () {
    if (!defaultCover || (Array.isArray(defaultCover) && defaultCover.length === 0)) {
      while (true) yield false
    }

    if (!Array.isArray(defaultCover)) {
      while (true) yield defaultCover
    }

    if (defaultCover.length === 1) {
      while (true) yield defaultCover[0]
    }

    const coverCount = defaultCover.length
    const maxHistory = Math.min(3, coverCount - 1)
    const history = []

    while (true) {
      let index

      do {
        index = Math.floor(Math.random() * coverCount)
      } while (history.includes(index))

      history.push(index)

      if (history.length > maxHistory) {
        history.shift()
      }

      yield defaultCover[index]
    }
  }

  const coverGenerator = createCoverGenerator()

  const resolvePostAsset = (value, postPath) => {
    if (
      !postAssetFolder ||
      typeof value !== 'string' ||
      value.includes('/') ||
      !imgTestReg.test(value)
    ) {
      return value
    }

    return `${postPath}${value}`
  }

  const handleImg = data => {
    data.top_img = resolvePostAsset(data.top_img, data.path)
    data.cover = resolvePostAsset(data.cover, data.path)
    data.pagination_cover = resolvePostAsset(data.pagination_cover, data.path)

    if (data.cover === false) return data

    if (!data.cover) {
      // 动漫 API 封面：追加文章唯一参数，避免浏览器缓存导致全站同图
      data.cover = animeCover(coverGenerator.next().value, data.path)
    }

    if (isImage(data.cover)) {
      data.cover_type = 'img'
    }

    return data
  }

  const posts = locals.posts.sort('date').toArray()
  const { length } = posts

  return posts.map((post, index) => {
    const data = post

    if (index > 0) {
      data.prev = posts[index - 1]
    }

    if (index < length - 1) {
      data.next = posts[index + 1]
    }

    data.__post = true

    return {
      data: handleImg(data),
      layout: 'post',
      path: data.path
    }
  })
  })
}

// after_init 在所有脚本（含主题脚本）加载完成后执行，
// 此时用同名 'post' 重新注册生成器，必定覆盖主题默认实现。
hexo.extend.filter.register('after_init', registerAnimePostGenerator)
