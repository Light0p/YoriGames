import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { app, auth, db, storage, firebaseConfig } from './config';

export function initializeFirebase(): {
  app: any;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
} {
  // These are already initialized in config.ts, we just return them
  return { app, db, auth, storage };
}

// Named exports for direct access if needed outside of provider context
export { app, db, auth, storage, firebaseConfig };

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
