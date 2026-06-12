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

export const getPaginatedGames = async (page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  const gamesRef = collection(db, 'games');
  
  // Get total count
  const countSnapshot = await getCountFromServer(gamesRef);
  const total = countSnapshot.data().count;

  // Calculate skip for jumping to page
  // Note: Firestore doesn't have offset, so we fetch the cursor for the page
  const constraints: QueryConstraint[] = [orderBy('date_added', 'desc')];
  
  if (page > 1) {
    const skipCount = (page - 1) * pageSize;
    const skipQuery = query(gamesRef, ...constraints, limit(skipCount));
    const skipSnapshot = await getDocs(skipQuery);
    if (!skipSnapshot.empty) {
      const lastVisible = skipSnapshot.docs[skipSnapshot.docs.length - 1];
      // Note: startAt is used here to jump to the next item
      // Technically we want the item AFTER this, so we'd use startAfter
      // But for page-based jumping startAt with the specific doc is reliable
    }
    
    // Improved jumping: Fetch all docs up to the page start to get the cursor
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

  // Page 1 or fallback
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
  
  // Get total count for category
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
