//var firebase = require('firebase');
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyAwRWIL3yjBjZ1EM94zBl-Di1Yu39BPlts",
  authDomain: "prayukti-26e14.firebaseapp.com",
  databaseURL: "https://prayukti-26e14.firebaseio.com",
  projectId: "prayukti-26e14",
  storageBucket: "prayukti-26e14.appspot.com",
  messagingSenderId: "640937198761"
};
firebase.initializeApp(config);

var dbRootRef = firebase.firestore();


let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET ROUTE for Home

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//GET ROUTE for Login

app.get("/login", (req, res) => {
  console.log("Page Displayed");
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      res.redirect("/account");
    } else {
      // No user is signed in.
      res.sendFile(path.join(__dirname + "/register/login/login.html"));
    }
  });
});


//POST ROUTE for Login

app.post("/login", (req, res) => {
 // var mobile = req.body.mobile;
  var verification = req.body.verification;
  var code = req.body.code;
  console.log(req.body);

  var credential = firebase.auth.PhoneAuthProvider.credential(verification, code);
  firebase.auth().signInAndRetrieveDataWithCredential(credential)
  .then(() =>{
    console.log("Signed from Backend in Succesfull");
    res.redirect('/account');
  })
  .catch(err =>{
    console.log("err "+err);
  });
  
});

//Sign Up GET Route Start

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname + "/register/signup/signup.html"));
});

// Sign Up POST ROUTE

app.get("/signup/hit", (req, res) => {
  res.sendFile(path.join(__dirname + "/register/signup/signup_hit.html"));
});

app.post("/signup/hit", (req, res) => {
  console.log(req.body);

  var verification = req.body.verification;
  var code = req.body.code;

  
  var mobile = req.body.mobile;
  var name = req.body.name;
  var email = req.body.email;
  var college_name = "HALDIA INSTITUTE OF TECHNOLOGY";
  var college_roll = req.body.college_roll;
  var college_code = "H";
  var t_shirt_size = req.body.t_shirt_size;
  var t_shirt_type = req.body.t_shirt_type;
  var user_profile_img = "";

  var credential = firebase.auth.PhoneAuthProvider.credential(verification, code);
  firebase.auth().signInAndRetrieveDataWithCredential(credential)
  .then(() =>{
     console.log("Signed from Backend in Succesfull");
    // res.redirect('/account');

    //start posting to database 

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        // ...

        //start posting to database 

        console.log(user);
        var user_uid = user.uid;
        console.log("user uid is :" +user_uid )

        dbRootRef.collection('user_database')
            .where("user_mobile", "==" , mobile)
            .where("college_roll_no", "==" , college_roll)
            .get()
            .then( snapshot =>{
              if(snapshot.empty){
                //User can register
                //post user data to database

                console.log("Snap is Empty");

                var userDocData = {
                  user_name: name,
                  user_email: email,
                  user_uid: user_uid,
                 // user_profile_img: user_profile_img,
                  college_name : college_name,
                  college_roll_no: college_roll,
                 // college_session: session,
                  college_code: college_code,
                //  t_shirt_size : t_shirt_size,
                //  t_shirt_type : t_shirt_type,
                  //"timestamp": Date.now
                };
                console.log(userDocData)
                dbRootRef
                  .collection("user_database")
                  .doc(user_uid)
                  .set(userDocData)
                  .then(function() {
                    console.log("User Added to Database Succesfully");
                    res.redirect("/account");
                  })
                  .catch(function(error) {
                    console.error("Error writing document: ", error);
                  });

              }
              else{
                //user alreday exist in database 
                res.send({status :400 , errorMessage : "User already exist in database"})
              }
            })
            .catch(err =>{
              console.log("Error is +" +err);
            });
        
        //end posting database 

      } else {
        // User is signed out.
        // ...
      }
    });
  });


});



//GET ROUTE for sign for other Student

app.get("/signup/other", (req, res) => {
  res.sendFile(path.join(__dirname + "/register/signup/signup_other.html"));
});

