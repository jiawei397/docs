module.exports = {
  title: '帝之下都',
  description: 'Just playing around',
  // theme: '@vuepress/blog'
  base: '/docs/',
  themeConfig: {
    nav: [
      {text: '主页', link: '/'},
      {text: '持续集成', link: '/cicd/'},
      {text: 'javascript', link: '/js/'}
      // {text: 'github', link: 'https://github.com/jiawei397'}
    ],
    lastUpdated: 'Last Updated', // string | boolean
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
  }
};
