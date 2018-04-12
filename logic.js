/* global moment firebase */
// Initialize Firebase
var config = {
 /*
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
  */
  
  apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
  
};

firebase.initializeApp(config);

// Create a variable to reference the database.
//KS note: looks like this is a ref to the root
var database = firebase.database();

// -----------------------------

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});

// ------------------------------------
// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

// --------------------------------------------------------------
// At the initial load, get a snapshot of the current data.
database.ref("/bidderData").on("value", function(snapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    // Set the initial variables for highBidder equal to the stored values.
    highBidder = snapshot.val().highBidder;
    highPrice = parseInt(snapshot.val().highPrice);

    // Change the HTML to reflect the initial value
    $("#highest-bidder").text(snapshot.val().highBidder);
    $("#highest-price").text("$" + snapshot.val().highPrice);

    // Print the initial data to the console.
    console.log(snapshot.val().highBidder);
    console.log(snapshot.val().highPrice);
  }

  // Keep the initial variables for highBidder equal to the initial values
  else {

    // Change the HTML to reflect the initial value
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text("$" + highPrice);
    // Print the initial data to the console.
    console.log("Current High Price");
    console.log(highBidder);
    console.log(highPrice);
  }

// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------
// Whenever a user clicks the click button
$("#submit-bid").on("click", function(event) {
  event.preventDefault();

  // Get the input values
  var bidderName = $("#bidder-name").val().trim();
  var bidderPrice = parseInt($("#bidder-price").val().trim());

  // Log the Bidder and Price (Even if not the highest)
  console.log(bidderName);
  console.log(bidderPrice);

  if (bidderPrice > highPrice) {

    // Alert
    alert("You are now the highest bidder.");

    // Save the new price in Firebase
    database.ref("/bidderData").set({
      highBidder: bidderName,
      highPrice: bidderPrice
    });

    // Log the new High Price
    console.log("New High Price!");
    console.log(bidderName);
    console.log(bidderPrice);

    // Store the new high price and bidder name as a local variable (could have also used the Firebase variable)
    highBidder = bidderName;
    highPrice = parseInt(bidderPrice);

    // Change the HTML to reflect the new high price and bidder
    $("#highest-bidder").text(bidderName);
    $("#highest-price").text("$" + bidderPrice);
  }
  else {

    // Alert
    alert("Sorry that bid is too low. Try again.");
  }

});

//==================================================
//==================================================
//CRUD and Firebase practice
//==================================================
//==================================================
var tblUsers = document.getElementById('tbl_users_list');
var databaseRef = firebase.database().ref('users/');
var rowIndex = 1;

databaseRef.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();

    var row = tblUsers.insertRow(rowIndex);
    var cellId= row.insertCell(0);
    var cellName = row.insertCell(1);
    var cellCode = row.insertCell(2);
    cellId.appendChild(document.createTextNode(childKey));
    cellName.appendChild(document.createTextNode(childData.user_name));
    cellCode.appendChild(document.createTextNode(childData.code_name));
    rowIndex = rowIndex + 1;
  });
});
//--------------------------------
function save_user(){
  var user_name = document.getElementById('user_name').value;
  var code_name = document.getElementById('code_name').value;
  var uid = firebase.database().ref().child('users').push().key;

  var data = {
    user_id: uid,
    user_name: user_name,
    code_name: code_name
  }

var updates = {};
updates['/users/' + uid] = data;
firebase.database().ref().update(updates);

alert('The user is created successfully!');
reload_page();
}
//--------------------------------
 function update_user(){
  var user_name = document.getElementById('user_name').value;
  var code_name = document.getElementById('code_name').value;
  var user_id = document.getElementById('user_id').value;

  var data = {
    user_id: user_id,
    user_name: user_name,
    code_name: code_name
  }

var updates = {};
updates['/users/' + user_id] = data;
firebase.database().ref().update(updates);

alert('The user is updated successfully!');

reload_page();
}
//------------------------------------------------
function delete_user(){
  var user_id = document.getElementById('user_id').value;

  firebase.database().ref().child('/users/' + user_id).remove();
  alert('The user is deleted successfully!');
  reload_page();
}
//--------------------------------------------
function reload_page(){
  window.location.reload();
}

//=============================================
//=============================================
//KS NEW TEST---FINALLY SUCCESS!!!
//=============================================
//=============================================

function create_deck(){
//later will make Date.now() uid instead....
//var deckKey = document.getElementById('deckTitle').value+Date.now();
var deckKey = document.getElementById('deckTitle').value+'uid';
var deckOwner = 'uid';
var deckTitle = document.getElementById('deckTitle').value;  
var deckNotes = document.getElementById('deckNotes').value;

var deckTitleRef = firebase.database().ref('deckTitles');

//  var newDeckRef = deckTitleRef.push();
var newDeckRef = deckTitleRef.child(deckKey);
  newDeckRef.set({
  deckKey: deckKey,
  deckOwner: deckOwner,
  deckTitle: deckTitle,
  deckNotes: deckNotes 
  });

  create_cardsByDeck()

}