//POST ROUTE for sigup for Other Students

app.post("/signup/other", (req, res) => {
  var mobile = req.body.mobile;
  var name = req.body.name;
  var college_name = req.body.college_name;
  var college_roll = req.body.college_roll;
  var college_code = "O";

  var roll_no = req.body.roll_no;
  var email = req.body.email;

  dbRootRef
    .collection("user_database")
    .where("college_roll", "==", college_roll)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        //sign with phone
        var phoneNumber = getPhoneNumberFromUserInput();
        var appVerifier = window.recaptchaVerifier;
        firebase
          .auth()
          .signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(function(confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;

            //check user existance in database
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // User is signed in.

                dbRootRef
                  .collection("user_database")
                  .doc(user.uid)
                  .then(doc => {
                    if (!doc.exists) {
                      console.log("No such document!");
                      var userDocData = {
                        user_name: user_name,
                        user_email: email,
                        user_uid: user_uid,
                        mobile: mobile,
                        college_name: college_name,
                        college_roll_no: college_roll,
                        college_code: college_code
                      };
                      dbRootRef
                        .collection("user_database")
                        .doc(userDocData)
                        .set(userDocData)
                        .then(function() {
                          console.log("User Added to Database Succesfully");
                          res.redirect("/account");
                        })
                        .catch(function(error) {
                          console.error("Error writing document: ", error);
                        });
                    } else {
                      console.log("Document data:", doc.data());
                      res.redirect("/account");
                    }
                  })
                  .catch(err => {
                    console.log("Error getting document", err);
                    res.redirect("/signup");
                  });
                console.log("User Signed In");
              } else {
                // No user is signed in.
                console.log("User is Null");
              }
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
});

app.get("/account", (req, res) => {
  //check for auth
     res.sendFile(path.join(__dirname + "/Dash/index.html"));
});


//ACCOUNT USER JSON API

app.post("/ha", (req, res)=>{

  console.log("Got post req");
  console.log(req.body);
});

app.post("/account/user_info", (req, res) => {
  var json_response;

  //get user info

  var user_uid = req.body.user_uid;
  console.log(user_uid);

  dbRootRef
  .collection("user_database")
  .doc(user_uid)
  .get()
  .then(doc => {
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      dbRootRef
        .collection("event_registration_data")
        .where("user_uid", "==", user_uid)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log("dbjdbfjkbdNo matching documents.");
            json_response = {
              user_data: doc.data(),
              //reg_data: docReg.data()
            };
            console.log(json_response)
            res.json(json_response);
            return;

          }

          snapshot.forEach(docReg => {
            // console.log(doc.id, '=>', doc.data());

            json_response = {
              user_data: doc.data(),
              reg_data: docReg.data()
            };
            console.log(json_response)
            res.json(json_response);
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });

      //console.log('Document data:', doc.data());
    }
  })
  .catch(err => {
    console.log("Error getting document", err);
  });


});
app.use("/logout", (req, res) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          console.log("Signed Out Successfully");
          res.redirect("/");
        })
        .catch(error => {
          console.log("Logout error is :" + error);
        });
    } else {
      // No user is signed in.
      res.redirect("/login");
    }
  });
});

//logout function end

//Account Events Start
// GET ROUTE FOR ACCOUNT EVENT LIST

app.get("/account/events", (req, res) => {
  res.sendFile(path.join(__dirname + "/Dash/events.html"));
});

//Account Events End

//GET ROUTE Account/Yantriki

app.get("/account/events/yantriki", (req, res) => {
  res.sendFile(path.join(__dirname + "/Dash/yantriki.html"));
});

// GET ROUTE Account/single_event

app.get("/account/events/single", (req, res) => {
  res.sendFile(path.join(__dirname + "/Dash/single.html"));
});

