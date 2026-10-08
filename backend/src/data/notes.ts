import { Note } from '../types/index.js';

export const notes: Note[] = [
  {
    id: 'note-1',
    userId: 'user-demo-1',
    title: 'B-Tree vs B+ Tree Indexing Tradeoffs',
    content: 'B-Trees store keys and record data pointers in all nodes (both internal and leaf), resulting in smaller branching factors. B+ Trees store all actual record pointers in leaf nodes which are sequentially linked in a doubly-linked list. This enables lightning-fast range queries (O(log N + k)) and higher cache locality in modern database engines.',
    subject: 'Database Management Systems',
    tags: ['Databases', 'Indexing', 'Performance'],
    createdAt: '2026-10-02T14:30:00.000Z',
    updatedAt: '2026-10-04T09:15:00.000Z',
  },
  {
    id: 'note-2',
    userId: 'user-demo-1',
    title: 'Virtual Memory & Belady’s Anomaly Notes',
    content: 'Belady\'s Anomaly is the phenomenon where increasing the number of page frames results in an increase in page faults. It occurs in FIFO page replacement, but cannot occur in Stack algorithms such as LRU (Least Recently Used) or Optimal Replacement because the set of pages in memory for n frames is always a subset of pages in memory for n+1 frames.',
    subject: 'Operating Systems',
    tags: ['Memory', 'Paging', 'Algorithms'],
    createdAt: '2026-10-03T11:00:00.000Z',
    updatedAt: '2026-10-03T11:00:00.000Z',
  },
  {
    id: 'note-3',
    userId: 'user-demo-1',
    title: 'REST API Design & Idempotency Rules',
    content: 'An HTTP method is idempotent if making multiple identical requests has the same effect on the server state as a single request. GET, HEAD, PUT, and DELETE are idempotent. POST and PATCH are generally not idempotent. Always use status 200/204 for successful deletions, and 409 Conflict when unique constraints fail.',
    subject: 'Advanced Web Development',
    tags: ['WebDev', 'REST', 'API Design'],
    createdAt: '2026-10-05T16:20:00.000Z',
    updatedAt: '2026-10-06T18:00:00.000Z',
  },
  {
    id: 'note-4',
    userId: 'user-demo-1',
    title: 'Dijkstra vs Bellman-Ford Complexity Summary',
    content: 'Dijkstra with Min-Heap operates in O((V + E) log V) and works strictly on non-negative edge weights. Bellman-Ford takes O(V * E), which is slower, but handles negative edge weights and can detect negative cycles by checking for distance improvements during the V-th relaxation step.',
    subject: 'Data Structures & Algorithms',
    tags: ['Graphs', 'Algorithms', 'Complexity'],
    createdAt: '2026-10-06T13:45:00.000Z',
    updatedAt: '2026-10-06T13:45:00.000Z',
  },
];
