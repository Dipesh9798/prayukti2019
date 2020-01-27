var dbRootRef = firebase.firestore();
document.getElementById('p_bar').style.display='block';

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// User is signed in.
		document.location.href="/account";
		document.getElementById('p_bar').style.display='none';

	} else {
		// No user is signed in.
		document.getElementById('p_bar').style.display='none';
	}
});


function validate() {
	var password = document.getElementById("password").value;
	if (password === "") {
		alert("Logged in successfully");
		window.location = "#";
		return false;
	} else {
		alert("Login failed!");
	}
}

function send_otp() {
	var number = document.getElementById("number").value;
	if (number.length === 10) {
		alert("OTP is sent");
		return false;
	} else {
		alert("Login failed! Enter valid Number");
	}
}

function sendOTPToMobile() {
	document.getElementById('p_bar').style.display='block';
	document.getElementById('submit').style.display='none';
	var mobile = document.getElementById("number").value;
	$.ajax({
		type: "GET",
		url:
		"https://prayukti-admin.herokuapp.com/checkPhone?user_mobile=" +
		mobile,
		success: function(html) {
			console.log("Response is :" + html);
			if (html==true || html=="true") {
				setTimeout(function() {
					document.getElementById('p_bar').style.display='none';
					window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
						'size': 'normal',
						'callback': function(response) {
							console.log("success", response);
							document.getElementById('recaptcha-container').style.display='none';
							document.getElementById('login').style.display='block';
							sendToMobile(mobile)
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
				alert("You are not regsitered")
				document.location.href = "/signup";
			}
		}
	});
}

function sendToMobile(mobile){
	appVerifier = window.recaptchaVerifier;
	firebase
	.auth()
	.signInWithPhoneNumber("+91" + mobile, appVerifier)
	.then(function(confirmationResult) {
		// SMS sent. Prompt user to type the code from the message, then sign the
		// user in with confirmationResult.confirm(code).

		window.confirmationResult = confirmationResult;

		document.getElementById('p_bar').style.display='none';
		document.getElementById("login_opt_field").style.display = "block";
		document.getElementById("login_opt_sbm").style.display = "block";
		document.getElementById("number-container").style.display = "none";
		document.getElementById("submit").style.display = "none";
		console.log(confirmationResult);
		console.log("OTP is Sent");

	})
	.catch(function(error) {
		// Error; SMS not sent
		// ...
		window.recaptchaVerifier.render().then(function(widgetId) {
			grecaptcha.reset(widgetId);
		});
		console.log(error);
	});
}

function verifySentOTP() {
	document.getElementById('p_bar').style.display='block';

	var codeValue = document.getElementById("password").value;
	
	confirmationResult.confirm(codeValue).then(function(result) {
		// User signed in successfully.
		var user = result.user;
		console.log("signed in :  "+user);
		console.log(
			"Veri ID : " + confirmationResult.verificationId + "Code is :" + codeValue
		);
		console.log("logged in");
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
				dbRootRef.collection("user_database")
				.doc(user.uid)
				.get()
				.then( doc =>{
					if(doc.exists){
						if(doc.data().sign_up_status){
							document.location.href = "/account";
						}
						else{
							document.location.href = "/signup";
							alert('You have not registered');
						}
					}
					else{
						document.location.href = "/signup";
						alert('You have not registered');
					}
				})
			} else {
				// No user is signed in.
			}
		});
		document.location.href="/account";
	});
}

function postToDatabase() {}
