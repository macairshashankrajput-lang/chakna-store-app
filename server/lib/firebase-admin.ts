/**
 * Firebase Admin SDK for Server-side Operations
 * RTDB + Auth Admin for TRPC backend
 */

import admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json'); // TODO: User upload this file

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://thechaknastore-default-rtdb.firebaseio.com"
    });
}

export const adminDb = admin.database();
export const adminAuth
