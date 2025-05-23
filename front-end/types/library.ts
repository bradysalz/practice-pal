export interface Exercise {
  id: string;
  name: string;
  goalTempo?: number;
}

export interface Section {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Book {
  id: string;
  name: string;
  author: string;
  sections: Section[];
  coverColor: string;
}
