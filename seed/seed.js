const faker = require('faker');
const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, addDoc, collection } = require('firebase/firestore');

const SEED_SIZE = 10
function generateName() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  return { firstName, lastName };
}
function defaultParams() {
  return {
    mealChoice: null,
    attendingWedding: null,
    attendingBrunch: null,
  }
}

function randomRehersal() {
  return Math.floor(Math.random() * 10) < 5
}

function seedData() {
  const collectionRef = collection(fs, 'guests');

  return Promise.all([...Array(SEED_SIZE).keys()].map(() => {
    const rehersalOption = randomRehersal()
    let primary = {...generateName(), ...defaultParams()}
    let secondary = {...generateName(), ...defaultParams()}

    if (rehersalOption) {
      primary = {...primary, attendingRehersal: null}
      secondary = {...secondary, attendingRehersal: null}
    }
    const data = {
      primary,
      secondary,
      hasResponded: false
    }
    console.log(data)
    return addDoc(collectionRef, data)
  }))
}

const app = initializeApp({projectId: "wedding-site-daf66"})
const fs = getFirestore(app);
// if (!environment.production) {
  connectFirestoreEmulator( fs, 'localhost' , 8080 );
// }

seedData()
  .then(() => {
    console.log(`${SEED_SIZE} items added`)
    console.log('Data seeded!')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

