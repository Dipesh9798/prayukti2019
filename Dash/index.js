var config = {
	apiKey: "AIzaSyAwRWIL3yjBjZ1EM94zBl-Di1Yu39BPlts",
	authDomain: "prayukti-26e14.firebaseapp.com",
	databaseURL: "https://prayukti-26e14.firebaseio.com",
	projectId: "prayukti-26e14",
	storageBucket: "prayukti-26e14.appspot.com",
	messagingSenderId: "640937198761"
};
firebase.initializeApp(config);
console.log("dbb");
var dbRootRef = firebase.firestore();
document.getElementById('p_bar').style.display='block';

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed inb.

		console.log(user);
		dbRootRef
		.collection("user_database")
		.doc(user.uid)
		.get()
		.then(doc => {
			if (!doc.exists) {
				console.log("Not exist");
				document.getElementById('p_bar').style.display='none';

			} else {
				dbRootRef
				.collection("event_registration_data")
				.where("user_uid", "==", user.uid)
				.get()
				.then(snapshot => {
					if (snapshot.empty) {
						console.log("Snapshot is empty");
						json_response = {
							user_data: doc.data()
							//reg_data: docReg.data()
						};
						console.log(json_response);
						document.getElementById('p_bar').style.display='none';

						//start display data

						document.getElementById("user_name").innerHTML =
						json_response.user_data.user_name;
						document.getElementById("userid").innerHTML =
						json_response.user_data.user_mboile;
						document.getElementById("tshirt").innerHTML =
						json_response.user_data.t_shirt_size;
						let events = json_response.reg_data.event_id;
						let table = document.getElementById("dataTable");
						let cost = 80 * events.length + 480;
						document.getElementById("cost").innerHTML = cost;


						for (i = 0; i < events.length; i++) {
							let row = table.insertRow(i + 1);
							row.setAttribute("id", events[i], 0);
							row.id = events[i];
							let cell1 = row.insertCell(0);
							let cell2 = row.insertCell(1);
							let eventsname = "";
							switch (events[i]) {
							case "001":
								eventsname = "HIT-MUN";
								break;
							case "002":
								eventsname = "Requizzit";
								break;
							case "003":
								eventsname = "Circuitrix";
								break;
							case "004":
								eventsname = "Mania C";
								break;
							case "005":
								eventsname = "Fun from Junk";
								break;
							case "006":
								eventsname = "Chamber of Secrets";
								break;
							case "007":
								eventsname = "De-Movier";
								break;
							case "008":
								eventsname = "La-Photography";
								break;
							case "009":
								eventsname = "Rhymn and Reason";
								break;
							case "010":
								eventsname = "Humorously";
								break;
							case "011":
								eventsname = "B-Plan";
								break;
							case "012":
								eventsname = "D-Constructeur";
								break;
							case "013":
								eventsname = "Battleground";
								break;
							case "014":
								eventsname = "Aqua Drift";
								break;
							case "015":
								eventsname = "Lakshya";
								break;
							case "016":
								eventsname = "Track-o-Bot";
								break;
							case "017":
								eventsname = "Dive Bomber";
								break;
							case "018":
								eventsname = "Udaan";
								break;
							case "019":
								eventsname = "Need For Speed";
								break;
							case "020":
								eventsname = "FIFA";
								break;
							case "021":
								eventsname = "PUBG";
								break;
							case "022":
								eventsname = "Paintball";
								break;
							case "023":
								eventsname = "Pradarshan";
								break;
							case "024":
								eventsname = "Crescent";
								break;
							case "025":
								eventsname = "Innovacion";
								break;
							default:
								eventsname = "no name";
							}
							cell1.innerHTML = eventsname;
      
							cell2.innerHTML =
							'<td><input type="submit" class="btn btn-danger" onclick="deleteEvent(this)" value="Delete" id=' +
							events[i] +
							"><td>";
							document.getElementById('p_bar').style.display='none';

						}
						document.getElementById('p_bar').style.display='none';



						//end display data


						return;
					}
					snapshot.forEach(docReg => {
						json_response = {
							user_data: doc.data(),
							reg_data: docReg.data()
						};
						console.log(json_response);

						//show event data start

						document.getElementById("user_name").innerHTML =
						json_response.user_data.user_name;
						document.getElementById("userid").innerHTML =
						json_response.user_data.user_mobile;
						document.getElementById("tshirt").innerHTML =
						json_response.user_data.t_shirt_size;
						let events = json_response.reg_data.event_id;
						let table = document.getElementById("dataTable");
						let cost = 80 * events.length + 480;
						document.getElementById("cost").innerHTML = cost;
						document.getElementById('p_bar').style.display='none';


						for (i = 0; i < events.length; i++) {
							let row = table.insertRow(i + 1);
							row.setAttribute("id", events[i], 0);
							row.id = events[i];
							let cell1 = row.insertCell(0);
							let cell2 = row.insertCell(1);
							let eventsname = "";
							switch (events[i]) {
							case "001":
								eventsname = "HIT-MUN";
								break;
							case "002":
								eventsname = "Requizzit";
								break;
							case "003":
								eventsname = "Circuitrix";
								break;
							case "004":
								eventsname = "Mania C";
								break;
							case "005":
								eventsname = "Fun from Junk";
								break;
							case "006":
								eventsname = "Chamber of Secrets";
								break;
							case "007":
								eventsname = "De-Movier";
								break;
							case "008":
								eventsname = "La-Photography";
								break;
							case "009":
								eventsname = "Rhymn and Reason";
								break;
							case "010":
								eventsname = "Humorously";
								break;
							case "011":
								eventsname = "B-Plan";
								break;
							case "012":
								eventsname = "D-Constructeur";
								break;
							case "013":
								eventsname = "Battleground";
								break;
							case "014":
								eventsname = "Aqua Drift";
								break;
							case "015":
								eventsname = "Lakshya";
								break;
							case "016":
								eventsname = "Track-o-Bot";
								break;
							case "017":
								eventsname = "Dive Bomber";
								break;
							case "018":
								eventsname = "Udaan";
								break;
							case "019":
								eventsname = "Need For Speed";
								break;
							case "020":
								eventsname = "FIFA";
								break;
							case "021":
								eventsname = "PUBG";
								break;
							case "022":
								eventsname = "Paintball";
								break;
							case "023":
								eventsname = "Pradarshan";
								break;
							case "024":
								eventsname = "Crescent";
								break;
							case "025":
								eventsname = "Innovacion";
								break;
							default:
								eventsname = "no name";
							}
							cell1.innerHTML = eventsname;
      
							cell2.innerHTML =
							'<td><input type="submit" class="btn btn-danger" onclick="deleteEvent(this)" value="Delete" id=' +
							events[i] +
							"><td>";
							document.getElementById('p_bar').style.display='none';
							console.log('dnsjndjn')

						}

						//show event data end


					});
				});
			}
		})
		.catch(err =>{
			console.log(err);
			document.getElementById('p_bar').style.display='none';

		});
	} else {
		// No user is signed in.

		console.log("User is not Signed In");
		document.location.href = "/login";
	}
});

