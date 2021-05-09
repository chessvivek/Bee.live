// 
// Google Charts declaration
// 

google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

function drawChart(dataTable, elementId) {
    // var data = google.visualization.arrayToDataTable([
    //     ['Year', 'Sales', 'Expenses'],
    //     ['2004',  1000,      400],
    //     ['2005',  1170,      460],
    //     ['2006',  660,       1120],
    //     ['2007',  1030,      540]
    // ]);

    var data = google.visualization.arrayToDataTable(dataTable);

    var options = {
        title: '',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById(elementId));

    chart.draw(data, options);
}

// 
// Firebase authentication
// 

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const navbar = document.getElementById("homepage-navbar");
const homepage = document.getElementById("wrapper");
const loginpage = document.getElementById("loginpage");
const displayName = document.getElementById("display-name");

navbar.hidden = true;
homepage.hidden = true;
loginpage.hidden = false;

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

// 
// Firestore queries
// 

const db = firebase.firestore();
const COLLECTION_NAME = "sensor_data";
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user) {
        navbar.hidden = false;
        homepage.hidden = false;
        loginpage.hidden = true;

        console.log("user");
        console.log(user);
        displayName.innerHTML = `Hi, ${user.displayName.split(" ")[0]}!`;

        sensorDataRef = db.collection(COLLECTION_NAME);

        // const { serverTimestamp } = firebase.firestore.FieldValue;
        // createBeeRack.onclick = () => {
        //     beeRacksRef.add({
        //         uid: user.uid,
        //         temperature: 45,
        //         humidity: 25,
        //         "fan speed": 0.6,
        //         time: serverTimestamp(),
        //     });
        // }
        
        unsubscribe = sensorDataRef
        // .where("uid", "==", user.uid)
        // .orderBy('time')
        .onSnapshot(querySnapshot => {
            const temperatureData = querySnapshot.docs.map(doc => {
                return [Number(doc.data().time["seconds"]) - 1620565000, Number(doc.data().temperature)];
            });
            const fanSpeedData = querySnapshot.docs.map(doc => {
                return [Number(doc.data().time["seconds"]) - 1620565000, Number(doc.data().fan1Speed), Number(doc.data().fan2Speed)];
            });

            temperatureData.sort(function(a, b) {
                return a[0] - b[0];
            });
            fanSpeedData.sort(function(a, b) {
                return a[0] - b[0];
            });

            temperatureData.unshift(["time", "temperature"]);
            fanSpeedData.unshift(["time", "fan 1 speed", "fan 2 speed"]);

            console.log(temperatureData);
            console.log(temperatureData[0][1]);
            // console.log(temperatureData[0][1]["seconds"]);
            console.log(fanSpeedData);

            drawChart(temperatureData, "temperature_chart");
            drawChart(fanSpeedData, "fanspeed_chart");
        });

    } else {
        navbar.hidden = true;
        homepage.hidden = true;
        loginpage.hidden = false;
        unsubscribe && unsubscribe();
    }
});
