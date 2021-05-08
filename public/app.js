const auth = firebase.auth();

const isSignedIn = document.getElementById("isSignedIn");
const isSignedOut = document.getElementById("isSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        isSignedIn.hidden = false;
        isSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p> User ID: ${user.uid} </p>`;

        createBeeRack.hidden = false;

        beeRacksRef = db.collection("bees_rack");

        const { serverTimestamp } = firebase.firestore.FieldValue;

        createBeeRack.onclick = () => {
            beeRacksRef.add({
                uid: user.uid,
                temperature: 45,
                humidity: 25,
                "fan speed": 0.6,
                time: serverTimestamp(),
            });
        }
        
        unsubscribe = beeRacksRef
        .where("uid", "==", user.uid)
        // .orderBy('time')
        .get(querySnapshot => {
            const racks = querySnapshot.docs.map(doc => {
                return `<li> ${ doc.data().temperature } </li>`
            });

            beeRacks.innerHTML = racks.join("");
        });

    } else {
        isSignedIn.hidden = true;
        isSignedOut.hidden = false;
        userDetails.innerHTML = "";
        createBeeRack.hidden = true;
        createBeeRack.onclick = () => {};
        unsubscribe && unsubscribe();
    }
})


const db = firebase.firestore();

const createBeeRack = document.getElementById("createBeeRack");
const beeRacks = document.getElementById("beeRacks");

let beeRacksRef;
let unsubscribe;