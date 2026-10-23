export type ElementTier = 0 | 1 | 2 | 3 | 4;

export interface AlchemyElement {
  id: string;
  name: string;
  emoji: string;
  tier: ElementTier;
  category: string;
  description: string;
}

export interface AlchemyRecipe {
  id: string;
  a: string;
  b: string;
  result: string;
}

export const TIER_LABELS: Record<ElementTier, { name: string; shortName: string; badgeClass: string }> = {
  0: {
    name: 'Tier 0 · Primordial',
    shortName: 'Primordial',
    badgeClass: 'text-sky-300',
  },
  1: {
    name: 'Tier 1 · Fenomena Alam',
    shortName: 'Fenomena Alam',
    badgeClass: 'text-teal-300',
  },
  2: {
    name: 'Tier 2 · Mineral & Material',
    shortName: 'Material',
    badgeClass: 'text-amber-300',
  },
  3: {
    name: 'Tier 3 · Mekanik & Listrik',
    shortName: 'Mekanik & Listrik',
    badgeClass: 'text-cyan-300',
  },
  4: {
    name: 'Tier 4 · Teknologi Canggih',
    shortName: 'Teknologi Tinggi',
    badgeClass: 'text-emerald-300',
  },
};

export const INITIAL_UNLOCKED_IDS = ['air', 'api', 'tanah', 'udara'];

