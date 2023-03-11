import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const createSearch = functions.firestore.document('/guests/{documentId}')
  .onCreate((snapshot) => {
    const data = snapshot.data() as {
      primary: {firstName: string, lastName: string};
      secondary?: {firstName: string, lastName: string};
      searchExtra: string[]
    };
    const search = data.searchExtra ? data.searchExtra : [];
    search.push(data.primary.firstName.toLowerCase());
    search.push(data.primary.lastName.toLowerCase());
    if (data.secondary) {
      search.push(data.secondary.firstName.toLowerCase());
      search.push(data.secondary.lastName.toLowerCase());
    }
    return snapshot.ref.set({search}, {merge: true});
  });