//GET ROUTE Account/game
app.get("/account/events/game", (req, res) => {
  res.sendFile(path.join(__dirname + "/Dash/game.html"));
});
//GET ROUTE Account/fun
app.get("/account/events/fun", (req, res) => {
  res.sendFile(path.join(__dirname + "/Dash/fun.html"));
});
//GET ROUTE Account/other
app.get("/account/events/other", (req, res) => {
  res.sendFile(path.join(__dirname + "/Dash/other.html"));
});

//Account EVENT END

//select and register to event and post to database start

app.post("/account/event_registration/", (req, res) => {
  var event_id = req.body.id;
  console.log(event_id);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.

      var user_uid = user.uid;

      //check last date of registration
      dbRootRef
        .collection("registration_last_date")
        .doc("last_date_document")
        .get()
        .then(function(doc) {
          if (doc.exists) {
            var lastDateTimestamp = doc.data();
            console.log(lastDateTimestamp.timestamp);
            if (lastDateTimestamp.timestamp < Date.now()) {
              res.json("errorMessage : Last Day of Registration is Expired...");
            } else {
              //  res.json('Status : You can Register Now');

              dbRootRef
                .collection("event_registration_data")
                .where("user_uid", "==", user_uid)
                // .where("event_id", "array-contains", event_id)
                .get()
                .then(snapshot => {
                  if (snapshot.empty) {
                    dbRootRef
                      .collection("user_database")
                      .doc(user_uid)
                      .get()
                      .then(doc => {
                        if (doc.exists) {
                          var mobile_no = doc.data().user_mobile;
                          dbRootRef
                            .collection("event_registration_data")
                            .add({
                              event_id: [event_id],
                              user_uid: user_uid,
                              timestamp: Date.now(),
                              event_reg_id: "PRT"+Date.now,
                              event_reg_time: Date.now(),
                              payment_status: false,
                              payment_amount: 450 + 80
                            })
                            .then(ref => {
                              console.log("Added document with ID: ", ref.id);

                              res.redirect("/account");
                            })
                            .catch(error => {
                              console.log(error);
                            });
                          return;
                        } else {
                          console.log("no user found");
                        }
                      });
                    console.log("Does not exist");
                  }
                  snapshot.forEach(doc => {
                    var existingRegData = doc.data();
                    var docID = doc.id;
                    var event_array = existingRegData.event_id;
                    var payment_amount = existingRegData.payment_amount;

                    console.log(event_array.length);
                    //check condition for maximum event list
                    if (event_array.length > 5 || event_array.length == 5) {
                      res.send({
                        status: 400,
                        errorMessage:
                          "Sorry you can't not register to New Event.. You crossed your maximum event registration limit"
                      });
                    } else {
                      //res.json("message : Maximum limit is not Crossed");
                      //get category id using event id

                      dbRootRef
                        .collection("event_list")
                        .where("event_id", "==", event_id)
                        .get()
                        .then(snapshot => {
                          if (snapshot.empty) {
                            res.json(
                              "errorMessage : Event Doesn't Exist in Database"
                            );
                          } else {
                            snapshot.forEach(docData => {
                              var cat_id = docData.data().event_cat_id;

                              // res.json(docD.data());
                              console.log(cat_id);
                              // get event category limit and check for maximum condition
                              dbRootRef
                                .collection("event_cat")
                                .doc(cat_id)
                                .get()
                                .then(docData => {
                                  if (docData.exists) {
                                    var limit = docData.data().limit;
                                    console.log("Limit is :" + limit);

                                    var counter = 0;
                                    var count = 0;

                                    if (event_array.length == 0) {
                                      dbRootRef
                                        .collection("event_registration_data")
                                        .doc(docID)
                                        .update({
                                          event_id: firebase.firestore.FieldValue.arrayUnion(
                                            event_id
                                          ),
                                          payment_amount: payment_amount + 80
                                        })
                                        .then(() => {
                                          var json_response = {
                                            status: 200,
                                            message:
                                              "Successfully Regsitered to the event"
                                          };
                                          res.json(json_response);
                                        })
                                        .catch(err => {
                                          res.json(err);
                                        });
                                      return;
                                    }
                                    for (i = 0; i < event_array.length; i++) {
                                      dbRootRef
                                        .collection("event_list")
                                        .doc(event_array[i])
                                        .get()
                                        .then(docData => {
                                          if (
                                            docData.data().event_cat_id ==
                                            cat_id
                                          ) {
                                            counter++;
                                            //console.log(event_array[i]);
                                            console.log(docData.data());
                                            console.log(
                                              "Real Event Counter is :" +
                                                counter
                                            );
                                            console.log(
                                              " ml " +
                                                event_array.length +
                                                " i : " +
                                                i
                                            );
                                            if (counter >= limit) {
                                              console.log("err");
                                              return res.send({
                                                status: 400,
                                                errorMessage:
                                                  "Limit reached for this category"
                                              });
                                            }
                                          }
                                          if (count == event_array.length - 1) {
                                            //console.log("error 3");
                                            dbRootRef
                                              .collection(
                                                "event_registration_data"
                                              )
                                              .doc(docID)
                                              .update({
                                                event_id: firebase.firestore.FieldValue.arrayUnion(
                                                  event_id
                                                ),
                                                payment_amount:
                                                  payment_amount + 80
                                              })
                                              .then(() => {
                                                var json_response = {
                                                  status: 200,
                                                  message:
                                                    "Successfully Regsitered to the event"
                                                };
                                                res.json(json_response);
                                              })
                                              .catch(err => {
                                                res.json(err);
                                              });

                                            return; // res.json("errorMessage : You can Register to this event category");
                                          }
                                          count++;
                                        })
                                        .catch(err => console.log(err));
                                    }

                                    /*
                                        dbRootRef.collection('event_registration_data')
                                            .doc(docID)
                                            .update({
                                              event_id: firebase.firestore.FieldValue.arrayUnion(event_id)
                                            })
                                            .then(() =>{
                                              res.json("Successfully Regsitered to the event");
                                            })
                                            .catch(err =>{
                                              res.json(err);
                                            });
                                            */
                                  } else {
                                    // doc.data() will be undefined in this case
                                    console.log("No such document!");
                                  }
                                })
                                .catch(err => {
                                  res.json(err);
                                });
                            });
                          }
                        })
                        .catch(err => {
                          res.json(err);
                        });
                    }

                    dbRootRef
                      .collection("event_registration_data")
                      .where("user_uid", "==", user_uid)
                      .where("event_id", "array-contains", event_id)
                      .get()
                      .then(snapshot => {
                        if (snapshot.empty) {
                          return;
                        }
                        snapshot.forEach(doc => {
                          res.json(
                            "message : You have already registered to the selected event"
                          );
                        });
                      });

                    //  res.send(doc.id, '=>', doc.data())
                    // console.log(doc.id, '=>', doc.data());
                  });
                })
                .catch(error => {
                  console.log(error);
                });
            }
            // console.log("Document data:", doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    } else {
      // No user is signed in.
      console.log("User is Null");
    }
  });
});

