import { db } from '@/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  orderBy, 
  getCountFromServer,
  doc,
  getDoc,
  Timestamp,
  startAt,
  QueryConstraint
} from 'firebase/firestore';
import { Game } from '@/types/game';

/**
 * Data Access Layer for YoriGames.
 * Pulls dynamic GameMonetize data from Firestore.
 */

/**
 * Robustly sanitizes Firestore document data for Client Components.
 * Converts Timestamps and other non-plain objects to serializable formats.
 */
const sanitizeData = (data: any) => {
  if (!data) return data;
  
  // Create a clean, plain object copy
  const sanitized = { ...data };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (value && typeof value === 'object') {
      // Handle Firestore Timestamp specifically
      if (typeof value.toDate === 'function') {
        sanitized[key] = value.toDate().toISOString();
      } 
      // Handle plain-object-like Timestamps (common in some SDK behaviors)
      else if ('seconds' in value && 'nanoseconds' in value) {
        try {
          sanitized[key] = new Date(value.seconds * 1000).toISOString();
        } catch (e) {
          sanitized[key] = null;
        }
      }
      // Recursive sanitization for nested objects if they exist
      else if (Object.prototype.toString.call(value) === '[object Object]') {
        sanitized[key] = sanitizeData(value);
      }
      // Arrays
      else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => (typeof item === 'object' ? sanitizeData(item) : item));
      }
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

export const getPaginatedGames = async (page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const gamesRef = collection(db, 'games');
  
  const countSnapshot = await getCountFromServer(gamesRef);
  const total = countSnapshot.data().count;

  const constraints: QueryConstraint[] = [orderBy('date_added', 'desc')];
  
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

export const getGamesByCategory = async (category: string, max: number = 24): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef, 
    where('category', '==', category), 
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
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