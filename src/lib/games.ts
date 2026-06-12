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
  Timestamp
} from 'firebase/firestore';
import { Game } from '@/types/game';

/**
 * Data Access Layer for YoriGames.
 * Pulls dynamic GameMonetize data from Firestore.
 */

/**
 * Sanitizes Firestore document data for Client Components.
 * Converts Timestamps to ISO strings to avoid Next.js serialization errors.
 */
const sanitizeData = (data: any) => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    if (value instanceof Timestamp) {
      sanitized[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      // Handle cases where the object is not an instance but has the structure
      try {
        sanitized[key] = new Timestamp(value.seconds, value.nanoseconds).toDate().toISOString();
      } catch (e) {
        // Fallback
      }
    }
  });
  return sanitized;
};

export const getAllGames = async (max: number = 60): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
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
