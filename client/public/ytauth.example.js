document.addEventListener("DOMContentLoaded", function(event) { 
    apiKey = 'YOUR_API_KEY';
    discoveryDocs = ["YOUR_DISCOVER_DOCS"];
    clientId = 'YOUR_CLIENT_ID';
    scopes = "YOU_SCOPES";
    authorizeButton = document.getElementById('YOUR_BUTTON_ID');
    handleClientLoad();
});


function handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', initClient);
}


function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleLogInOut;
        // signoutButton.onclick = handleSignoutClick;
    });
}


function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.innerHTML = 'Signout';
        makeApiCall();
    } else {
        authorizeButton.innerHTML = 'Sign In';
    }
}


function handleLogInOut(event) {
    if(gapi.auth2.getAuthInstance().isSignedIn.get()) {
        gapi.auth2.getAuthInstance().signOut();
    }
    else {
        gapi.auth2.getAuthInstance().signIn();
    }
}


function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}


function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}


// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
    let token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    fetch(`http://localhost:5000/getApplicationPlaylistId?token=${token}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetch(`http://localhost:5000/itemsFromPlaylistId?playlistid=${data}&token=${token}`)
        .then(response => response.json())
        .then(data2 => console.log(data2));
    });
}