'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    db: Firestore;
    auth: Auth;
    storage: FirebaseStorage;
  } | null>(null);

  useEffect(() => {
    const { app, db, auth, storage } = initializeFirebase();
    setFirebase({ app, db, auth, storage });
  }, []);

  if (!firebase) {
    return null;
  }

  return (
    <FirebaseProvider 
      app={firebase.app} 
      db={firebase.db} 
      auth={firebase.auth}
      storage={firebase.storage}
    >
      {children}
    </FirebaseProvider>
  );
};
