import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid({
  title: "React 日历应用",
  description: "基于 React、Zustand 和 React Query 的现代日历应用",
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "概述", link: "/overview" },
      { text: "快速开始", link: "/getting-started" },
      { text: "API 参考", link: "/api-reference" },
    ],
    sidebar: [
      {
        text: "介绍",
        items: [
          { text: "项目概述", link: "/overview" },
          { text: "快速开始", link: "/getting-started" },
        ],
      },
      {
        text: "架构设计",
        items: [
          { text: "技术架构", link: "/architecture" },
          { text: "功能特性", link: "/features" },
        ],
      },
      {
        text: "开发指南",
        items: [
          { text: "API 参考", link: "/api-reference" },
          { text: "开发指南", link: "/development" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/yourusername/calendar-app" },
    ],
    footer: {
      message: "基于 MIT 许可证发布",
      copyright: "版权所有 © 2023 日历应用项目",
    },
  },
  mermaid: {},
  base: "/my-client-template/"
});