export const ELEMENTS: AlchemyElement[] = [
  // TIER 0: PRIMORDIAL (4)
  {
    id: 'air',
    name: 'Air',
    emoji: '💧',
    tier: 0,
    category: 'Primordial',
    description: 'Senyawa kimia cair anorganik (H₂O) pelarut universal dan pembentuk hidrosfer.',
  },
  {
    id: 'api',
    name: 'Api',
    emoji: '🔥',
    tier: 0,
    category: 'Primordial',
    description: 'Reaksi oksidasi eksotermik cepat yang memancarkan panas dan radiasi cahaya.',
  },
  {
    id: 'tanah',
    name: 'Tanah',
    emoji: '🟫',
    tier: 0,
    category: 'Primordial',
    description: 'Endapan mineral silikat dan oksida anorganik pembentuk kerak benua.',
  },
  {
    id: 'udara',
    name: 'Udara',
    emoji: '💨',
    tier: 0,
    category: 'Primordial',
    description: 'Campuran gas nitrogen, oksigen, dan argon yang menyelimuti atmosfer.',
  },

  // TIER 1: FENOMENA ALAM & GEOLOGI DASAR (12)
  {
    id: 'uap',
    name: 'Uap',
    emoji: '♨️',
    tier: 1,
    category: 'Fenomena Alam',
    description: 'Fase gas dari air akibat pemanasan termal di atas titik didih.',
  },
  {
    id: 'lumpur',
    name: 'Lumpur',
    emoji: '🟤',
    tier: 1,
    category: 'Geologi',
    description: 'Suspensi kental partikel mineral lempung dan lanau di dalam air.',
  },
  {
    id: 'lava',
    name: 'Lava',
    emoji: '🌋',
    tier: 1,
    category: 'Geologi',
    description: 'Batuan silikat cair pijar yang meleleh pada suhu ekstrem.',
  },
  {
    id: 'debu',
    name: 'Debu',
    emoji: '🌫️',
    tier: 1,
    category: 'Fenomena Alam',
    description: 'Partikel mineral mikroskopis yang tersuspensi di aliran udara.',
  },
  {
    id: 'energi',
    name: 'Energi',
    emoji: '⚡',
    tier: 1,
    category: 'Fisika Murni',
    description: 'Kapasitas fundamental sistem fisik untuk melakukan usaha termodinamika.',
  },
  {
    id: 'lautan',
    name: 'Lautan',
    emoji: '🌊',
    tier: 1,
    category: 'Fenomena Alam',
    description: 'Massa air asin raksasa yang mengisi cekungan litosfer planet.',
  },
  {
    id: 'tekanan',
    name: 'Tekanan',
    emoji: '🗜️',
    tier: 1,
    category: 'Fisika Murni',
    description: 'Gaya mekanik kompresi yang bekerja tegak lurus per satuan luas permukaan.',
  },
  {
    id: 'awan',
    name: 'Awan',
    emoji: '☁️',
    tier: 1,
    category: 'Fenomena Alam',
    description: 'Kumpulan tetesan uap air terkondensasi di lapisan troposfer.',
  },
  {
    id: 'hujan',
    name: 'Hujan',
    emoji: '🌧️',
    tier: 1,
    category: 'Fenomena Alam',
    description: 'Presipitasi tetesan air cair dari awan menuju permukaan akibat gravitasi.',
  },
  {
    id: 'batu',
    name: 'Batu',
    emoji: '🪨',
    tier: 1,
    category: 'Geologi',
    description: 'Agregat mineral padat yang terbentuk dari pembekuan lava pijar.',
  },
  {
    id: 'gempa',
    name: 'Gempa',
    emoji: '🫨',
    tier: 1,
    category: 'Geologi',
    description: 'Getaran gelombang seismik akibat pelepasan energi di kerak batuan.',
  },
  {
    id: 'angin_topan',
    name: 'Angin Topan',
    emoji: '🌪️',
    tier: 1,
    category: 'Fenomena Alam',
    description: 'Pusaran kolom udara berkecepatan tinggi dengan gradien tekanan ekstrem.',
  },

  // TIER 2: MINERAL, LOGAM & MATERIAL KONSTRUKSI (12)
  {
    id: 'pasir',
    name: 'Pasir',
    emoji: '⏳',
    tier: 2,
    category: 'Mineral',
    description: 'Butiran halus silikon dioksida hasil pelapukan mekanik batuan.',
  },
  {
    id: 'batu_bata',
    name: 'Batu Bata',
    emoji: '🧱',
    tier: 2,
    category: 'Material',
    description: 'Blok struktural padat hasil pembakaran mineral lempung suhu tinggi.',
  },
  {
    id: 'keramik',
    name: 'Keramik',
    emoji: '🏺',
    tier: 2,
    category: 'Material',
    description: 'Material anorganik isolator tahan panas hasil vitrifikasi mineral.',
  },
  {
    id: 'kaca',
    name: 'Kaca',
    emoji: '🪟',
    tier: 2,
    category: 'Material',
    description: 'Padatan amorf transparan hasil peleburan pasir silika murni.',
  },
  {
    id: 'garam',
    name: 'Garam Mineral',
    emoji: '🧂',
    tier: 2,
    category: 'Mineral',
    description: 'Kristal ionik natrium klorida hasil evaporasi air lautan.',
  },
  {
    id: 'bijih_logam',
    name: 'Bijih Logam',
    emoji: '⛏️',
    tier: 2,
    category: 'Mineral',
    description: 'Endapan batuan mineral yang kaya akan unsur logam konduktif.',
  },
  {
    id: 'logam',
    name: 'Logam',
    emoji: '🔩',
    tier: 2,
    category: 'Material',
    description: 'Material konduktor padat hasil peleburan dan pemurnian bijih mineral.',
  },
  {
    id: 'karbon',
    name: 'Karbon Murni',
    emoji: '🖤',
    tier: 2,
    category: 'Mineral',
    description: 'Unsur non-logam tetravalen berbentuk grafit atau kisi kristal padat.',
  },
  {
    id: 'baja',
    name: 'Baja',
    emoji: '🛡️',
    tier: 2,
    category: 'Material',
    description: 'Paduan logam besi dan karbon dengan kekuatan tarik sangat tinggi.',
  },
  {
    id: 'kristal_kuarsa',
    name: 'Kristal Kuarsa',
    emoji: '💎',
    tier: 2,
    category: 'Mineral',
    description: 'Mineral silika berkisi heksagonal dengan sifat piezoelektrik presisi.',
  },
  {
    id: 'magnet',
    name: 'Magnet',
    emoji: '🧲',
    tier: 2,
    category: 'Material',
    description: 'Logam feromagnetik dengan domain spin elektron sejajar penghasil medan magnet.',
  },
  {
    id: 'kawat_tembaga',
    name: 'Kawat Tembaga',
    emoji: '➰',
    tier: 2,
    category: 'Material',
    description: 'Untaian logam konduktor fleksibel untuk transmisi arus listrik.',
  },

  // TIER 3: MESIN MEKANIK, OPTIK & KELISTRIKAN (11)
  {
    id: 'listrik',
    name: 'Listrik',
    emoji: '🌩️',
    tier: 3,
    category: 'Kelistrikan',
    description: 'Aliran muatan elektron melintasi medium konduktor logam.',
  },
  {
    id: 'baterai',
    name: 'Baterai',
    emoji: '🔋',
    tier: 3,
    category: 'Kelistrikan',
    description: 'Sel elektrokimia penyimpan energi potensial menjadi arus listrik searah.',
  },
  {
    id: 'mesin_uap',
    name: 'Mesin Uap',
    emoji: '🚂',
    tier: 3,
    category: 'Mekanik',
    description: 'Mesin pembakaran luar yang mengubah ekspansi tekanan uap menjadi gerak mekanis.',
  },
  {
    id: 'roda_gigi',
    name: 'Roda Gigi',
    emoji: '⚙️',
    tier: 3,
    category: 'Mekanik',
    description: 'Komponen mesin bergerigi untuk mentransmisikan torsi dan kecepatan putar.',
  },
  {
    id: 'dinamo',
    name: 'Dinamo Generator',
    emoji: '🔄',
    tier: 3,
    category: 'Kelistrikan',
    description: 'Generator elektromagnetik pengubah rotasi mekanik menjadi energi listrik.',
  },
  {
    id: 'bohlam',
    name: 'Bohlam Lampu',
    emoji: '💡',
    tier: 3,
    category: 'Optik & Listrik',
    description: 'Tabung kaca kedap udara yang memancarkan foton cahaya saat dialiri listrik.',
  },
  {
    id: 'lensa',
    name: 'Lensa Optik',
    emoji: '🔎',
    tier: 3,
    category: 'Optik & Listrik',
    description: 'Elemen kaca lengkung presisi untuk membiaskan dan memfokuskan berkas cahaya.',
  },
  {
    id: 'sirkuit',
    name: 'Sirkuit Elektronik',
    emoji: '📟',
    tier: 3,
    category: 'Kelistrikan',
    description: 'Jalur konduktor terpadu untuk mengatur logika tegangan dan arus listrik.',
  },
  {
    id: 'gelombang_radio',
    name: 'Gelombang Radio',
    emoji: '📡',
    tier: 3,
    category: 'Fisika & Sinyal',
    description: 'Radiasi elektromagnetik frekuensi rendah pembawa sinyal informasi nirkabel.',
  },
  {
    id: 'panel_surya',
    name: 'Panel Surya',
    emoji: '☀️',
    tier: 3,
    category: 'Kelistrikan',
    description: 'Modul sel fotovoltaik pengubah radiasi foton langsung menjadi energi listrik.',
  },
  {
    id: 'laser',
    name: 'Sinar Laser',
    emoji: '🔴',
    tier: 3,
    category: 'Optik & Listrik',
    description: 'Pancaran gelombang cahaya monokromatik koheren berintensitas tinggi.',
  },

  // TIER 4: TEKNOLOGI CANGGIH & EKSPLORASI ANTARIKSA (11)
  {
    id: 'mikroprosesor',
    name: 'Mikroprosesor',
    emoji: '🎛️',
    tier: 4,
    category: 'Komputasi',
    description: 'Unit pemrosesan logika silikon mikroskopis dengan jutaan gerbang transistor.',
  },
  {
    id: 'layar_optik',
    name: 'Layar Monitor',
    emoji: '🖥️',
    tier: 4,
    category: 'Komputasi',
    description: 'Panel matriks piksel elektronik untuk memvisualisasikan data digital.',
  },
  {
    id: 'komputer',
    name: 'Komputer',
    emoji: '💻',
    tier: 4,
    category: 'Komputasi',
    description: 'Mesin komputasi digital yang memproses instruksi algoritma secara otomatis.',
  },
  {
    id: 'serat_optik',
    name: 'Serat Optik',
    emoji: '🌐',
    tier: 4,
    category: 'Telekomunikasi',
    description: 'Saluran pandu gelombang kaca murni pengirim data lewat pulsa sinar laser.',
  },
  {
    id: 'internet',
    name: 'Jaringan Internet',
    emoji: '🕸️',
    tier: 4,
    category: 'Telekomunikasi',
    description: 'Sistem jaringan komputer global yang saling terhubung melalui protokol paket data.',
  },
  {
    id: 'radar',
    name: 'Sistem Radar',
    emoji: '🧭',
    tier: 4,
    category: 'Navigasi',
    description: 'Pendeteksi jarak dan kecepatan objek menggunakan pantulan gelombang radio.',
  },
  {
    id: 'mesin_jet',
    name: 'Mesin Jet',
    emoji: '✈️',
    tier: 4,
    category: 'Dirgantara',
    description: 'Mesin turbin gas berkecepatan tinggi penghasil gaya dorong termodinamika.',
  },
  {
    id: 'roket',
    name: 'Roket Antariksa',
    emoji: '🚀',
    tier: 4,
    category: 'Dirgantara',
    description: 'Wahana peluncur propulsi reaksi kimia untuk menembus gravitasi atmosfer.',
  },
  {
    id: 'satelit',
    name: 'Satelit Orbit',
    emoji: '🛰️',
    tier: 4,
    category: 'Dirgantara',
    description: 'Stasiun relai komunikasi dan telemetri otomatis yang mengorbit di luar angkasa.',
  },
  {
    id: 'reaktor_fusi',
    name: 'Reaktor Nuklir',
    emoji: '⚛️',
    tier: 4,
    category: 'Energi Tinggi',
    description: 'Instalasi pembangkit daya masif berbasis reaksi inti atom terkendali.',
  },
  {
    id: 'komputer_kuantum',
    name: 'Komputer Kuantum',
    emoji: '💠',
    tier: 4,
    category: 'Puncak Teknologi',
    description: 'Mesin superkomputasi berbasis superposisi dan keterkaitan mekanika kuantum.',
  },
];

