export interface Section {
  id: number;
  name: string;
  exercises: number;
}

export interface Book {
  id: string;
  name: string;
  author: string;
  sections: Section[];
  coverColor: string;
}