//=============================================
//=============================================
//KS NEW TEST---part 2
//=============================================
//=============================================

function create_card(){
//later will make Date.now() uid instead....
//var deckKey = document.getElementById('deckTitle').value+Date.now();
//var cardKey = document.getElementById('deckTitle').value+'uid';
var cardOwner = 'uid';
var deckTitle = 'Japanese7';
var deckKey = 'Japanese7uid';
var cardQuestion = document.getElementById('cardQuestion').value;  
var cardAnswer = document.getElementById('cardAnswer').value;

var deckCardsRef = firebase.database().ref('deckCards');

var newCardRef = deckCardsRef.push();
var newCardRefKey = newCardRef.getKey();
  newCardRef.set({
  cardKey: newCardRefKey,
  cardOwner: cardOwner,
  deckTitle: deckTitle,
  deckKey: deckKey,
  cardQuestion: cardQuestion,
  cardAnswer: cardAnswer 
  });

console.log("newCardRefKey: " + newCardRefKey)
//need to create a variable that will switch out the deck value in the reference (i.e./Japanese7uid).
var cardsByDeckRef = firebase.database().ref('cardsByDeck/Japanese7uid');
//var newcardsByDeckRef = cardsByDeckRef.child(deckKey);
//var newcardsByDeckRef = cardsByDeckRef.push();
//var newcardsByDeckRef = cardsByDeckRef.child();
var newcardsByDeckRef = cardsByDeckRef.child('/' + newCardRefKey)


let cardKeysToDeck = { newCardRefKey };

  newcardsByDeckRef.set({
  cardKey: newCardRefKey,
  cardOwner: cardOwner,
  deckTitle: deckTitle,
  deckKey: deckKey,
  cardQuestion: cardQuestion,
  cardAnswer: cardAnswer 
  }
  );

//var messageRef = db.collection('rooms').doc('roomA')
//    .collection('messages').doc('message1');
//var alovelaceDocumentRef = db.doc('users/alovelace');

//create_cardsByDeck()

}


//=============================================
//=============================================
//KS NEW TEST---part 3
//=============================================
//=============================================

function create_cardsByDeck(){

//*****
//var cardsByDeckRef = firebase.database().ref('cardsByDeck');
//const cardsByDeck = cardsByDeckRef.child('deckCards/deckKey');

//var newcardsByDeckRef = cardsByDeckRef.child('deckCards/deckKey');


//******
//##################Deck Objects that show up###Currently Working
/*
var deckTitles = firebase.database().ref().child('deckTitles');
deckTitles.on('child_added', function(snap){
  console.log(snap.val());
});
*/
//##################
//$$$$$$$$$$$$$$$$$Card Objects that show up$$$urrently Working
/*
var deckCards = firebase.database().ref().child('deckCards');
deckCards.on('child_added', function(snap){
  console.log(snap.val());
});
*/
//$$$$$$$$$$$$$$$$$$$
//@@@@@@@@@@@@@@@@@@@@@combo Decks and Cards @@@ SUCCESS--IT WORKS!!! BUT not exactly how it should..
//b/c the filtering doesn't work..


const rootRef = firebase.database().ref();
const deckCards = rootRef.child('deckCards');
const deckTitles = rootRef.child('deckTitles');
const deckKey = 'Japanese7uid';


  deckCards.on('child_added', snap => {
  console.log(snap.val());
  let deckTitle = deckTitles.child(snap.val().deckKey).once('value', deckCards =>{
    console.log(deckCards.val());
  });
});




//@@@@@@@@@@@
/*
const deckKey = 'Japanese7uid';
const rootRef = firebase.database().ref();
const deckCardsRef = rootRef.child('deckCards');
const deckTitlesRef = rootRef.child('deckTitles');

function getCardsInDeck(deckKey, cb) {
  deckCardsRef.child(deckKey).on('child_added', snap => {
    let deckTitleRef = deckTitlesRef.child(snap.key);
    deckTitleRef.once('value', cb);
  });
}

getCardsInDeck(deckKey,snap => console.log(snap.val()));
//getCardsInDeck("Japanese7uid",snap => console.log(snap.val()));
*/

//@@@@@@@@@@@
/*
const deckKey = 'Japanese7uid';
const rootRef = firebase.database().ref();
const deckCardsRef = rootRef.child('deckCards');
const deckTitlesRef = rootRef.child('deckTitles');
 
deckCardsRef.child(deckKey).once('value', snap => console.log(snap.val()))
*/


}