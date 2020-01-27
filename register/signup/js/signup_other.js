
var dbRootRef = firebase.firestore();

var mobile;

//send otp to mobile
function sendOTPToMobile() {
	document.getElementById('p_bar').style.display='block';

	///
	mobile = document.getElementById("number").value;

  
	$(document).ready(function() {
		$.ajax({
			type: "GET",
			url:
			"https://prayukti-admin.herokuapp.com/checkPhone?user_mobile=" +
			mobile,
			success: function(html) {
				console.log("Response is :" + html);
				if (!html) {
					setTimeout(function() {
						document.getElementById('p_bar').style.display='none';
						window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
							'size': 'normal',
							'callback': function(response) {
								console.log("success", response);
								document.getElementById('recaptcha-container').style.display='none';
								var appVerifier = window.recaptchaVerifier;

								firebase
								.auth()
								.signInWithPhoneNumber("+91" + mobile, appVerifier)
								.then(function(confirmationResult) {
									// SMS sent. Prompt user to type the code from the message, then sign the
									// user in with confirmationResult.confirm(code).

									window.confirmationResult = confirmationResult;
									document.getElementById('p_bar').style.display='none';
        
									document.getElementById("number-layout").style.display = "none";
									document.getElementById("sendotp-layout").style.display = "none";
									document.getElementById("otp-field-layout").style.display = "block";
									document.getElementById("sendotp-sbm-btn").style.display = "block";
        
									console.log(confirmationResult);
									console.log("OTP is Sent");
        
									window.confirmationResult = confirmationResult;
								})
								.catch(function(error) {
									// Error; SMS not sent
									// ...
									console.log(error);
								});
							},
							'expired-callback': function() {
								console.log("expired-callback");
							}
						});
						recaptchaVerifier.render().then(function(widgetId) {
							window.recaptchaWidgetId = widgetId;
						});
					},2000);

          
				} else {
					alert('mobile number already registered');
					document.getElementById("p_bar").style.display = "none";
					document.location.href = "/login";
				}
			}
		});
	});
  
}

//confirm opt code
function verifyOTP() {
	document.getElementById("p_bar").style.display = "block";

	var otp = document.getElementById("otp").value;

	confirmationResult.confirm(otp).then(function(result) {
		// User signed in successfully.
		var user = result.user;
		console.log(user);

		console.log(
			"Veri ID : " + confirmationResult.verificationId + "Code is :" + otp
		);

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				//User is signed in.
				//...

				var user_uid = user.uid;
				console.log(user_uid);
				dbRootRef
				.collection("user_database")
				.doc(user_uid)
				.get()
				.then(doc => {
					if (doc.exists) {
						console.log("sign up data",doc.data());
						var docData = doc.data();
						if (docData.sign_up_status) {
							document.location.href = "/account";
						} else {
							document.getElementById("p_bar").style.display = "none";

							document.getElementById("otp-field-layout").style.display =
							"none";
							document.getElementById("sendotp-sbm-btn").style.display =
							"none";
							document.getElementById("college-name-layout").style.display = 
							"block";
							document.getElementById("name-layout").style.display =
							"block";
							document.getElementById("email-layout").style.display =
							"block";
							document.getElementById("tshirt-layout").style.display =
							"block";
							document.getElementById("final-sbm-btn").style.display =
							"block";
						}
					} else {
						document.getElementById("p_bar").style.display = "none";

						document.getElementById("otp-field-layout").style.display =
						"none";
						document.getElementById("sendotp-sbm-btn").style.display =
						"none";
						document.getElementById("college-name-layout").style.display = 
						"block";
						document.getElementById("name-layout").style.display =
						"block";
						document.getElementById("email-layout").style.display =
						"block";
						document.getElementById("tshirt-layout").style.display =
						"block";
						document.getElementById("final-sbm-btn").style.display =
						"block";
					}
				});

				//start posting to database

				//end posting database
			} else {
				// User is signed out.
				// ...
			}
		});
     
	});
}

function regsiterOtherStudent() {
	document.getElementById('p_bar').style.display='block';
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.

			console.log(user);
			var user_uid = user.uid;
			console.log("user uid is :" + user_uid);

			var email = document.getElementById("email").value;

			var name = document.getElementById("name").value;
			var t_shirt_size = document.getElementById("t_shirt_size").value;
			var t_shirt_type = document.getElementById("t_shirt_type").value;

			var college_name = document.getElementById("college_name").value;
			var college_code = "O";

			//User can register
			//post user data to database

			console.log("Snap is Empty");

			var userDocData = {
				user_name: name,
				user_email: email,
				user_mobile: mobile,
				user_uid: user_uid,
				college_name: college_name,
				college_code: college_code,
				t_shirt_size: t_shirt_size,
				t_shirt_type: t_shirt_type,
				sign_up_status: true,
				timestamp: Date.now()
			};
			console.log(userDocData);
			dbRootRef
			.collection("user_database")
			.doc(user_uid)
			.set(userDocData)
			.then(function() {
				console.log("User Added to Database Succesfully");
				document.location.href = "/account";
				document.getElementById("p_bar").style.display = "none";
			})
			.catch(function(error) {
				document.getElementById('p_bar').style.display='none';
				console.error("Error writing document: ", error);
			});
        
       
		} else {
			// No user is signed in.
		}
	});
}
