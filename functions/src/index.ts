// tutorial followed from https://medium.com/@savinihemachandra/creating-rest-api-using-express-on-cloud-functions-for-firebase-53f33f22979c

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

// initialize express server
const app = express();
const main = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
main.use(cors({origin: true}));

// add the path to receive request and parse body as JSON
main.use("/", app);
main.use(express.json());
main.use(express.urlencoded({extended: false}));

// initialize the database and the collection
const db = admin.firestore();
const sensorDataCollection = "sensor_data";

// define google cloud function name
export const webApi = functions.https.onRequest(main);

//
// CREATE REQUEST
//

interface SensorData {
    temperature: number,
    humidity: number,
    fanSpeed: number,
    sensorId: string,
    userId: string,
}

// Create new sensor data point
app.post("/sensor_data/new", async (req, res) => {
  try {
    const data: SensorData = {
      temperature: req.body["temperature"],
      humidity: req.body["humidity"],
      fanSpeed: req.body["fanSpeed"],
      sensorId: req.body["sensorId"],
      userId: req.body["userId"],
    };

    // Crate a new document in the collection
    const newDoc = await db.collection(sensorDataCollection).add(data);
    res.status(201).send(`Created a new sensor data point: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

//
// READ REQUEST
//

// read data for a specific sensor
app.get("/sensor_data/sensor/:sensorId", async (req, res) => {
  try {
    // Query the DB for specific sensor's data
    const querySnapshot = await db.collection(sensorDataCollection)
        .where("sensorId", "==", req.params.sensorId)
        .get();

    // Put the query results in a nice form
    const data: any[] = [];
    querySnapshot.forEach(
        (doc) => {
          data.push({
            data: doc.data(),
          });
        }
    );

    // Return the sensor data for the given sensor
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// read data for a specific user
app.get("/sensor_data/user/:userId", async (req, res) => {
  try {
    // Query the DB for specific user's data
    const querySnapshot = await db.collection(sensorDataCollection)
        .where("userId", "==", req.params.userId)
        .get();

    // Put the query results in a nice form
    const data: any[] = [];
    querySnapshot.forEach(
        (doc) => {
          data.push({
            data: doc.data(),
          });
        }
    );

    // Return the sensor data for the given user
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

//
// DELETE REQUEST
//
// WARNING: DO NOT USE THIS UNLESS YOU KNOW WHAT YOU ARE DOING

// Delete all sensor data for a user
app.delete("/user/:userId", async (req, res) => {
  // Delete the specific user's data from the DB
  db.collection(sensorDataCollection)
      .where("userId", "==", req.params.userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      })
      .then(() => res.status(204).send("Document successfully deleted!"))
      .catch(function(error) {
        res.status(500).send(error);
      });
});

//
// UPDATE REQUEST
//
// No update request supported yet
