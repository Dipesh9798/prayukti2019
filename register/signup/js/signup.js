var dbRootRef = firebase.firestore();

var mobile;
function validate() {
	var name = document.getElementByClass("input100").value;
	var number = document.getElementByClass("input100").value;
	var name_college = document.getElementByClass("input100").value;
	var class_roll = document.getElementByClass("input100").value;
	var email = document.getElementByClass("input100").value;
	var password = document.getElementByClass("input100").value;
	var confirm_password = document.getElementByClass("input100").value;
	if (
		name === " " ||
		number === 10 ||
		name_college === " " ||
		class_roll === " " ||
		email === " " ||
		password === " " ||
		confirm_password === " "
	) {
		alert("Mandatory Fields");
		return false;
	}
}

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

	///

  
}

function verifyOTP() {
	document.getElementById('p_bar').style.display='block';

	var otp = document.getElementById("otp").value;

	confirmationResult.confirm(otp).then(function(result) {
		// User signed in successfully.
		var user = result.user;
		console.log(user);

		mobile = document.getElementById("number").value;


		console.log(
			"Veri ID : " + confirmationResult.verificationId + "Code is :" + otp
		);

		console.log("logged ");
		document.getElementById('p_bar').style.display='none';
      
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				//User is signed in.
				//...

				var user_uid = user.uid;
				console.log(user_uid);
				dbRootRef.collection('user_database')
				.doc(user_uid)
				.get()
				.then(doc =>{
					if(doc.exists){
						var docData = doc.data();
						if(docData.sign_up_status){
							document.location.href="/account";
						}
						else{
							document.getElementById("otp-field-layout").style.display = "none";
							document.getElementById("sendotp-sbm-btn").style.display = "none";
							document.getElementById("name-layout").style.display = "block";
							document.getElementById("email-layout").style.display = "block";
							document.getElementById("roll-layout").style.display = "block";
							document.getElementById("tshirt-layout").style.display = "block";
							document.getElementById("final-sbm-btn").style.display = "block";
                 
						}
					}
					else{
						document.getElementById("otp-field-layout").style.display = "none";
						document.getElementById("sendotp-sbm-btn").style.display = "none";
						document.getElementById("name-layout").style.display = "block";
						document.getElementById("email-layout").style.display = "block";
						document.getElementById("roll-layout").style.display = "block";
						document.getElementById("tshirt-layout").style.display = "block";
						document.getElementById("final-sbm-btn").style.display = "block";
               
					}
				})

				//start posting to database 
				//end posting database 

			} else {
				// User is signed out.
				// ...
			}
		});



		//start posting to database 


		// end posting to database

		//   //post credential to login route

		//   var method = method || "post"; // Set method to post by default if not specified.

		//   // The rest of this code assumes you are not using a library.
		//   // It can be made less wordy if you use one.

		//   var mobile = document.getElementById("number").value;
		//   var email = document.getElementById("email").value;
		//   var roll1 = document.getElementById("roll1").value;
		//   var roll2 = document.getElementById("roll2").value;
		//   var roll3 = document.getElementById("roll3").value;
		//   var roll4 = document.getElementById("roll4").value;

		//   var name = document.getElementById("name").value;
		//   var t_shirt_size = document.getElementById("t_shirt_size").value;
		//   var t_shirt_type = document.getElementById("t_shirt_type").value;

		//   var form = document.createElement("form");
		//   form.setAttribute("method", method);
		//   form.setAttribute("action", "/signup/hit");

		//   var mobileV = document.createElement("input");
		//   mobileV.type = "text";
		//   mobileV.name = "mobile";
		//   mobileV.value = mobile;

		//   var verificationId = document.createElement("input");
		//   verificationId.type = "text";
		//   verificationId.name = "verification";
		//   verificationId.value = confirmationResult.verificationId;

		//   var code = document.createElement("input");
		//   code.type = "text";
		//   code.name = "code";
		//   code.value = otp;

		//   var emailD = document.createElement("input");
		//   emailD.type = "text";
		//   emailD.name = "email";
		//   emailD.value = email;

		//   var rollT = document.createElement("input");
		//   rollT.type = "text";
		//   rollT.name = "student_type";
		//   rollT.value = roll1;

		//   var rollV = document.createElement("input");
		//   rollV.type = "text";
		//   rollV.name = "college_roll";
		//   rollV.value = roll2 + "/" + roll3 + "/" + roll4;

		//   var nameV = document.createElement("input");
		//   nameV.type = "text";
		//   nameV.name = "name";
		//   nameV.value = name;

		//   var t_shirt_sizeV = document.createElement("input");
		//   t_shirt_sizeV.type = "text";
		//   t_shirt_sizeV.name = "t_shirt_size";
		//   t_shirt_sizeV.value = t_shirt_size;

		//   var t_shirt_typeV = document.createElement("input");
		//   t_shirt_typeV.type = "text";
		//   t_shirt_typeV.name = "t_shirt_type";
		//   t_shirt_typeV.value = t_shirt_type;

		//   form.appendChild(verificationId);
		//   form.appendChild(code);
		//   form.appendChild(mobileV);
		//   form.appendChild(emailD);
		//   form.appendChild(rollT);
		//   form.appendChild(rollV);
		//   form.appendChild(nameV);
		//   form.appendChild(t_shirt_sizeV);
		//   form.appendChild(t_shirt_typeV);

		//   document.body.appendChild(form);
		//   form.submit();
		// });
	});
}

function registerUser(){
	document.getElementById('p_bar').style.display='block';
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.

     
			console.log(user);
			var user_uid = user.uid;
			console.log("user uid is :" +user_uid )

			var email = document.getElementById("email").value;
			var roll1 = document.getElementById("roll1").value;
			var roll2 = document.getElementById("roll2").value;
			var roll3 = document.getElementById("roll3").value;
			var roll4 = document.getElementById("roll4").value;
			var college_roll = roll2+"/"+roll3+"/"+roll4;
    
			var name = document.getElementById("name").value;
			var t_shirt_size = document.getElementById("t_shirt_size").value;
			var t_shirt_type = document.getElementById("t_shirt_type").value;

			var college_name = "HALDIA INSTITUTE OF TECHNILOGY";
			var college_code ="H"

			$(document).ready(function() {
				$.ajax({
					type: "GET",
					url:
					"https://prayukti-admin.herokuapp.com/checkRoll?college_roll_no=" + college_roll,
					success: function(html) {
						console.log("Response is :" + html);
						if (!html) {

							console.log("Snap is Empty");
      
							var userDocData = {
								user_name: name,
								user_email: email,
								user_mobile: mobile,
								user_uid: user_uid,
								college_name : college_name,
								college_roll_no: college_roll,
								college_code: college_code,
								t_shirt_size : t_shirt_size,
								t_shirt_type : t_shirt_type,
								sign_up_status: true,
								"timestamp": Date.now()
							};
							console.log(userDocData)
							dbRootRef
							.collection("user_database")
							.doc(user_uid)
							.set(userDocData)
							.then(function() {
								console.log("User Added to Database Succesfully");
								document.location.href = "/account";
								document.getElementById('p_bar').style.display='none';
  
							})
							.catch(function(error) {
								console.error("Error writing document: ", error);
								document.getElementById('p_bar').style.display='none';

							});

						}
						else{
							alert("Roll No already exist");
							document.getElementById('p_bar').style.display='none';

						}
					}
				});

			});


		} else {
			// No user is signed in.
			document.getElementById('p_bar').style.display='none';

		}
	});
 
}
