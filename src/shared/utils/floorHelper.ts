/**
 * Floor Helper for resolving uniform floor and zone names across the entire project.
 * 1: Sân Ngoài Trời (Outdoor Yard)
 * 2: Tầng Trệt (Ground Floor)
 * 3: Tầng 1 (1st Floor)
 * 4: Tầng 2 (2nd Floor)
 */

export function getFloorName(floorId?: number, lang: string = 'vi'): string {
  switch (floorId) {
    case 1:
      if (lang === 'en') return 'Outdoor Yard';
      if (lang === 'zh') return '室外展区';
      if (lang === 'ko') return '야외 전시장';
      if (lang === 'ja') return '屋外展示場';
      return 'Sân ngoài trời';
    case 2:
      if (lang === 'en') return 'Ground Floor';
      if (lang === 'zh') return '一楼地面展区 (地面层)';
      if (lang === 'ko') return '1층 (지상층)';
      if (lang === 'ja') return '1階（グラウンドフロア）';
      return 'Tầng trệt';
    case 3:
      if (lang === 'en') return '1st Floor';
      if (lang === 'zh') return '一楼 (1F)';
      if (lang === 'ko') return '1층 (1F)';
      if (lang === 'ja') return '1階 (1F)';
      return 'Tầng 1';
    case 4:
      if (lang === 'en') return '2nd Floor';
      if (lang === 'zh') return '二楼 (2F)';
      if (lang === 'ko') return '2층 (2F)';
      if (lang === 'ja') return '2階 (2F)';
      return 'Tầng 2';
    default:
      return `Tầng ${floorId || 1}`;
  }
}
