var card_data = document.getElementById('card_data').value;
var statename = document.getElementById('statename').value;
var cityname = document.getElementById('cityname').value;
var districtname = document.getElementById('districtname').value;

var firebaseConfig = {
    apiKey: "AIzaSyCKzHbrwhVNcDZQ-fFeac9FraFB_o7MuOc",
    authDomain: "primeapp-d61e1.firebaseapp.com",
    projectId: "primeapp-d61e1",
    storageBucket: "primeapp-d61e1.appspot.com",
    messagingSenderId: "1021952189663",
    appId: "1:1021952189663:web:e7b7706a817eed2bb4f56a",
    measurementId: "G-WWRY08WE9P"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a Recaptcha verifier instance globally
// Calls submitPhoneNumberAuth() when the captcha is verified
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
        size: "invisible",
        callback: function(response) {
            submitPhoneNumberAuth();
        }
    }
);

// This function runs when the 'sign-in-button' is clicked
// Takes the value from the 'phoneNumber' input and sends SMS to that phone number
function submitPhoneNumberAuth() {
    var full_name = document.getElementById('full_name').value;
    if(full_name != '') {
        document.getElementById('sign-in-button').setAttribute('disabled','disabled');
        var phoneNumber = document.getElementById("phoneNumber").value;
        var appVerifier = window.recaptchaVerifier;
        var a;
        if(phoneNumber.slice(0,3) == '+91'){
            a = phoneNumber;
        } else {
            a = '+91' + phoneNumber;
        }
        firebase
            .auth()
            .signInWithPhoneNumber(a, appVerifier)
            .then(function(confirmationResult) {
                window.confirmationResult = confirmationResult;
                document.getElementById('sign-in-button').style.display="none";
                document.getElementById('code').style.display="block";
                document.getElementById('confirm-code').style.display="block";
            })
            .catch(function(error) {
                console.log(error);
            });
    } else {
        alert('Please enter the full name!!');
    }
}

// This function runs when the 'confirm-code' button is clicked
// Takes the value from the 'code' input and submits the code to verify the phone number
// Return a user object if the authentication was successful, and auth is complete
function submitPhoneNumberAuthCode() {
    var code = document.getElementById("code").value;
    document.getElementById('confirm-code').setAttribute('disabled','disabled');
    confirmationResult
        .confirm(code)
        .then(function(result) {
            var user = result.user;
            var full_name = document.getElementById('full_name').value;
            if(full_name != '') {
                // window.location.href = '/mobile/user-login/' + user.phoneNumber + '/' + user.uid + '/' + full_name ;
                var userdata = {
                    phone:user.phoneNumber,
                    tokken:user.uid,
                    full_name:full_name,
                    statename:statename,
                    cityname:cityname,
                    districtname:districtname
                }
                $.ajax({
                    url:`/mobile/user-login`,
                    dataType: "jsonp",
                    type:"POST",
                    data:userdata,
                    success: function(data){
                        console.log('success');
                        // location.reload();
                        // if(card_data == 'false'){
                            window.location.href = `/mobile/profile/loggedIn/${data.user_data.user_id}`;
                        // } else {
                        //     window.location.href = '/mobile/expanded_main';
                        // }
                    },
                    error: function(err){
                        console.log(err.status);
                    }
                });
            } else {
                alert('Please enter the full name!!');
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}