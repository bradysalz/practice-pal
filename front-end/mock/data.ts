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
  { id: 's1', type: 'song', name: 'Back in Black', artist: 'AC/DC', goalTempo: 96 },
  { id: 's2', type: 'song', name: 'Smells Like Teen Spirit', artist: 'Nirvana', goalTempo: 116 },
  { id: 's3', type: 'song', name: 'Enter Sandman', artist: 'Metallica', goalTempo: 123 },
  { id: 's4', type: 'song', name: 'Tom Sawyer', artist: 'Rush', goalTempo: 88 },
  { id: 's5', type: 'song', name: 'Rosanna', artist: 'Toto', goalTempo: 84 },
];
