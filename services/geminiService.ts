import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyContent } from "../types";

// Declare process for TS since @types/node might not be present
declare const process: {
  env: {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
};

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const dailyContentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    surahName: { type: Type.STRING, description: "Nama Surah di Juz Amma (misal: An-Naba)" },
    surahRef: { type: Type.INTEGER, description: "Nomor urut Surah dalam Al-Quran (misal: 78)" },
    ayahRef: { type: Type.INTEGER, description: "Nomor ayat spesifik (angka saja, misal: 10)" },
    ayahNumber: { type: Type.STRING, description: "Tampilan nomor ayat (misal: '10' atau '10-11')" },
    arabicText: { type: Type.STRING, description: "Teks Arab dari ayat tersebut (lengkap dengan harakat)" },
    translation: { type: Type.STRING, description: "Terjemahan Bahasa Indonesia mengacu pada Kemenag" },
    hikmah: { type: Type.STRING, description: "Hikmah mendalam dari ayat tersebut (1-3 paragraf pendek)" },
    praktik: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "2-4 langkah konkret/amalan yang bisa dilakukan hari ini (List)" 
    },
    hadithText: { type: Type.STRING, description: "Terjemahan hadits sahih yang berkaitan" },
    hadithSource: { type: Type.STRING, description: "Perawi Hadits (misal: HR. Muslim)" },
    reflectionQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 pertanyaan singkat untuk refleksi diri/journaling"
    }
  },
  required: ["surahName", "surahRef", "ayahRef", "ayahNumber", "arabicText", "translation", "hikmah", "praktik", "hadithText", "hadithSource", "reflectionQuestions"],
};

export const fetchDailyTadabbur = async (day: number): Promise<DailyContent> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Buatkan konten Tadabbur Al-Quran untuk Hari ke-${day} dari program 99 Hari Tadabbur Juz Amma.
      
      Struktur Konten:
      1. **Ayat Hari Ini**: Pilih SATU ayat (atau potongan pendek) yang sangat bermakna dari Juz Amma (Surah 78-114). 
      2. **Detail Referensi**: Pastikan mengisi 'surahRef' (nomor surat 1-114) dan 'ayahRef' (nomor ayat) dengan integer yang benar agar audio player berfungsi.
      3. **Terjemahan**: Gunakan terjemahan baku (gaya Kemenag) yang akurat.
      4. **Hikmah Tadabbur**: 1-3 paragraf pendek ringkasan tafsir/makna yang menyentuh hati.
      5. **Praktik Ayat**: 2-4 langkah aksi konkret (checklist) untuk diamalkan hari ini (misal: sedekah, minta maaf, dzikir khusus).
      6. **Hadis Pendukung**: Satu hadis sahih yang relevan dengan tema/amalan.
      7. **Refleksi Mini**: 2-3 pertanyaan introspektif untuk user jawab di jurnal mereka.
      
      Pastikan output adalah JSON valid sesuai skema. Nada bahasa: mengajak, lembut, dan inspiratif.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dailyContentSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as Omit<DailyContent, 'day'>;
    
    return {
      day,
      ...data
    };
  } catch (error) {
    console.error("Error generating tadabbur content:", error);
    throw error;
  }
};