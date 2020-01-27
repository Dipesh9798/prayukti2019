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

firebase.auth().onAuthStateChanged(function(user) {
document.getElementById('p_bar').style.display='block';
  if (user) {
    // User is signed in.

    var user_uid = user.uid;
    dbRootRef
      .collection("event_registration_data")
      .where("user_uid", "==", user.uid)
      .get()
      .then(function(querySnapshot) {
        if(!querySnapshot.empty){

          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
  
            var response = doc.data();
            let events = response.event_id;
            let table = document.getElementById("dataTable");
            let rows = table.getElementsByTagName("tr");
            var map = new Object();
            for(s of rows){
              map[s.id] = s.id;
            }
              for (j = 0; j < events.length; j++) {
                  if(map[events[j]]!=null){
                    deleteRowById(events[j]);
                  }
                  document.getElementById("p_bar").style.display = "none";
            }
			if(events.length==0)
                  document.getElementById("p_bar").style.display = "none";
          });
        }
        else{
          document.getElementById("p_bar").style.display = "none";

        }
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
        document.getElementById("p_bar").style.display = "none";
      });
  } else {
    // No user is signed in.
    document.getElementById('p_bar').style.display='none';

  }
});

function addEvent(eventID) {
  document.getElementById("p_bar").style.display = "block";

  var event_id = eventID.id;
  console.log(event_id);


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.

      //start registration to event

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
              // res.json("errorMessage : Last Day of Registration is Expired...");
              alert("Last Day of Registration is Expired...");
              document.getElementById("p_bar").style.display = "none";

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
                              event_reg_id: "PRT" + Date.now(),
                              event_reg_time: Date.now(),
                              payment_status: false,
                              payment_amount: 450 + 80
                            })
                            .then(ref => {
                              console.log("Added document with ID: ", ref.id);
                              document.getElementById("p_bar").style.display = "none";
                              alert('Succesfully register for new Events');
                              deleteRowById(event_id);

                              //   res.redirect("/account");
                            })
                            .catch(error => {
                              console.log(error);
                              document.getElementById("p_bar").style.display = "none";

                            });
                          return;
                        } else {
                          document.getElementById("p_bar").style.display = "none";

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
                      //   res.send({
                      //     status: 400,
                      //     errorMessage:
                      //       "Sorry you can't not register to New Event.. You crossed your maximum event registration limit"
                      //   });
                      alert(
                        "Sorry you can't not register to New Event.. You crossed your maximum event registration limit"
                      );
                      document.getElementById("p_bar").style.display = "none";

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
                                          alert(
                                            "Successfully Regsitered to the event"

                                          );
                                          deleteRowById(event_id);
                                          document.getElementById('p_bar').style.display='none';


                                        })
                                        .catch(err => {
                                          console.log(err);
                                          document.getElementById("p_bar").style.display = "none";

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
                                              document.getElementById("p_bar").style.display = "none";

                                              return alert(
                                                "Limit reached for this category"
                                              );
                                              //   return res.send({
                                              //     status: 400,
                                              //     errorMessage:
                                              //       "Limit reached for this category"
                                              //   });
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
                                                //    (json_response) var json_response = {
                                                //       status: 200,
                                                //       message:
                                                //         "Successfully Regsitered to the event"
                                                //     };
                                                //     res.json;
                                                alert(
                                                  "Successfully Regsitered to the event form cat"
                                                );
                                               deleteRowById(event_id);
                                                document.getElementById("p_bar").style.display = "none";
                                                return;

                                              })
                                              .catch(err => {
                                                console.log(err);
                                                document.getElementById("p_bar").style.display = "none";

                                              });

                                            return; // res.json("errorMessage : You can Register to this event category");
                                          }
                                          count++;
                                        })
                                        .catch(err => console.log(err));
                                    }

                                  } else {
                                    // doc.data() will be undefined in this case
                                    console.log("No such document!");
                                    document.getElementById("p_bar").style.display = "none";

                                  }
                                })
                                .catch(err => {
                                  // res.json(err);
                                  console.log(err);
                                  document.getElementById("p_bar").style.display = "none";

                                });
                            });
                          }
                        })
                        .catch(err => {
                          // res.json(err);
                          console.log(err);
                          document.getElementById("p_bar").style.display = "none";

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
                          //   res.json(
                          //     "message : You have already registered to the selected event"
                          //   );
                          alert(
                            "You have already registered to the selected event"
                          );
                          document.getElementById("p_bar").style.display = "none";

                        });
                      });

                    //  res.send(doc.id, '=>', doc.data())
                    // console.log(doc.id, '=>', doc.data());
                  });
                })
                .catch(error => {
                  console.log(error);
                  document.getElementById("p_bar").style.display = "none";

                });
            }
            // console.log("Document data:", doc.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            document.getElementById("p_bar").style.display = "none";

          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
          document.getElementById("p_bar").style.display = "none";

        });
    } else {
      // No user is signed in.
      document.getElementById("p_bar").style.display = "none";

    }
  });
}

function deleteRowById(rowid) { 

  var row = document.getElementById(rowid);
  row.parentNode.removeChild(row);
  document.getElementById('p_bar').style.display='none';

}
