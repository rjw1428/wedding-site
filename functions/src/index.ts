import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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


export const emailNotification = functions.firestore.document('guests/{documentId}')
  .onUpdate((snapshot, context) => {
    const app = admin.initializeApp();

    const data = snapshot.after.data() as {
      primary: any
      secondary: any
    };

    let response = '';
    if (data.secondary) {
      if (data.primary.attendingWedding && data.secondary.attendingWedding) {
        response = 'Both coming to the wedding';
      } else if (data.primary.attendingWedding && !data.secondary.attendingWedding) {
        response = `${data.primary.firstName} is coming, but ${data.secondary.firstName} will not be attending`;
      } else if (!data.primary.attendingWedding && data.secondary.attendingWedding) {
        response = `${data.secondary.firstName} is coming, but ${data.primary.firstName} will not be attending`;
      } else {
        response = 'Unfortunately neither are able to attend';
      }
    } else {
      response = data.primary.attendingWedding ?
        `${data.primary.firstName} is coming without a guest` :
        `Unfortunately they are not able to attend`;
    }

    const firstName = `${data.primary.firstName} ${data.primary.lastName}`;
    const secondName = `${data.secondary ? data.secondary.firstName : 'Guest '}${ data.secondary ? " "+data.secondary.lastName : ""}`;
    const text = `${firstName} and ${secondName} have responsed. \n ${response}`;
    const recipients = [
      '2675741192@vtext.com',
      '6107304332@msg.fi.google.com',
      '2672400945@vtext.com',
    ];

    if ([
      'McDermid',
      'Wilk',
      'Bottcher',
      'Kazor',
      'Boatner',
      'Foe',
      'Gotlieb',
      'Hazelwood',
      'Megee',
      'Moghim',
      'Pappas',
      'Pastor',
      'Yonchak',
    ].includes(data.primary.lastName)) {
      recipients.push('6107374498@vtext.com');
    }

    recipients.forEach((person) => {
      app.firestore().collection('mail').add({
        to: [person],
        message: {text},
      });
    });
  });
