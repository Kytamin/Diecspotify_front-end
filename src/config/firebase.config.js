import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCt0dSmh2IURDKkpZxTab9SPpkNAhGl7AE",
    authDomain: "budget-spotify-f7142.firebaseapp.com",
    projectId: "budget-spotify-f7142",
    storageBucket: "budget-spotify-f7142.appspot.com",
    messagingSenderId: "28392913964",
    appId: "1:28392913964:web:81b6bf775a8d4e2ae42589",
    measurementId: "G-CY8X9VDZTR"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;