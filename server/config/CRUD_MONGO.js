// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
// const dbName = 'myDatabase';

// MongoClient.connect(url, (err, client) => {
//   if (err) throw err;
//   const db = client.db(dbName);
//   // Perform CRUD operations here
//   // Create a new collection in the database called "users"
//   let col = db.createCollection("users");

//   // Insert documents into the "users" collection using insertOne() and insertMany() methods
//   let doc1 = {name:"John", age:30};
//   let doc2 = {name:"Jane", age:45};
//   col.insertOne(doc1).then((result)=> {
//     console.log(`Inserted document with name ${doc1.name} and age ${doc1.age}`);
//     return col.insertMany([doc2]);
//   }).then((res) =>{
//     console.log(`Inserted ${res.insertedCount} documents`);
//     console.log(res.ops[0]._id);
//     console.log(res.ops[1]._id);
//   });

//   // Retrieve data from the "users" collection using find(), sort(), limit() and skip() methods
//   col.find({}).sort({age: -1}).limit(1).skip(1).toArray().then((docs) => {
//     console.log("\nUsers sorted by age in descending order, limited to one record, skipping first record.");
//     docs.forEach((d) => console.dir(d));
//   });

// // Update a document in the "users" collection using updateOne() and updateMany() methods
//   col.updateOne(
//     {name: "John"},
//     {$set:{age:65}}
//   ).then(()=>console.log("Updated John's age to 65"))*/
//   .catch((e) => console.error(e))
//   .finally(() => client.close());

// });

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "myDatabase";

MongoClient.connect(url, (err, client) => {
  if (err) throw err;
  const db = client.db(dbName);
  // Perform CRUD operations here

  //   Insert data into a collection:
  const collection = db.collection("myCollection");
  collection.insertOne({ name: "John", age: 30 }, (err, result) => {
    if (err) throw err;
    console.log("Document inserted", result);
  });

  //   Find data in a collection:
  collection.find({ name: "John" }).toArray((err, docs) => {
    if (err) throw err;
    console.log(docs);
  });

  //   Update data in a collection:
  collection.updateOne(
    { name: "John" },
    { $set: { age: 35 } },
    (err, result) => {
      if (err) throw err;
      console.log("Document updated:", result);
    }
  );

  //   Delete data from a collection:
  collection.deleteOne({ name: "John" }, (err, result) => {
    if (err) throw err;
    console.log("Document deleted");
  });
});



// -===============================================================================================================================




// Inserting a document in collection Users of MongoDB without using ODM(mongoose):
const MongoClient = require("mongodb").MongoClient;
const URL = "mongodb://localhost:27017/";

MongoClient.connect(URL, function(error, db) {
  if (error) throw error;
  const dbo = db.db("mydb");
  const user = { name: "John", password: "helloworld" };
  const userImposter = { whatever: "doe", password: "okok" };

  //inserting user
  dbo.collection("users").insertOne(user, function(error, result) {
    if (error) throw error;
    console.log(result);
  });

  //inserting garbage user
  dbo.collection("users").insertOne(userImposter, function(error, result) {
    if (error) throw error;
    console.log(result);
  });
});



// Inserting document using an ODM such as Mongoose for MongoDB:
const mongoose = require("mongoose");
// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/mydb1", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

//user model
const User = mongoose.model("User", {
	username: { type: String },
	password: { type: String },
});

//new user object
const newUser = new User({
	username: "john-doe",
	password: "helloworld",
	hello: "hello",
});

//inserting/saving the document in collection
newUser.save(function (error, result) {
	if (error) {
		console.log(error);
	} else {
		console.log(result);
	}
});

// As we can see in the database the field hello is not inserted, it's because in our User model we don’t have such a field, and Mongoose mapped the data according to the User model to the database.
