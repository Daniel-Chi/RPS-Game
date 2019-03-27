//initialize Firebase
var config = {
    apiKey: "AIzaSyDz3m6nwl_pDay_k4cT-_m1af_wG1Fm-tE",
    authDomain: "train-scheduler-446d5.firebaseapp.com",
    databaseURL: "https://train-scheduler-446d5.firebaseio.com",
    projectId: "train-scheduler-446d5",
    storageBucket: "",
    messagingSenderId: "271473118804"
};
firebase.initializeApp(config);
var database = firebase.database();
//initialize variables
let name = "";
let dest = "";
let ftime = "";
let freq = "";
//form inputs into Firebase
$(".btn").on("click", function (evt) {
    evt.preventDefault();
    name = $("#inputName").val().trim();
    dest = $("#inputDest").val().trim();
    ftime = $("#inputStart").val().trim();
    freq = $("#inputFreq").val().trim();
    database.ref("/trains").push({
        name: name,
        dest: dest,
        ftime: ftime,
        freq: freq,
    });
});
//function for calculating next arrival
function next(start, frequency) {
    //hypothetical upper limit for next arrival
    let momenthigh = moment().add(frequency, "minutes");
    //setup to find and remove remainder
    let currenttime = moment().format("HH:mm");
    let diff = parseInt(moment(currenttime, "HH:mm").diff(start, "minutes"));
    let lastnightdiff = diff+1440;
    //for normal diff
    if (diff>0){
        let remainder = diff % frequency;
        return momenthigh.subtract(remainder, "minutes");
    }
    //for if running from last night
    else {
        let remainder = lastnightdiff % frequency;
        return momenthigh.subtract(remainder, "minutes")
    };
};

database.ref("/trains").on("child_added", function (snapshot) {
    let strt = moment(snapshot.val().ftime, "HH:mm");
    let frequ = snapshot.val().freq;
    let nextarr = next(strt, frequ);
    let away = nextarr.diff(moment(), "m");
    let col1 = $("<td>").text(snapshot.val().name);
    let col2 = $("<td>").text(snapshot.val().dest);
    let col3 = $("<td>").text(snapshot.val().freq);
    let col4 = $("<td>").text(nextarr.format("hh:mm A"));
    let col5 = $("<td>").text(away);
    let newrow = $("<tr>").append(col1, col2, col3, col4, col5);
    $("#table-data").append(newrow);
});