// 64 Resep Kombinasi Berjenjang (100% Benda Mati & Teknologi)
const RAW_RECIPES: Array<[string, string, string]> = [
  // Tier 1 Recipes
  ['air', 'api', 'uap'],
  ['air', 'tanah', 'lumpur'],
  ['api', 'tanah', 'lava'],
  ['tanah', 'udara', 'debu'],
  ['api', 'udara', 'energi'],
  ['air', 'air', 'lautan'],
  ['tanah', 'tanah', 'tekanan'],
  ['udara', 'udara', 'tekanan'],
  ['udara', 'uap', 'awan'],
  ['awan', 'air', 'hujan'],
  ['awan', 'awan', 'hujan'],
  ['lava', 'air', 'batu'],
  ['lava', 'udara', 'batu'],
  ['tanah', 'energi', 'gempa'],
  ['batu', 'tekanan', 'gempa'],
  ['udara', 'energi', 'angin_topan'],
  ['awan', 'energi', 'angin_topan'],

  // Tier 2 Recipes
  ['batu', 'udara', 'pasir'],
  ['batu', 'air', 'pasir'],
  ['batu', 'angin_topan', 'pasir'],
  ['lumpur', 'api', 'batu_bata'],
  ['tanah', 'batu_bata', 'keramik'],
  ['lumpur', 'batu_bata', 'keramik'],
  ['pasir', 'api', 'kaca'],
  ['lautan', 'api', 'garam'],
  ['lautan', 'udara', 'garam'],
  ['batu', 'api', 'bijih_logam'],
  ['batu', 'gempa', 'bijih_logam'],
  ['bijih_logam', 'api', 'logam'],
  ['bijih_logam', 'lava', 'logam'],
  ['debu', 'api', 'karbon'],
  ['debu', 'tekanan', 'karbon'],
  ['logam', 'karbon', 'baja'],
  ['logam', 'api', 'baja'],
  ['pasir', 'tekanan', 'kristal_kuarsa'],
  ['kaca', 'tekanan', 'kristal_kuarsa'],
  ['bijih_logam', 'energi', 'magnet'],
  ['logam', 'energi', 'magnet'],
  ['logam', 'tekanan', 'kawat_tembaga'],

  // Tier 3 Recipes
  ['energi', 'logam', 'listrik'],
  ['kawat_tembaga', 'magnet', 'listrik'],
  ['kawat_tembaga', 'energi', 'listrik'],
  ['listrik', 'garam', 'baterai'],
  ['listrik', 'karbon', 'baterai'],
  ['uap', 'logam', 'mesin_uap'],
  ['uap', 'baja', 'mesin_uap'],
  ['logam', 'logam', 'roda_gigi'],
  ['baja', 'roda_gigi', 'mesin_uap'],
  ['magnet', 'roda_gigi', 'dinamo'],
  ['dinamo', 'energi', 'listrik'],
  ['listrik', 'kaca', 'bohlam'],
  ['kaca', 'kaca', 'lensa'],
  ['kawat_tembaga', 'listrik', 'sirkuit'],
  ['kristal_kuarsa', 'listrik', 'sirkuit'],
  ['listrik', 'udara', 'gelombang_radio'],
  ['sirkuit', 'udara', 'gelombang_radio'],
  ['kaca', 'sirkuit', 'panel_surya'],
  ['kristal_kuarsa', 'energi', 'panel_surya'],
  ['bohlam', 'lensa', 'laser'],
  ['bohlam', 'kristal_kuarsa', 'laser'],

  // Tier 4 Recipes
  ['sirkuit', 'kristal_kuarsa', 'mikroprosesor'],
  ['sirkuit', 'laser', 'mikroprosesor'],
  ['sirkuit', 'sirkuit', 'mikroprosesor'],
  ['bohlam', 'sirkuit', 'layar_optik'],
  ['lensa', 'sirkuit', 'layar_optik'],
  ['mikroprosesor', 'layar_optik', 'komputer'],
  ['mikroprosesor', 'baterai', 'komputer'],
  ['kaca', 'laser', 'serat_optik'],
  ['kawat_tembaga', 'laser', 'serat_optik'],
  ['komputer', 'komputer', 'internet'],
  ['komputer', 'serat_optik', 'internet'],
  ['komputer', 'gelombang_radio', 'internet'],
  ['gelombang_radio', 'layar_optik', 'radar'],
  ['gelombang_radio', 'komputer', 'radar'],
  ['mesin_uap', 'udara', 'mesin_jet'],
  ['baja', 'angin_topan', 'mesin_jet'],
  ['mesin_jet', 'baja', 'roket'],
  ['mesin_jet', 'energi', 'roket'],
  ['roket', 'panel_surya', 'satelit'],
  ['roket', 'komputer', 'satelit'],
  ['roket', 'gelombang_radio', 'satelit'],
  ['energi', 'baja', 'reaktor_fusi'],
  ['listrik', 'tekanan', 'reaktor_fusi'],
  ['reaktor_fusi', 'dinamo', 'listrik'],
  ['komputer', 'reaktor_fusi', 'komputer_kuantum'],
  ['mikroprosesor', 'reaktor_fusi', 'komputer_kuantum'],
  ['komputer', 'laser', 'komputer_kuantum'],
];

export function normalizeRecipeKey(a: string, b: string): string {
  return [a, b].sort().join('+');
}

export const RECIPES: AlchemyRecipe[] = RAW_RECIPES.map(([a, b, result]) => ({
  id: `${normalizeRecipeKey(a, b)}=${result}`,
  a,
  b,
  result,
}));

export const ELEMENT_MAP: Record<string, AlchemyElement> = Object.fromEntries(
  ELEMENTS.map((el) => [el.id, el])
);

export function findRecipeResult(a: string, b: string): AlchemyRecipe | null {
  const key = normalizeRecipeKey(a, b);
  return RECIPES.find((r) => normalizeRecipeKey(r.a, r.b) === key) || null;
}