//delete event from registartion data table

app.delete("/account", (req, res) => {
  var event_id = req.body.id;
  console.log(event_id);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var user_uid = user.uid;
    
    } else {
      // No user is signed in.
    }
  });
});

//select event to register and post to database end

app.get("/account/event_registertation/status", (req, res) => {
  res.json("regitration_status : sucesss");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/aboutus.html"));
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname + "/events.html"));
});

app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname + "/gallery.html"));
});

app.get("/team", (req, res) => {
  res.sendFile(path.join(__dirname + "/team.html"));
});

app.get("/riviera", (req, res)=>{
  res.sendFile(path.join(__dirname+"/riviera.html"));
});

//GET ROUTE FOR EVENT DESCRIPTION
app.get('/events/hitmun', (req, res)=>{
  res.sendFile(path.join(__dirname+"/hitmun.html"));
});

app.get('/events/circuitrix', (req, res)=>{
  res.sendFile(path.join(__dirname+"/circuitrix.html"));
});

app.get('/events/maniac', (req, res)=>{
  res.sendFile(path.join(__dirname+"/maniac.html"));
});

app.get('/events/requizzit', (req, res)=>{
  res.sendFile(path.join(__dirname+"/requizzit.html"));
});

app.get('/events/funfromjunk', (req, res)=>{
  res.sendFile(path.join(__dirname+"/funfromjunk.html"));
});

