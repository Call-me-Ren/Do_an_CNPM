export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ko' | 'ja';

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface Artifact {
  id: string;
  code: string;
  floorId: number;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  images: string[];
  mapCoordinates: {
    x: number;
    y: number;
  };
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  };
  audio: Partial<Record<SupportedLanguage, string>>;
  subtitles?: Partial<Record<SupportedLanguage, SubtitleCue[]>>;
  createdAt?: number;
}

export interface Floor {
  id: number;
  name: Record<SupportedLanguage, string>;
  mapImage: string;
  bounds: {
    width: number;
    height: number;
  };
}

export interface MuseumInfo {
  name: Record<SupportedLanguage, string>;
  address: Record<SupportedLanguage, string>;
  openHours: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  hotline: string;
  banner: string;
}

export interface MuseumData {
  museum: MuseumInfo;
  floors: Floor[];
  artifacts: Artifact[];
}
