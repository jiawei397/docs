module.exports = {
  title: '帝之下都',
  description: 'Just playing around',
  // theme: '@vuepress/blog'
  base: '/docs/',
  themeConfig: {
    nav: [
      {text: '主页', link: '/'},
      {text: '持续集成', link: '/cicd/'},
      {text: 'js', link: '/js/'},
      {text: 'github', link: 'https://github.com/jiawei397'}
    ],
    sidebar: 'auto'
  },
  markdown: {
    toc: {includeLevel: [2, 3]}
  }
};
