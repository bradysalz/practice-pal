export const practiceSessionsData = {
  '1': {
    id: '1',
    date: new Date('2024-05-09'),
    exercises: [
      {
        id: 'ex1',
        name: 'Paradiddles',
        tempo: 120,
        duration: 15,
        notes: 'Focused on keeping consistent dynamics between left and right hand',
      },
      {
        id: 'ex2',
        name: 'Single Stroke Roll',
        tempo: 100,
        duration: 10,
        notes: 'Worked on speed and endurance',
      },
      {
        id: 'ex3',
        name: 'Double Stroke Roll',
        tempo: 90,
        duration: 10,
        notes: 'Practiced with accent patterns',
      },
    ],
    songs: [
      {
        id: 's1',
        name: 'Back in Black',
        artist: 'AC/DC',
        tempo: 96,
        duration: 20,
        notes: 'Focused on the intro fill and keeping steady time',
      },
      {
        id: 's2',
        name: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        tempo: 116,
        duration: 15,
        notes: 'Worked on the verse groove and dynamics',
      },
    ],
    totalDuration: 70,
    notes: 'Great session today! Made progress on paradiddles at higher tempos.',
  },
  '2': {
    id: '2',
    date: new Date('2024-05-08'),
    exercises: [
      { id: 'ex1', name: 'Paradiddles', tempo: 110, duration: 10, notes: '' },
      { id: 'ex4', name: 'Flams', tempo: 85, duration: 15, notes: 'Worked on spacing' },
    ],
    songs: [
      {
        id: 's3',
        name: 'Enter Sandman',
        artist: 'Metallica',
        tempo: 123,
        duration: 25,
        notes: 'Focused on the intro and verse groove',
      },
    ],
    totalDuration: 50,
    notes: 'Shorter session but productive work on flams.',
  },
};

export const recentSessions = [
  {
    id: '1',
    date: new Date('2024-05-09'),
    exercises: [
      { id: 'ex1', name: 'Paradiddles', tempo: 120, duration: 15 },
      { id: 'ex2', name: 'Single Stroke Roll', tempo: 100, duration: 10 },
      { id: 'ex3', name: 'Double Stroke Roll', tempo: 90, duration: 10 },
    ],
    songs: [
      { id: 's1', name: 'Back in Black', artist: 'AC/DC', tempo: 96, duration: 20 },
      { id: 's2', name: 'Smells Like Teen Spirit', artist: 'Nirvana', tempo: 116, duration: 15 },
    ],
    totalDuration: 70,
  },
  {
    id: '2',
    date: new Date('2024-05-08'),
    exercises: [
      { id: 'ex1', name: 'Paradiddles', tempo: 110, duration: 10 },
      { id: 'ex4', name: 'Flams', tempo: 85, duration: 15 },
    ],
    songs: [{ id: 's3', name: 'Enter Sandman', artist: 'Metallica', tempo: 123, duration: 25 }],
    totalDuration: 50,
  },
  {
    id: '3',
    date: new Date('2024-05-07'),
    exercises: [
      { id: 'ex5', name: 'Rudiment Combinations', tempo: 90, duration: 20 },
      { id: 'ex6', name: 'Triplet Fills', tempo: 80, duration: 15 },
    ],
    songs: [{ id: 's4', name: 'Tom Sawyer', artist: 'Rush', tempo: 88, duration: 30 }],
    totalDuration: 65,
  },
  {
    id: '4',
    date: new Date('2024-05-06'),
    exercises: [{ id: 'ex7', name: 'Ghost Notes', tempo: 95, duration: 25 }],
    songs: [
      { id: 's5', name: 'Rosanna', artist: 'Toto', tempo: 84, duration: 20 },
      { id: 's6', name: 'Superstition', artist: 'Stevie Wonder', tempo: 96, duration: 15 },
    ],
    totalDuration: 60,
  },
];

