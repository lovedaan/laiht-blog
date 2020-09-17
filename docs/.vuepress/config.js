console.log()
module.exports = {
  title: 'laiht的博客网站',
  description: 'laiht的网站,专注前端技术栈分享',
  base: '/static',
  dest: './static',
  themeConfig: {
    sidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      { text: '前端面试', items: [
        {
          text: '手写call和apply和bind',
          link: '/interview/interview1/'
        },
        {
          text: '手写防抖和节流',
          link: '/interview/interview2/'
        },
        {
          text: '手写深拷贝和浅拷贝',
          link: '/interview/interview3/'
        },
        {
          text: 'es6',
          link: '/interview/es6/'
        }
      ] },
      // { text: '小程序', link: '/wechat/' },
      { text: 'vue', link: '/vue/' },
      { text: 'react', link: '/react/' },
      { text: 'node',
      items: [
        {
          text: 'promise',
          link: '/node/promise/'
        },
        {
          text: '事件循环',
          link: '/node/eventloop/'
        },
        {
          text: 'node',
          link: '/node/node/'
        }
      ]
    },
      { text: 'webpack', link: '/webpack/' },
      { text: '关于', link: '/about/' },
    ]
  }
}