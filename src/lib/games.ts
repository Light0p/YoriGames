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
 */
const sanitizeData = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  if (typeof obj.seconds === 'number' && typeof obj.nanoseconds === 'number') {
    return new Date(obj.seconds * 1000).toISOString();
  }
  if (Array.isArray(obj)) return obj.map(sanitizeData);
  if (obj.constructor !== Object && Object.getPrototypeOf(obj) !== null) return null; 

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeData(obj[key]);
    }
  }
  return sanitized;
};

const MAX_ALLOWED_PAGES = 20; 

export const getPaginatedGames = async (page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  try {
    const gamesRef = collection(db, 'games');
    const countSnapshot = await getCountFromServer(gamesRef);
    const total = countSnapshot.data().count;

    if (page > MAX_ALLOWED_PAGES) return { games: [], total };

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
  } catch (error) {
    console.error("Quota or network failure in getPaginatedGames:", error);
    return { games: [], total: 0 };
  }
};

/**
 * Fetches a simplified list of games for global client-side searching.
 */
export const getSearchableGames = async (max: number = 1000): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, 'games');
    // Only fetch what's needed for search to keep payload small
    const q = query(gamesRef, limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return sanitizeData({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        thumbnail: data.thumbnail,
        category: data.category,
        tags: data.tags || []
      }) as Game;
    });
  } catch (error) {
    console.error("Searchable games fetch failed:", error);
    return [];
  }
};

export const getDiscoveryGames = async (max: number = 300): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, orderBy('date_added', 'desc'), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
  } catch (error) {
    console.error("Discovery fetch failed:", error);
    return [];
  }
};

export const getPaginatedGamesByCategory = async (category: string, page: number = 1, pageSize: number = 24): Promise<{ games: Game[], total: number }> => {
  try {
    const gamesRef = collection(db, 'games');
    const decodedCategory = decodeURIComponent(category);
    const baseConstraints = [where('category', '==', decodedCategory)];
    
    const countSnapshot = await getCountFromServer(query(gamesRef, ...baseConstraints));
    const total = countSnapshot.data().count;

    if (page > MAX_ALLOWED_PAGES) return { games: [], total };

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
  } catch (error) {
    console.error("Category fetch failed:", error);
    return { games: [], total: 0 };
  }
};

export const getGameBySlug = async (slug: string): Promise<Game | null> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return sanitizeData({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id }) as Game;
  } catch {
    return null;
  }
};

export const getFeaturedGames = async (max: number = 10): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, where('featured', '==', true), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
  } catch {
    return [];
  }
};

export const getTrendingGames = async (max: number = 10): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, where('trending', '==', true), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
  } catch {
    return [];
  }
};

export const getNewArrivals = async (max: number = 10): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, orderBy('date_added', 'desc'), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
  } catch {
    return [];
  }
};

export const getRelatedGames = async (category: string, currentGameId: string, limitMax: number = 6): Promise<Game[]> => {
  try {
    const gamesRef = collection(db, 'games');
    const q = query(gamesRef, where('category', '==', category), limit(limitMax + 1));
    const snapshot = await getDocs(q);
    const games = snapshot.docs.map(doc => sanitizeData({ ...doc.data(), id: doc.id }) as Game);
    return games.filter(g => g.id !== currentGameId).slice(0, limitMax);
  } catch {
    return [];
  }
};