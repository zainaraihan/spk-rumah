import styles from './page.module.css'

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.tulisan}>
        <h1>SPK Pemilihan Rumah Terbaik</h1>
        <p>Sistem Penunjang Keputusan (SPK) menggunakan metode SAW untuk membantu anda menemukan rumah terbaik berdasarkan harga, luas, jarak, dan linkungan.</p>
        <div className={styles.creators}>
          <p>Muhamad Zain Araihan</p>
          <p>Rama Faqih Dwiyanto</p>
          <p>Firta Alamsyah</p>
        </div>
        <a href="/spk">Mulai Sekarang</a>
      </div>
      <div className={styles.image}>
        <img src="/images/rumah.jpg" alt="" />
      </div>
    </main>
  );
}