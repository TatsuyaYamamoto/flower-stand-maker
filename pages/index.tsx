import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
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
              <p>
                フラスタ作れる！...けど、保存はまだ出来ないからリロードとか気をつけて！
              </p>
            </div>
          </Link>

          <a href="#!" className={styles.card}>
            <h3>展示スペース &rarr;</h3>
            <p>
              <strong>工事中</strong> みんなが作ったフラスタが展示されとる！（展示できない）
            </p>
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
