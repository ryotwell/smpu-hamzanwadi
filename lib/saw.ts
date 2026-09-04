// SAW (Simple Additive Weighting) — semua kriteria bersifat BENEFIT.
// 1. Bobot dinormalisasi (bobot / total bobot)
// 2. Nilai tiap kriteria dinormalisasi (nilai / nilai maksimum antar pendaftar)
// 3. Skor akhir = Σ (bobot ternormalisasi × nilai ternormalisasi), urut menurun.
// ponytail: bobot hardcoded sesuai ketentuan sekolah — buat tabel Criteria bila ingin diubah dari UI.

export const SAW_WEIGHTS = {
    testAkademik: 4,
    testBahasaInggris: 2,
    testKarakter: 2,
    rataRataRaport: 2,
} as const;

export const SAW_CRITERIA = ["testAkademik", "testBahasaInggris", "testKarakter", "rataRataRaport"] as const;
export type SawCriterion = (typeof SAW_CRITERIA)[number];

export type SawStudent = {
    id: string;
    fullName: string;
    kodePendaftaran: string;
} & Record<SawCriterion, number>;

export function calculateSaw<T extends SawStudent>(students: T[]) {
    const totalWeight = SAW_CRITERIA.reduce((acc, c) => acc + SAW_WEIGHTS[c], 0);

    const normalizedWeights = {
        testAkademik: SAW_WEIGHTS.testAkademik / totalWeight,
        testBahasaInggris: SAW_WEIGHTS.testBahasaInggris / totalWeight,
        testKarakter: SAW_WEIGHTS.testKarakter / totalWeight,
        rataRataRaport: SAW_WEIGHTS.rataRataRaport / totalWeight,
    };

    const maxima = {
        testAkademik: students.reduce((max, s) => Math.max(max, s.testAkademik), 0),
        testBahasaInggris: students.reduce((max, s) => Math.max(max, s.testBahasaInggris), 0),
        testKarakter: students.reduce((max, s) => Math.max(max, s.testKarakter), 0),
        rataRataRaport: students.reduce((max, s) => Math.max(max, s.rataRataRaport), 0),
    };

    const ranked = students
        .map((s) => {
            const normalized = {
                testAkademik: maxima.testAkademik ? s.testAkademik / maxima.testAkademik : 0,
                testBahasaInggris: maxima.testBahasaInggris ? s.testBahasaInggris / maxima.testBahasaInggris : 0,
                testKarakter: maxima.testKarakter ? s.testKarakter / maxima.testKarakter : 0,
                rataRataRaport: maxima.rataRataRaport ? s.rataRataRaport / maxima.rataRataRaport : 0,
            };
            const total =
                normalizedWeights.testAkademik * normalized.testAkademik +
                normalizedWeights.testBahasaInggris * normalized.testBahasaInggris +
                normalizedWeights.testKarakter * normalized.testKarakter +
                normalizedWeights.rataRataRaport * normalized.rataRataRaport;
            return { ...s, normalized, total };
        })
        .sort((a, b) => b.total - a.total)
        .map((s, i) => ({ ...s, rank: i + 1 }));

    return { ranked, normalizedWeights, maxima };
}
