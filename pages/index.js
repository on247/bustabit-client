import { markAssetError } from 'next/dist/client/route-loader'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Staking Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
       
      <div className={styles.tabnav}>
        <div className={styles.tabactive}>
          Staking
        </div>
        <div className={styles.tab}>
          Treasury
        </div >
        <div className={styles.tab}>
          Governance
        </div >
        <div className={styles.tab}>
          Tokenomics
        </div>
        <div>

        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <a href="#">
            <div className={styles.marketbtn}>Buy $TOKEN now</div>
          </a>
          <a href="#">
            <div className={styles.marketbtn}>Buy $TOKEN now</div>
          </a>
        </div>
        <div className={styles.content}>
          <div className={styles.poolstats}>
            <div className={styles.poolstatsitem}>
              <div className={styles.poolstatsitemlabel}>
                Total CFNI Staked
              </div>
            </div>
            <div className={styles.poolstatsitem}>
            <div className={styles.poolstatsitemlabel}>
                CFNI Released Per Day
              </div>
            </div>
            <div className={styles.poolstatsitem}>
            <div className={styles.poolstatsitemlabel}>
                Current Pool APY
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.tokenstatcontainer}>
            <div className={styles.tokenstatlabel}>
               Circulating Supply
            </div>
            <div className={styles.tokenstatAmount}>
               10,000,000 TOKEN
            </div>
          </div>
          <div className={styles.tokenstatcontainer}>
            <div className={styles.tokenstatlabel}>
               Price
            </div>
            <div className={styles.tokenstatAmount}>
               $1.00 
            </div>
          </div>
          <div className={styles.tokenstatcontainer}>
            <div className={styles.tokenstatlabel}>
               Market cap
            </div>
            <div className={styles.tokenstatAmount}>
               $100,000,000.00
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by connect financial
        </a>
      </footer>
    </div>
  )
}
