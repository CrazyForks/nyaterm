import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: '快速开始',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: '使用指南',
      items: [
        'guide/ssh-connection',
        'guide/file-transfer',
        'guide/terminal',
        'guide/quick-commands',
        'guide/themes',
        'guide/translation',
        'guide/security',
        'guide/keyboard-shortcuts',
      ],
    },
    {
      type: 'category',
      label: '开发文档',
      items: [
        'development/architecture',
        'development/setup',
        'development/frontend',
        'development/backend',
        'development/contributing',
      ],
    },
    'faq',
  ],
};

export default sidebars;
