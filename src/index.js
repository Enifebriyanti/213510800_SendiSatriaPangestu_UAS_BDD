import { initializeApp } from "firebase/app";
import {
    getFirestore,collection,onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy,serverTimestamp,
    getDoc,updateDoc
}from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,signInWithEmailAndPassword,
    onAuthStateChanged
}from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyArXzWEwnR-PY-qJMcstjDNBvlaHwZAwto",
    authDomain: "fir-9-sendi.firebaseapp.com",
    projectId: "fir-9-sendi",
    storageBucket: "fir-9-sendi.appspot.com",
    messagingSenderId: "300527154096",
    appId: "1:300527154096:web:8350e15e108a1164d75c75"
};
  //init firebasenya
  initializeApp(firebaseConfig)

//init service nya
const db= getFirestore()
const auth = getAuth()
//collection reff nya
const colRef = collection(db,'books')

//queries
const q = query(colRef,orderBy('createdAt'))



//Real Time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc)=> {
        books.push({ ...doc.data(), id:doc.id })
    })
    console.log(books)
})
   

//Menambahkan document
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(colRef,{
        judul: addBookForm.judul.value,
        penulis: addBookForm.penulis.value,
        createdAt: serverTimestamp()
    })
    .then(()=> {
        addBookForm.reset()
    })
})

//Menghapus document
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)
    deleteDoc(docRef)
    .then(() =>{
        deleteBookForm.reset()
    })
})

//Get Single Document
const docRef = doc(db, 'books','LZRpQTdEY1sgiFvQyUSy')

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(),doc.id)
})


//Updates Books
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'books', updateForm.id.value)
    updateDoc(docRef,{
        judul:'Mahasiswa Langka'
    })
    .then(() => {
        updateForm.reset
    })
})

//SignUp User
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth,email,password)
    .then((cred) => {
        //console.log('User Created :', cred.user)
        signupForm.reset()
    })
    .catch((err)=> {
        console.log(err.mesage)
    })
})

//Login dan Logout User
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
   signOut(auth)
    .then(()=> {
       console.log('User telah Sign Out')
    })
    .catch((err)=> {
        console.log(err.message)
    })
})
//Tampilkan Data User yang Login
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth,email,password)
    .then((cred) =>{
        console.log('user telah Login:', cred.user)
})
.catch((err)=> {
    console.log(err.message)
    })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth,(user) => {
    console.log('User Status Changed:',user)
})

//unsubscribing
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', (e) => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})