app.get('/events/alohamora', (req, res)=>{
  res.sendFile(path.join(__dirname+"/alohamora.html"));
});

app.get('/events/aquadrift', (req, res)=>{
  res.sendFile(path.join(__dirname+"/aquadrift.html"));
});

app.get('/events/battleground', (req, res)=>{
  res.sendFile(path.join(__dirname+"/battleground.html"));
});

app.get('/events/bplan', (req, res)=>{
  res.sendFile(path.join(__dirname+"/bplan.html"));
});

app.get('/events/crescent', (req, res)=>{
  res.sendFile(path.join(__dirname+"/crescent.html"));
});

app.get('/events/deconstructeur', (req, res)=>{
  res.sendFile(path.join(__dirname+"/deconstructeur.html"));
});

app.get('/events/demovier', (req, res)=>{
  res.sendFile(path.join(__dirname+"/demovier.html"));
});

app.get('/events/divebomber', (req, res)=>{
  res.sendFile(path.join(__dirname+"/divebomber.html"));
});

app.get('/events/frametoframe', (req, res)=>{
  res.sendFile(path.join(__dirname+"/f2f.html"));
});

app.get('/events/fifa', (req, res)=>{
  res.sendFile(path.join(__dirname+"/fifa.html"));
});

app.get('/events/innovacion', (req, res)=>{
  res.sendFile(path.join(__dirname+"/innovacion.html"));
});

app.get('/events/lakshya', (req, res)=>{
  res.sendFile(path.join(__dirname+"/lakshya.html"));
});

app.get('/events/humorously', (req, res)=>{
  res.sendFile(path.join(__dirname+"/humorously.html"));
});


app.get('/events/on_stage', (req, res)=>{
  res.sendFile(path.join(__dirname+"/on_stage.html"));
});

app.get('/events/laphoto', (req, res)=>{
  res.sendFile(path.join(__dirname+"/laphoto.html"));
});

app.get('/events/paintball', (req, res)=>{
  res.sendFile(path.join(__dirname+"/paintball.html"));
});

app.get('/events/nfs', (req, res)=>{
  res.sendFile(path.join(__dirname+"/nfs.html"));
});

app.get('/events/pradarshan', (req, res)=>{
  res.sendFile(path.join(__dirname+"/pradarshan.html"));
});

app.get('/events/pubg', (req, res)=>{
  res.sendFile(path.join(__dirname+"/pubg.html"));
});

app.get('/events/ranbhoomi', (req, res)=>{
  res.sendFile(path.join(__dirname+"/ranbhoomi.html"));
});

app.get('/events/rhymn', (req, res)=>{
  res.sendFile(path.join(__dirname+"/rhymn.html"));
});

app.get('/events/saudagar', (req, res)=>{
  res.sendFile(path.join(__dirname+"/saudagar.html"));
});

app.get('/events/trackobot', (req, res)=>{
  res.sendFile(path.join(__dirname+"/trackobot.html"));
});

app.get('/events/udaan', (req, res)=>{
  res.sendFile(path.join(__dirname+"/udaan.html"));
});

app.get('/events/yantriki', (req, res)=>{
  res.sendFile(path.join(__dirname+"/yantriki.html"));
});

//Store all HTML files in view folder.
app.use("/css", express.static(__dirname + "/css"));
app.use("/pdf", express.static(__dirname + "/pdf"));

app.use("/images", express.static(__dirname + "/images"));
app.use("/js", express.static(__dirname + "/js"));
app.use(express.static("register/login"));
app.use(express.static("register/"));
//app.use(express.static('Dash/'));
app.use(express.static(__dirname + "/Dash"));


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App is runnging at Port 3000");
});

/*

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': function(response) {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    }
  });

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
*/
