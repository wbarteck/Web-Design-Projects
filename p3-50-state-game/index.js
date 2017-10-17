// These are all the states.
// Use this list if you want to test out the full game
var abvMap = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District Of Columbia": "DC",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
};
var STATE = {
	start: 0,
	game: 1,
	over: 2
};
var state = STATE.start;

var maxTime = 20;
var time = 0;

$("#game").toggle();
$("#over").toggle();

$("#start").on("click", function() {
	init();
});

$("#restart").on("click", function() {
	init();
});

function init() {
	state = STATE.game;
	clearBoard();
	time = maxTime;
	$("#game").show();
	$("#intro").hide();
	$("#timer").text(time.toString());
	$("#input").prop('disabled', false);
	$("#input").val("");
	$("#container").show();
	$("#over").hide();
	$("#input").focus();
	$("#info").text("Hover over a State to see info.");
}

$("#input").on("keyup", function() {
	for (var key in abvMap) {
		
		if (key == $("#input").val()) {
			//success
			addState($("#input").val());
			$("#input").val("");
		}
	}
});

function addState(message) {
	$("#container").append($('<div>').attr('class','state').attr('id', 'state-'+message).text(message));
	if ($("#container div").length == 50) {
		endGame();
	}
}

function clearBoard() {
	$("#container").empty();
}

$("#container, #missed").on('mouseenter', '.state',
	function() {
		var s = $(this).attr('id').substring(6);
		$.get("https://congress.api.sunlightfoundation.com/legislators?state=" + abvMap[s], function(data) {
			var senators = s + " senators: ";
      for(var i = 0; i < data.results.length; i++) {
				var senator = data.results[i];
				if (i== data.results.length-1) {
					senators += senator.first_name+" "+senator.last_name;
				} else {
					senators += senator.first_name+" "+senator.last_name+", ";
				}
			}
			$("#info").text(senators);
    });
	}
);

$("#container,#missed").on('mouseleave', '.state',
	function() {
		$("#info").text("Hover over a state for information");
	}
);

function countDown() {
	if (state == STATE.game) {
		time -= 1;
		
		if (time <= 0) {
			time = 0;
			endGame();
		}
	}
	
	$("#timer").text(time.toString());
}
setInterval(countDown, 1000);

function endGame() {
	$("#input").prop('disabled', true);
	
	state = STATE.over;
	
	var correct = $("#container div").length;
	$("#container").hide();
	$("#over").show();
	
	if (correct == 50) { //win
		$("#lost").hide();
		$("#missed").hide();
		$("#win").show();
		$("#score").text("Score: 50/50");
	} else { //lose
		$("#lost").show();
		$("#missed").show();
		$("#win").hide();
		$("#score").text("Score: " + correct + "/50");
		var arr = [];
		for (var key in abvMap) {
			if ($("#state-"+key).length == 0) {
				arr.push(key);
				$("#missed").append($('<div>').attr('class','state missed').attr('id', 'state-'+key).text(key));
			}
		}
	}
	
	$("#info").text("Press Restart to play again.");
}

/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setTimeout).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must be stopped as well.
 *
 */
