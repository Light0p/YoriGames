import { db } from '@/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  orderBy, 
  getCountFromServer,
  startAt,
  QueryConstraint
} from 'firebase/firestore';
import { Game } from '@/types/game';

/**
 * Sanitizes Firestore data for Next.js Server/Client boundary.
 * Converts Timestamps to ISO strings and handles nested objects safely.
 */
const sanitizeData = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;

  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  if (typeof obj.seconds === 'number' && typeof obj.nanoseconds === 'number') {
    return new Date(obj.seconds * 1000).toISOString();
  }

  if (Array.isArray(obj)) return obj.map(sanitizeData);

  // Prevent recursion for non-plain objects
  if (obj.constructor !== Object && Object.getPrototypeOf(obj) !== null) return null; 

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeData(obj[key]);
    }
  }
  return sanitized;
};

// SAFETY CAP: Maximum pages a user can jump to. Protects Firebase free quota.
// 20 pages * 24 games = 480 games per category. No real user browses past 480 games without searching.
const MAX_ALLOWED_PAGES = 20; 

export const getPaginatedGames = async (page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const gamesRef = collection(db, 'games');
  const countSnapshot = await getCountFromServer(gamesRef);
  const total = countSnapshot.data().count;

  // 🚨 THE BOMB DEFUSER: Block deep pagination attacks/quota leaks
  if (page > MAX_ALLOWED_PAGES) {
    console.warn(`Blocked attempt to fetch page ${page}. Protecting Firebase quota.`);
    return { games: [], total }; 
  }

  const constraints: QueryConstraint[] = [orderBy('date_added', 'desc')];
  
  if (page > 1) {
    const skipCount = (page - 1) * pageSize;
    // We only fetch the minimal set of docs needed to find the cursor up to our safe limit
    const jumpQuery = query(gamesRef, ...constraints, limit(skipCount + 1));
    const jumpSnapshot = await getDocs(jumpQuery);
    
    if (!jumpSnapshot.empty) {
      const startDoc = jumpSnapshot.docs[jumpSnapshot.docs.length - 1];
      const pageQuery = query(gamesRef, ...constraints, startAt(startDoc), limit(pageSize));
      const snapshot = await getDocs(pageQuery);
      return {
        games: snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game),
        total
      };
    }
  }

  const q = query(gamesRef, ...constraints, limit(pageSize));
  const snapshot = await getDocs(q);
  return {
    games: snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game),
    total
  };
};

export const getPaginatedGamesByCategory = async (category: string, page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const gamesRef = collection(db, 'games');
  const baseConstraints = [where('category', '==', category)];
  
  const countSnapshot = await getCountFromServer(query(gamesRef, ...baseConstraints));
  const total = countSnapshot.data().count;

  // 🚨 THE BOMB DEFUSER
  if (page > MAX_ALLOWED_PAGES) {
    return { games: [], total };
  }

  const constraints: QueryConstraint[] = [...baseConstraints, orderBy('date_added', 'desc')];
  
  if (page > 1) {
    const skipCount = (page - 1) * pageSize;
    const jumpQuery = query(gamesRef, ...constraints, limit(skipCount + 1));
    const jumpSnapshot = await getDocs(jumpQuery);
    if (!jumpSnapshot.empty) {
      const startDoc = jumpSnapshot.docs[jumpSnapshot.docs.length - 1];
      const pageQuery = query(gamesRef, ...constraints, startAt(startDoc), limit(pageSize));
      const snapshot = await getDocs(pageQuery);
      return {
        games: snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game),
        total
      };
    }
  }

  const q = query(gamesRef, ...constraints, limit(pageSize));
  const snapshot = await getDocs(q);
  return {
    games: snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game),
    total
  };
};

// Utility functions
export const getTotalGameCount = async (): Promise<number> => {
  const gamesRef = collection(db, 'games');
  const snapshot = await getCountFromServer(gamesRef);
  return snapshot.data().count;
};

export const getGameBySlug = async (slug: string): Promise<Game | null> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return sanitizeData({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id }) as Game;
};

export const getFeaturedGames = async (max: number = 10): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('featured', '==', true), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
};

export const getTrendingGames = async (max: number = 10): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('trending', '==', true), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
};

export const getNewArrivals = async (max: number = 10): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, orderBy('date_added', 'desc'), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
};

// Quota-Safe Related Games Function
export const getRelatedGames = async (category: string, currentGameId: string, limitMax: number = 6): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('category', '==', category), limit(limitMax + 1));
  const snapshot = await getDocs(q);
  const games = snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
  return games.filter(g => g.id !== currentGameId).slice(0, limitMax);
};