export const setlistsData = [
  {
    id: 'sl1',
    name: 'Warm-up Routine',
    description: 'A complete warm-up routine with essential rudiments',
    items: [
      { id: 'ex1', type: 'exercise', name: 'Single Stroke Roll', tempo: 120 },
      { id: 'ex3', type: 'exercise', name: 'Double Stroke Roll', tempo: 90 },
      { id: 'ex4', type: 'exercise', name: 'Paradiddles', tempo: 110 },
    ],
    lastPracticed: '2 days ago',
  },
  {
    id: 'sl2',
    name: 'Rock Classics',
    description: 'Classic rock songs for practice',
    items: [
      { id: 's1', type: 'song', name: 'Back in Black', artist: 'AC/DC', tempo: 96 },
      { id: 's2', type: 'song', name: 'Smells Like Teen Spirit', artist: 'Nirvana', tempo: 116 },
      { id: 's3', type: 'song', name: 'Enter Sandman', artist: 'Metallica', tempo: 123 },
    ],
    lastPracticed: '1 week ago',
  },
  {
    id: 'sl3',
    name: 'Coordination Workout',
    description: 'Exercises focused on improving coordination',
    items: [
      { id: 'ex4', type: 'exercise', name: 'Paradiddles', tempo: 110 },
      { id: 'ex7', type: 'exercise', name: 'Independence Exercise 1', tempo: 95 },
      { id: 'ex8', type: 'exercise', name: 'Independence Exercise 2', tempo: 90 },
    ],
    lastPracticed: 'Yesterday',
  },
];

export const exercisesData = [
  {
    id: 'ex1',
    type: 'exercise',
    name: 'Single Stroke Roll',
    bookName: 'Stick Control',
    goalTempo: 120,
  },
  {
    id: 'ex2',
    type: 'exercise',
    name: 'Single Stroke Variations',
    bookName: 'Stick Control',
    goalTempo: 100,
  },
  {
    id: 'ex3',
    type: 'exercise',
    name: 'Double Stroke Roll',
    bookName: 'Stick Control',
    goalTempo: 90,
  },
  {
    id: 'ex4',
    type: 'exercise',
    name: 'Paradiddles',
    bookName: 'Stick Control',
    goalTempo: 110,
  },
  {
    id: 'ex5',
    type: 'exercise',
    name: 'Quarter Note Syncopation',
    bookName: 'Syncopation',
    goalTempo: 85,
  },
];

export const songsData = [
  {
    id: 's1',
    type: 'song',
    name: 'Back in Black',
    artist: 'AC/DC',
    goalTempo: 96,
    lastPracticed: '2 days ago',
  },
  {
    id: 's2',
    type: 'song',
    name: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    goalTempo: 116,
    lastPracticed: '4 days ago',
  },
  {
    id: 's3',
    type: 'song',
    name: 'Enter Sandman',
    artist: 'Metallica',
    goalTempo: 123,
    lastPracticed: '1 week ago',
  },
  {
    id: 's4',
    type: 'song',
    name: 'Tom Sawyer',
    artist: 'Rush',
    goalTempo: 88,
    lastPracticed: '1 days ago',
  },
  {
    id: 's5',
    type: 'song',
    name: 'Rosanna',
    artist: 'Toto',
    goalTempo: 84,
    lastPracticed: '2 days ago',
  },
];

export const bookData = [
  {
    id: 'b1',
    name: 'Stick Control',
    author: 'George Lawrence Stone',
    coverColor: '#FF6B6B',
    sections: [
      {
        id: 1,
        name: 'Single Strokes',
        exercises: [
          { id: 'ex1', name: 'Single Stroke Roll', goalTempo: 120 },
          { id: 'ex2', name: 'Single Stroke Variations', goalTempo: 100 },
        ],
      },
      {
        id: 2,
        name: 'Double Strokes',
        exercises: [
          { id: 'ex3', name: 'Double Stroke Roll', goalTempo: 90 },
          { id: 'ex4', name: 'Double Stroke Variations', goalTempo: 85 },
        ],
      },
    ],
  },
  {
    id: 'b2',
    name: 'Syncopation',
    author: 'Ted Reed',
    coverColor: '#4ECDC4',
    sections: [
      {
        id: 3,
        name: 'Quarter Note Variations',
        exercises: [
          { id: 'ex5', name: 'Quarter Note Syncopation', goalTempo: 85 },
          { id: 'ex6', name: 'Quarter Note Patterns', goalTempo: 90 },
        ],
      },
      {
        id: 4,
        name: 'Eighth Note Variations',
        exercises: [
          { id: 'ex7', name: 'Eighth Note Syncopation', goalTempo: 80 },
          { id: 'ex8', name: 'Eighth Note Patterns', goalTempo: 85 },
        ],
      },
    ],
  },
];
