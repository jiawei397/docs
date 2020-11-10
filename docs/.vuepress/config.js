module.exports = {
  title: '帝之下都',
  // description: 'Just playing around',
  // theme: '@vuepress/blog'
  base: '/docs/',
  themeConfig: {
    nav: [
      {text: '主页', link: '/'},
      {
        text: '技术',
        link: '/note/',
        items: [
          {text: 'js基础', link: '/note/js/'},
          {text: 'go', link: '/note/go/'},
          {text: 'web', link: '/note/web/'},
          {text: 'vue', link: '/note/vue/'},
          {text: 'linux', link: '/note/linux/'},
          {text: 'docker', link: '/note/docker/'},
          {text: '持续集成', link: '/note/cicd/'},
        ]
      },
      // {
      //   text: '杂谈',
      //   link: '/book/'
      //   // items: [
      //   //   {text: '持续集成', link: '/cicd/'},
      //   //   {text: 'javascript', link: '/js/'}
      //   // ]
      // }
      // {
      //   text: '脑图',
      //   items: [
      //     {text: 'vue', link: 'http://naotu.baidu.com/file/09500ab029b37dbb7950a133dd8207bc?token=a1de848dbcc5da92'},
      //     {text: 'javascript', link: 'http://naotu.baidu.com/file/7647e94435e4880c44ed60f16d606dfb?token=bba7e9031da01faf'},
      //     {text: 'nodejs', link: 'http://naotu.baidu.com/file/8e096a361142f09e0ccf17f2f73183ca?token=3f88fcffd2c108cb'},
      //     {text: '浏览器', link: 'https://naotu.baidu.com/file/fc3e83a72cd680a5b3772af37f246a27'},
      //     {text: '设计模式', link: 'http://naotu.baidu.com/file/9951017cce48061ba18ccf35419e4e09?token=03e48859e599fa3a'},
      //   ]
      // }
    ],
    // lastUpdated: 'Last Updated', // string | boolean
    sidebar: 'auto',
    smoothScroll: true,

    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'jiawei397/docs',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: '查看源码',

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: 'vuejs/vuepress',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '提出宝贵意见'
  },
  markdown: {
    toc: {includeLevel: [2, 3]}
    // lineNumbers: true
  },
  plugins: ['@vuepress/back-to-top'],
  head: [
    ['link', {rel: 'shortcut icon', href: '/images/favicon.ico'}]
  ]
};
