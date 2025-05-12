export interface SetlistItem {
  id: string;
  type: 'exercise' | 'song';
  name: string;
  artist?: string;
  tempo: number;
}

export interface Setlist {
  id: string;
  name: string;
  description: string;
  items: SetlistItem[];
  lastPracticed: string;
}