function deleteEvent(rowid) {
	document.getElementById("p_bar").style.display = "block";

	var event_id = rowid.id;
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			//start deleting events
			dbRootRef
			.collection("event_registration_data")
			.where("user_uid", "==", user.uid)
			.get()
			.then(snapshot => {
				if (snapshot.empty) {
					console.log("No matching documents.");
					return;
				}
				snapshot.forEach(doc => {
					//delete function
					var amount = doc.data().payment_amount;
					if (doc.data().payment_status == false) {
						dbRootRef
						.collection("event_registration_data")
						.doc(doc.id)
						.update({
							event_id: firebase.firestore.FieldValue.arrayRemove(event_id),
							payment_amount: amount - 80
						})
						.then(() => {
							//event deleted succes fully
							console.log("event deleted succesfully");
							deleteRowById(event_id);
						})
						.catch(err => {
							console.log(err);
							document.getElementById('p_bar').style.display='none';

						});
					} else {
						console.log("Probolem in deleting events");
						document.getElementById('p_bar').style.display='none';
					}
				});
			})
			.catch(err => {
				console.log("Error getting documents", err);
				document.getElementById('p_bar').style.display='none';

			});
		} else {
			// No user is signed in.
			document.getElementById('p_bar').style.display='none';

		}
	});
}

function deleteRowById(rowid) {
	var row = document.getElementById(rowid);
	row.parentNode.removeChild(row);
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			dbRootRef.collection("event_registration_data").where("user_uid", "==", user.uid)
			.get()
			.then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					// doc.data() is never undefined for query doc snapshots
					document.getElementById("cost").innerHTML = doc.data().payment_amount;
					console.log(doc.data())
					document.getElementById("p_bar").style.display = "none";

                
				});
			})
			.catch(function(error) {
				console.log("Error getting documents: ", error);
				document.getElementById("p_bar").style.display = "none";

			});
		} else {
			// No user is signed in.
		}
	});
}

function signOut(){
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		//window.location('/');
	}).catch(function(error) {
		// An error happened.
		alert("Problem in signing out");
		console.log(error);
	});
}