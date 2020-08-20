import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>フラスタメーカー(開発中)</h1>
        <div>{process.env.version}</div>
        <p className={styles.description}>
          ブラウザ上でエアフラスタつくろうぜ！
        </p>

        <div className={styles.grid}>
          <Link href="/edit">
            <div className={styles.card}>
              <h3>エディター &rarr;</h3>
              <p>フラスタ作れる！</p>
            </div>
          </Link>

          <a href="#!" className={styles.card}>
            <h3>展示スペース &rarr;</h3>
            <p>工事中 みんなが作ったフラスタが展示されとる！</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="http://www.sokontokoro-factory.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by そこんところ工房
        </a>
      </footer>
    </div>
  );
}
