const fs = require('fs');
const {
  initializeApp
} = require('firebase/app');
const {
  getFirestore,
  connectFirestoreEmulator,
  addDoc,
  collection,
  doc,
  setDoc
} = require('firebase/firestore');

const readline = require("readline");
const rl = readline.createInterface({
  input: fs.createReadStream("weddingInviteList.csv")
});

const app = initializeApp({
  projectId: "wedding-site-daf66"
})
const firestore = getFirestore(app);
connectFirestoreEmulator(firestore, 'localhost', 8080);
// const collectionRef = collection(firestore, 'guests');

rl.on("line", async (row) => {
  const data = row.split(",");
  const primaryData = data.slice(0, 3)
  const secondaryData = data.slice(3)
  const hasRehersalOption = data[6].toLowerCase() === 'y'
  const search = data.slice(7)
    .filter(nickname => !!nickname)
    .map(nickname => nickname.replace(/\"/, '').trim().toLowerCase())
  const primary = {
    prefix: primaryData[0],
    firstName: primaryData[1],
    lastName: primaryData[2],
  }

  const secondary = secondaryData[1] ? {
      prefix: secondaryData[0],
      firstName: secondaryData[1],
      lastName: secondaryData[2],
    } :
    undefined

  const base = {
    primary,
    hasResponded: false,
    hasRehersalOption,
    searchExtra: search.length ? search : []
  }
  const payload = secondary ? {
    ...base,
    secondary
  } : base

  const id = `${primary.lastName.toLowerCase().replace(/\'/, '')}_${primary.firstName.toLowerCase()}${secondary ? '_'+secondary.firstName.toLowerCase() : ''}`
  const docRef = doc(firestore, 'guests', id);
  await setDoc(docRef, payload)
  console.log(`id: ${id} added!`)
});

rl.on("close", () => {
  console.log("DONE");
});
