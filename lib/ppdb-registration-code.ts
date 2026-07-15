/**
 * Generates the formatted PPDB registration code.
 *
 * Format: {jenjang}-{YY}-{prov}-{kab}-{NPSN}-{batchId}-{noUrut}
 *
 * Example: 2-26-52-07-70056111-3-00001
 *   2         → kode jenjang (SD=1, SMP=2, SMA=3, SMK=4)
 *   26        → 2 digit terakhir tahun pendaftaran
 *   52        → kode BPS provinsi (NTB = 52)
 *   07        → kode BPS kabupaten (Lombok Timur = 07)
 *   70056111  → NPSN sekolah
 *   3         → ID gelombang pendaftaran (Batch)
 *   00001     → nomor urut siswa mendaftar (5 digit, zero-padded)
 */
export function generateKodePendaftaran(batchId: number, noUrut: number): string {
    const jenjang = process.env.SCHOOL_JENJANG_CODE ?? "2";
    const prov    = process.env.SCHOOL_PROV_CODE   ?? "52";
    const kab     = process.env.SCHOOL_KAB_CODE    ?? "07";
    const npsn    = process.env.NEXT_PUBLIC_SCHOOL_NPSN ?? "00000000";

    const now = new Date();
    // Tahun ajaran: pendaftaran SMP menggunakan tahun lulus SD = tahun sekarang
    const yy = String(now.getFullYear()).slice(-2);

    const noUrutPadded = String(noUrut).padStart(5, "0");

    return `${jenjang}-${yy}-${prov}-${kab}-${npsn}-${batchId}-${noUrutPadded}`;
}
