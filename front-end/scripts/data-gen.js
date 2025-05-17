import { writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// ---- USER-DEFINED DATA ----

const BOOKS = [
  {
    name: 'Stick Control',
    sections: [
      { name: 'Basic Stickings', exercise_count: 10, tempo_range: [80, 130] },
      { name: 'Flams', exercise_count: 5, tempo_range: [70, 110] },
      { name: 'Single Beat Rolls', exercise_count: 12, tempo_range: [70, 140] },
      { name: 'Double Beat Rolls', exercise_count: 2, tempo_range: [70, 140] },
      { name: 'Short Roll Combinations', exercise_count: 14, tempo_range: [70, 140] },
      { name: 'Review of Short Roll Combinations', exercise_count: 22, tempo_range: [70, 140] },
      { name: 'Short Rolls and Triplets I', exercise_count: 30, tempo_range: [70, 140] },
      { name: 'Short Rolls and Triplets II', exercise_count: 10, tempo_range: [70, 140] },
    ],
  },
  {
    name: 'Syncopation',
    sections: [{ name: 'Syncopation Exercises', exercise_count: 8, tempo_range: [90, 140] }],
  },
  {
    name: '66 Drum Solos For The Modern Drummer',
    sections: [
      { name: 'Pop Rock Solos', exercise_count: 10, tempo_range: [70, 180] },
      { name: 'Warm Up Solos', exercise_count: 40, tempo_range: [70, 180] },
      { name: 'Funk Rock Solos (16th Note Based)', exercise_count: 5, tempo_range: [70, 180] },
      { name: 'Funk Rock Solos (8th Note Based)', exercise_count: 150, tempo_range: [70, 180] },
      { name: '6/8 Solos', exercise_count: 7, tempo_range: [70, 180] },
      { name: '7/8 Solos', exercise_count: 7, tempo_range: [70, 180] },
      { name: 'Rock Fusion Solos', exercise_count: 2, tempo_range: [70, 180] },
      { name: 'Hard Rock Solos', exercise_count: 10, tempo_range: [70, 180] },
      { name: 'Jazz Solos', exercise_count: 10, tempo_range: [70, 180] },
      { name: 'Shuffle Solos', exercise_count: 10, tempo_range: [70, 180] },
      { name: 'Jazz Fusion Solos', exercise_count: 10, tempo_range: [70, 180] },
    ],
  },
];

const SONGS = [
  { name: 'So What', artist: 'Miles Davis' },
  { name: 'Giant Steps', artist: 'John Coltrane' },
  { name: 'Blue in Green', artist: 'Bill Evans' },
  { name: 'Naima', artist: 'John Coltrane' },
];

const SETLISTS = [
  { name: 'Morning Warmup', count: 3 },
  { name: 'Evening Repertoire', count: 5 },
  { name: 'Drills and Rudiment', count: 7 },
];

// ---- CONFIG ----

const NUM_SESSIONS = 100;
const CREATED_BY = '7f99e15e-429c-4a96-9ea2-726020ff08e3';
const NOTES = [
  'Solid practice',
  'Felt sluggish',
  'Clean run',
  'Choppy transitions',
  'Really good take',
  'Struggled with phrasing',
  'Nailed the feel',
];

// ---- GENERATED DATA ----

const artistsMap = {};
const booksMap = {};
const sectionsMap = {};
const exercises = [];
const sessions = [];
const sessionItems = [];
const setlistsMap = [];
const setlistItems = [];

// Assign IDs to songs and artists
SONGS.forEach((song) => {
  if (!artistsMap[song.artist]) {
    artistsMap[song.artist] = uuidv4();
  }
  song.id = uuidv4();
  song.artist_id = artistsMap[song.artist];
});

// Assign IDs to books, sections, exercises
BOOKS.forEach((book) => {
  const bookId = uuidv4();
  booksMap[book.name] = bookId;
  book.id = bookId;
  book.sections.forEach((section) => {
    const sectionId = uuidv4();
    sectionsMap[section.name] = sectionId;
    section.id = sectionId;
    for (let i = 1; i <= section.exercise_count; i++) {
      const tempo = getRandomInt(...section.tempo_range);
      exercises.push({
        id: uuidv4(),
        name: i,
        goal_tempo: tempo,
        section_id: sectionId,
      });
    }
  });
});

// Generate sessions and items
const baseDate = new Date(Date.now() - NUM_SESSIONS * 24 * 60 * 60 * 1000);
const exerciseIds = exercises.map((ex) => ex.id);
const songIds = SONGS.map((s) => s.id);

for (let i = 0; i < NUM_SESSIONS; i++) {
  const sessionId = uuidv4();
  const createdAt = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
  const duration = getRandomChoice([1200, 1500, 1800, 2100]);
  sessions.push([sessionId, duration, createdAt]);

  const numItems = getRandomInt(3, 12);
  for (let j = 0; j < numItems; j++) {
    const itemId = uuidv4();
    const note = getRandomChoice(NOTES);
    const tempo = getRandomInt(80, 160);
    if (Math.random() < 0.7) {
      const exId = getRandomChoice(exerciseIds);
      sessionItems.push([itemId, sessionId, 'exercise', exId, null, tempo, note, createdAt]);
    } else {
      const songId = getRandomChoice(songIds);
      sessionItems.push([itemId, sessionId, 'song', null, songId, tempo, note, createdAt]);
    }
  }
}

// Generate setlists and items
SETLISTS.forEach((setlist) => {
  const setlistId = uuidv4();
  setlistsMap.push([setlistId, setlist.name]);
  for (let i = 0; i < setlist.count; i++) {
    const itemId = uuidv4();
    const tempo = getRandomInt(90, 150);
    if (Math.random() < 0.6) {
      const exId = getRandomChoice(exerciseIds);
      setlistItems.push([itemId, setlistId, 'exercise', null, exId, i, tempo]);
    } else {
      const songId = getRandomChoice(songIds);
      setlistItems.push([itemId, setlistId, 'song', songId, null, i, tempo]);
    }
  }
});

// ---- OUTPUT ----

const sqlLines = [];

Object.entries(artistsMap).forEach(([name, id]) => {
  sqlLines.push(
    `INSERT INTO public.artists (id, name, created_by) VALUES ('${id}', '${name}', '${CREATED_BY}');`
  );
});

SONGS.forEach((song) => {
  sqlLines.push(
    `INSERT INTO public.songs (id, name, created_by, artist_id, goal_tempo) VALUES ('${
      song.id
    }', '${song.name}', '${CREATED_BY}', '${song.artist_id}', ${getRandomInt(100, 160)});`
  );
});

BOOKS.forEach((book) => {
  sqlLines.push(
    `INSERT INTO public.books (id, name, created_by) VALUES ('${book.id}', '${book.name}', '${CREATED_BY}');`
  );
  book.sections.forEach((section) => {
    sqlLines.push(
      `INSERT INTO public.sections (id, name, created_by, book_id) VALUES ('${section.id}', '${section.name}', '${CREATED_BY}', '${book.id}');`
    );
  });
});

exercises.forEach((ex) => {
  sqlLines.push(
    `INSERT INTO public.exercises (id, name, created_by, section_id, goal_tempo) VALUES ('${ex.id}', '${ex.name}', '${CREATED_BY}', '${ex.section_id}', ${ex.goal_tempo});`
  );
});

sessions.forEach(([id, duration, createdAt]) => {
  sqlLines.push(
    `INSERT INTO public.sessions (id, created_by, duration, created_at) VALUES ('${id}', '${CREATED_BY}', ${duration}, '${createdAt.toISOString()}');`
  );
});

sessionItems.forEach(([id, sessionId, type, exId, songId, tempo, note, createdAt]) => {
  const col = type === 'exercise' ? 'exercise_id' : 'song_id';
  const idVal = type === 'exercise' ? exId : songId;
  sqlLines.push(
    `INSERT INTO public.session_items (id, created_by, session_id, ${col}, tempo, notes, created_at) VALUES ('${id}', '${CREATED_BY}', '${sessionId}', '${idVal}', ${tempo}, '${note}', '${createdAt.toISOString()}');`
  );
});

setlistsMap.forEach(([id, name]) => {
  sqlLines.push(
    `INSERT INTO public.setlists (id, name, created_by) VALUES ('${id}', '${name}', '${CREATED_BY}');`
  );
});

setlistItems.forEach(([id, setlistId, type, songId, exId, pos, tempo]) => {
  const songIdSql = songId ? `'${songId}'` : 'NULL';
  const exIdSql = exId ? `'${exId}'` : 'NULL';
  sqlLines.push(
    `INSERT INTO public.setlist_items (id, created_by, setlist_id, type, song_id, exercise_id, position, tempo) VALUES ('${id}', '${CREATED_BY}', '${setlistId}', '${type}', ${songIdSql}, ${exIdSql}, ${pos}, ${tempo});`
  );
});

writeFileSync('./mock_data.sql', sqlLines.join('\n'));
console.log('SQL seed file written to ./mock_data.sql');

// ---- HELPERS ----

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
