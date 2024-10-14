import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDAabeY8yA3H_CLbJFgAOiQUGFiOZXwurY',
  authDomain: 'week7-qinyi.firebaseapp.com',
  projectId: 'week7-qinyi',
  storageBucket: 'week7-qinyi.appspot.com',
  messagingSenderId: '704665511439',
  appId: '1:704665511439:web:a53b29e910eefcd1b7e57a',
  measurementId: 'G-K11WR3X3R2'
}
initializeApp(firebaseConfig)
const db = getFirestore()
export default db
