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
  getDoc
} from 'firebase/firestore';
import { Game } from '@/types/game';

/**
 * Data Access Layer for YoriGames.
 * Pulls dynamic GameMonetize data from Firestore.
 */

export const getAllGames = async (max: number = 60): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Game));
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
  return { ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as Game;
};

export const getGamesByCategory = async (category: string, max: number = 24): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef, 
    where('category', '==', category), 
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Game));
};

export const getFeaturedGames = async (max: number = 10): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('featured', '==', true), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Game));
};

export const getTrendingGames = async (max: number = 10): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('trending', '==', true), limit(max));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Game));
};

export const getNewArrivals = async (max: number = 10): Promise<Game[]> => {
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef, 
    orderBy('date_added', 'desc'), 
    limit(max)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Game));
};
