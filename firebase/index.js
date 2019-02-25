import * as firebase from 'firebase';
import {
 apiKey,
 authDomain,
 databaseURL,
 projectId,
 storageBucket,
} from '../secrets';

// Initialize Firebase
const firebaseConfig = {
 apiKey,
 authDomain,
 databaseURL,
 projectId,
 storageBucket,
};

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();
