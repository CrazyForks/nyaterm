import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

import styles from './index.module.css';

const features = [
  {
    title: <Translate>安全高效的 SSH 连接</Translate>,
    icon: '🔒',
    description: (
      <Translate>
        基于 Rust russh 库构建，提供安全、高性能的 SSH 连接。支持密码和密钥认证、代理转发、TOFU 主机密钥验证。
      </Translate>
    ),
  },
  {
    title: <Translate>集成 SFTP 文件管理</Translate>,
    icon: '📂',
    description: (
      <Translate>
        内置文件浏览器，直接在侧边栏管理远程文件。支持上传、下载、重命名、权限修改等操作，传输进度实时可见。
      </Translate>
    ),
  },
  {
    title: <Translate>多标签终端界面</Translate>,
    icon: '📑',
    description: (
      <Translate>
        同时管理多个 SSH 和本地终端会话。支持 WebGL 硬件加速渲染、自定义字体、关键词高亮、命令历史模糊搜索。
      </Translate>
    ),
  },
  {
    title: <Translate>高度可定制</Translate>,
    icon: '🎨',
    description: (
      <Translate>
        深色/浅色主题切换、可调整面板布局、快捷命令管理、多语言翻译、快捷键自定义，打造专属工作流。
      </Translate>
    ),
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          <Translate>现代高性能 SSH 客户端</Translate>
        </p>
        <p className={styles.heroDescription}>
          <Translate>
            基于 Tauri 和 React 构建，跨平台、安全、快速
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/installation">
            <Translate>快速开始</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            href="https://git.coderkang.top/Tauri/dragonfly"
            style={{marginLeft: '1rem'}}>
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, icon, description}: {title: React.ReactNode; icon: string; description: React.ReactNode}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center padding-horiz--md">
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({message: '首页'})}
      description={translate({message: '现代高性能 SSH 客户端，基于 Tauri 和 React 构建'})}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
