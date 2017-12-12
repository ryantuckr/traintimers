//firebase data
var config = {
    apiKey: "AIzaSyB_WtDcC7RtfZFOvMhXa_POzO18lGSgPMA",
    authDomain: "train-schedule-b8422.firebaseapp.com",
    databaseURL: "https://train-schedule-b8422.firebaseio.com",
    projectId: "train-schedule-b8422",
    storageBucket: "train-schedule-b8422.appspot.com",
    messagingSenderId: "171198462717"
};
//firebase initalize
firebase.initializeApp(config);
//set firebase as a variable
var database = firebase.database();

//:::onlick listener that does several things:::
$("#submitButton").on("click", function (event) {
    event.preventDefault();
//first get the user inputs and store as variables
    var trainInputName = $("#input-train").val();
    var trainInputDestination = $("#input-destination").val();
    var trainInputFirstTime = $("#input-time").val();
    console.log(trainInputFirstTime);
    var trainInputFreq = $("#input-freq").val();
//set up an oject to pass/push to firebase
    var newTrain = {
        train: trainInputName,
        destination: trainInputDestination,
        time: trainInputFirstTime,
        freq: trainInputFreq
    };
//pushing object to firebase
    database.ref().push(newTrain);

    //alert user that the schedule was added 
    alert(trainInputName + " Schedule Sucessfully Added");

    //empty fields after upclick 
    $("#input-train").val("");
    $("#input-destination").val("");
    $("#input-time").val("");
    $("#input-freq").val("");

});
//timer function to reload just the table data
//setTimeout(function(){
 //   window.location.reload(1);
// }, 30000);

//always be checking to see if any children are added
 database.ref().on("child_added", function (childSnapshot, prevChildKey) {
//when children are added, assign variables
    var trainInputName = childSnapshot.val().train;
    var trainInputDestination = childSnapshot.val().destination;
    var trainInputFirstTime = childSnapshot.val().time;
    var trainInputFreq = childSnapshot.val().freq;

    //train frequency from firebase/user input
    var timeFrequency = childSnapshot.val().freq;

    //first train time from firebase/user input
    var firstTrainTime = childSnapshot.val().time;
    
    //convert format in a variable
    var firstTimeConverted = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
    console.log("first train time converted" + firstTimeConverted);
    
    //get the current time, format it,  store as variable
    var currentTime = moment();
    console.log("current system time: " + moment(currentTime).format("hh:mm a"));
    
    //get difference in time from this moment to the first train time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("time difference: " + diffTime);

    //calc variables + math logic
    var tRemainder = diffTime % trainInputFreq;
    //calc variables + math logic
    var tMinutesTillTrain = trainInputFreq - tRemainder;
    console.log("Min till Arrival: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm a"));

//finally append a new row full of variables
    $(".table").append("<tr><td>" + trainInputName + "</td><td>" + trainInputDestination + "</td><td>" +
        trainInputFreq + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");


});