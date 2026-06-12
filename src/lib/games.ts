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
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { Game } from '@/types/game';

/**
 * Data Access Layer for YoriGames.
 * Hardened to prevent RangeErrors and optimized for large datasets.
 */

/**
 * Sanitizes Firestore data for Client Components.
 * Prevents RangeError by limiting recursion and avoiding circular references.
 */
const sanitizeData = (data: any, seen = new WeakSet()): any => {
  if (data === null || typeof data !== 'object') return data;
  
  // Prevent circular references
  if (seen.has(data)) return '[Circular]';
  if (typeof data === 'object') seen.add(data);

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, seen));
  }

  const sanitized: any = {};
  
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    
    const value = data[key];
    
    if (value && typeof value === 'object') {
      // Handle Firestore Timestamps
      if (typeof value.toDate === 'function') {
        sanitized[key] = value.toDate().toISOString();
      } 
      else if ('seconds' in value && 'nanoseconds' in value) {
        sanitized[key] = new Date(value.seconds * 1000).toISOString();
      }
      // Handle Nested Objects (limit recursion depth implicitly via iteration)
      else {
        sanitized[key] = sanitizeData(value, seen);
      }
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const getAllGames = async (max: number = 60): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
};

/**
 * Efficient pagination for tens of thousands of games.
 */
export const getPaginatedGames = async (page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const gamesRef = collection(db, 'games');
  
  // 1. Get total count (fast and cheap)
  const countSnapshot = await getCountFromServer(gamesRef);
  const total = countSnapshot.data().count;

  const constraints: QueryConstraint[] = [orderBy('date_added', 'desc')];
  
  // 2. Handle specific page jumps
  if (page > 1) {
    const skipCount = (page - 1) * pageSize;
    // For arbitrary jumps in Firestore, we find the starting document
    // We limit to skipCount + 1 to find the specific cursor
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

  // Page 1
  const q = query(gamesRef, ...constraints, limit(pageSize));
  const snapshot = await getDocs(q);
  return {
    games: snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game),
    total
  };
};

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

export const getPaginatedGamesByCategory = async (category: string, page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const gamesRef = collection(db, 'games');
  const baseConstraints = [where('category', '==', category)];
  
  const countSnapshot = await getCountFromServer(query(gamesRef, ...baseConstraints));
  const total = countSnapshot.data().count;

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
  const q = query(
    gamesRef, 
    orderBy('date_added', 'desc'), 
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
};