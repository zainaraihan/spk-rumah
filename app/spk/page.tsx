"use client";

import { useState } from "react";
import styles from "./spk.module.css";

interface House {
    id: number;
    nama: string;
    harga: number;
    luas: number;
    jarak: number;
    lingkungan: number;
}

export default function SPKPage() {
    const [houses, setHouses] = useState<House[]>([]);
    const [form, setForm] = useState({
        nama: "",
        harga: "",
        luas: "",
        jarak: "",
        lingkungan: "3",
    });
    const [results, setResult] = useState<any[]>([]);

    const handleAdd = () => {
        if (!form.nama || !form.harga || !form.luas || !form.jarak) return;

        const newHouse: House = {
            id: Date.now(),
            nama: form.nama,
            harga: Number(form.harga),
            luas: Number(form.luas),
            jarak: Number(form.jarak),
            lingkungan: Number(form.lingkungan),
        };

        setHouses([...houses, newHouse]);
        setForm({ nama: "", harga: "", luas: "", jarak: "", lingkungan: "3" });
        setResult([]);
    };

    const handleDelete = (id: number) => {
        setHouses(houses.filter((h) => h.id !== id));
        setResult([]);
    };

    const handleCalculate = () => {
        if (houses.length < 2) {
            alert("Minimal masukan 2 rumah untuk perbandingan");
            return;
        }

        const criteria = [
            { key: "harga", weight: 0.3, type: "cost" },
            { key: "luas", weight: 0.25, type: "benefit" },
            { key: "jarak", weight: 0.35, type: "cost" },
            { key: "lingkungan", weight: 0.2, type: "benefit" },
        ];

        const normalized = houses.map((h) => {
            const n: any = { nama: h.nama };
            criteria.forEach((c) => {
                const values = houses.map((x) => x[c.key as keyof House]) as number[];
                const max = Math.max(...values);
                const min = Math.min(...values);

                const value = h[c.key as keyof House] as number;
                n[c.key] = c.type === "benefit" ? value / max : min / value;
            });
            return n;
        });

        const scores = normalized.map((n) => {
            let total = 0;
            criteria.forEach((c) => {
                total += n[c.key] * c.weight;
            });
            return { nama: n.nama, nilai: total };
        });

        scores.sort((a, b) => b.nilai - a.nilai);
        setResult(scores);
    };

    const handleReset = () => {
        setHouses([]);
        setResult([]);
    };

    return (
        <main className={styles.main}>
            <div className={styles.titleContainer}>
                <h1 className={`${styles.title} ${styles.runningText}`}>SPK Pemilihan Rumah (Metode SAW)</h1>
            </div>

            <section className={styles.formSection}>
                <h3>Tambah Data Rumah</h3>
                <div className={styles.form}>
                    <input
                        placeholder="Nama Rumah"
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    />
                    <input
                        placeholder="Harga Rumah (juta)"
                        type="number"
                        value={form.harga}
                        onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    />
                    <input
                        placeholder="Luas Tanah (m²)"
                        type="number"
                        value={form.luas}
                        onChange={(e) => setForm({ ...form, luas: e.target.value })}
                    />
                    <input
                        placeholder="Jarak ke Kantor (km)"
                        type="number"
                        value={form.jarak}
                        onChange={(e) => setForm({ ...form, jarak: e.target.value })}
                    />
                    <select
                        value={form.lingkungan}
                        onChange={(e) => setForm({ ...form, lingkungan: e.target.value })}
                    >
                        <option value="5">Sangat Baik</option>
                        <option value="4">Baik</option>
                        <option value="3">Cukup</option>
                        <option value="2">Kurang</option>
                        <option value="1">Buruk</option>
                    </select>

                    <button onClick={handleAdd} className={styles.button}>
                        Tambah Rumah
                    </button>
                </div>
            </section>

            {houses.length > 0 && (
                <section className={styles.tableWrapper}>
                    <h3>Daftar Rumah</h3>
                    <table border={1} cellPadding={8} className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Rumah</th>
                                <th>Harga</th>
                                <th>Luas</th>
                                <th>Jarak</th>
                                <th>Lingkungan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {houses.map((h, i) => (
                                <tr key={h.id}>
                                    <td>{i + 1}</td>
                                    <td>{h.nama}</td>
                                    <td>{h.harga}</td>
                                    <td>{h.luas}</td>
                                    <td>{h.jarak}</td>
                                    <td>
                                        {["Buruk", "Kurang", "Cukup", "Baik", "Sangat Baik"][
                                            h.lingkungan - 1
                                        ]}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(h.id)}
                                            className={styles.actionButton}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.buttons}>
                        <button onClick={handleCalculate} className={styles.buttonGreen}>
                            Hitung
                        </button>
                        <button onClick={handleReset} className={styles.buttonGray}>
                            R
                        </button>
                    </div>
                </section>
            )}

            {results.length > 0 && (
                <section className={styles.resultSection}>
                    <h3>Hasil Perhitungan SAW</h3>
                    <table border={1} cellPadding={8} className={styles.resultTable}>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Nama Rumah</th>
                                <th>Nilai Preferensi</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={r.nama}>
                                    <td>{i + 1}</td>
                                    <td>{r.nama}</td>
                                    <td>{r.nilai.toFixed(4)}</td>
                                    <td>{i === 0 ? "⭐ Rekomendasi Terbaik" : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p>
                        <strong>{results[0].nama}</strong> direkomendasikan sebagai rumah
                        terbaik berdasarkan harga, luas, jarak, dan lingkungan.
                    </p>
                </section>
            )}
        </main>
    );
}
