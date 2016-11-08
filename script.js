// This section holds the *** GLOBAL *** variables and functions
  
	// variable : will hold the *** ID *** of the setInterval function,
		// so that clearInterval can be used on it
		var counting;
	//_________________


	// variables : determines whether the clock is *** ACTIVE or PAUSED ***
		var paused= false;
		var ticking= false;
	//_________________


	// variables : *** CURRENT TIME *** on the timer
		var timerMinutes=0;
		var timerSeconds=0;
		var onTimer=0;
	//_________________


	// variables : *** INITIALIZES *** the clock to run "work" first
		var work= true;
		var play= false;
	//_________________


	// timerVal : *** DETERMINES *** whether the clock is counting work or play
		function timerVal(){
			if (paused === true) {  // if it was paused
				console.log("was paused");
				paused= false;
				return onTimer;

			} else if((onTimer/1000)< 1 && work===true){  // if it's starting work
				console.log("counting work");
				var workTime= $("#workTimer").html()* 60000;
				console.log("workTime: "+workTime);

				// add appropriate classes to active elements
					$(".clock").removeClass("playActive").addClass("workActive");
					$(".work").removeClass("off").addClass("on");
					$(".play").removeClass("on").addClass("off");

				return workTime;

			} else if ((onTimer/1000)< 1 && play===true){ // if it's starting play
				console.log("counting play");
				var playTime= $("#playTimer").html()* 60000;
				console.log("playTime: "+playTime);

				// add appropriate classes to active elements
					$(".clock").removeClass("workActive").addClass("playActive");
					$(".play").removeClass("off").addClass("on");
					$(".work").removeClass("on").addClass("off");

				return playTime;

			} else { // if none of the above applies, there's a problem
				console.log("error");
				console.log("onTimer: "+onTimer);
				console.log("work: "+work);
				console.log("play: "+play);
				console.log("paused: "+paused);
				return 0;
			}
		};
	//_________________


	// getInitialTime : *** GETS CURRENT TIME ***
		// to be used in calculating the time remaining on the timer
		function getInitialTime(){
			var today= new Date();
			var now= today.getTime();
			console.log("initial time: "+now);
			return now;
		};
	//_________________


	// getTimeRemaining : *** CALCULATES TIME REMAINING *** in the timer
		// it will be called in the interval function, once a second,
		// to display the current time remaining
		// it also edits it to display in a readable format
		// Finally, it stops if timeRemaining=0
			function getTimeRemaining(initialTime, val){

				// Step 1: Figure out the current time, right now
					var today= new Date();
					var now= today.getTime();
				//________________________

				// Step 2: Calculate goal time (initial time + timer length)
					var goalTime= val + initialTime;
				//________________________

				// Step 3: Subtract current time from goal time
					var timeRemaining= goalTime-now;
				//________________________

				// Step 4: If the timer has not run out, edit to display in readable format,
				// and if it has, determine what it was counting and switch
					if (timeRemaining<1 && work== true) {  // if it was counting work, start play
						stop();
						playSound();
						work = false;
						play = true;

						// reset the clock with new values
						var newTime= getInitialTime();
						var newVal= timerVal();
						counting= setInterval(function(){
							getTimeRemaining(newTime, newVal);
						},1000);

					} else if(timeRemaining<1 && work== false) {
						stop();
						playSound();
						play = false;
						work = true;

						// reset the clock with new values
						var newTime= getInitialTime();
						var newVal= timerVal();
						counting= setInterval(function(){
							getTimeRemaining(newTime, newVal);
						},1000);

					} else {
						var seconds = Math.floor( (timeRemaining/1000) % 60);
						var	minutes = Math.floor( (timeRemaining/1000/60) % 60 );

						//this function adds a leading zero to the time
						//when necessary, so the time looks right
						function pad(n){
							var num= n.toString(10);
							return num.length== 1? "0" + num : num;
						};

						//runs the padding function on the seconds and minutes
						var finalSeconds= pad(seconds);
						var finalMinutes= pad(minutes);
						timerSeconds= seconds;
						timerMinutes= minutes;
						onTimer= timeRemaining;

						// Step 5: Display formatted time in timer
							$("#minutes").html(finalMinutes);
							$("#seconds").html(finalSeconds);
						//________________________
					}
				//________________________


				// Step 6: Return unformatted time
					return timeRemaining;
				//________________________

			};
	//_________________


	// stop : *** CLEAR INTERVAL FUNCTION ***, which stops the timer
		function stop(){
			clearInterval(counting);
			console.log("stopped");
			console.log("onTimer: "+onTimer);
		};
	//_________________


	// playSound : plays the *** AUDIO *** on call
		function playSound() {
		    $('.audio')[0].volume = 1;
		    $('.audio')[0].play();
	  	}
	//_________________
// _____________________________________________________________


$(document).ready(function(){
	$(".subheader, #controlPanel").hide();

	// on click to play, start timer
	$("#play").click(function(){

		// Initial Setup
		$(".subheader").fadeIn();
			console.log("play was clicked");
			ticking= true;
			$("#play").prop("disabled", true);
			$("#pause").prop("disabled", false);
		//_____________________________

		// Step 1: determine the length of the timer
			var val= timerVal();
		//_____________________________


		// Step 2: get the time of the click
			var initialTime= getInitialTime();
		//_____________________________


		// Step 3: call countDown function
			counting= setInterval(function(){
				getTimeRemaining(initialTime, val);
			},1000);
		//_____________________________
	});


	// on click to pause, stop timer
	$("#pause").click(function(){
		paused= true;
		ticking= false;
		stop();
		$("#play").prop("disabled", false);
		$("#pause").prop("disabled", true);
	});


	// on click to reset, stop timer and restart from current section
	$("#reset").click(function(){
		// if it's running (not paused), stop interval and reset from time of click
		// if it is paused, clearInterval and start clock from time of click using correct length
			if(ticking== true){
				// Initial Setup: make play active and pause inactive, because we want to autoplay
					console.log("reset was clicked");
					stop();
					onTimer=0;
					ticking= true;
					pause= false;
					$("#play").prop("disabled", true);
					$("#pause").prop("disabled", false);
				//________________________________________
			
				// Step 1: determine the length of the timer
					var val= timerVal();
				//_____________________________
			
			
				// Step 2: get the time of the click
					var initialTime= getInitialTime();
				//_____________________________
			
			
				// Step 3: call countDown function
					counting= setInterval(function(){
						getTimeRemaining(initialTime, val);
							},1000);
				//_____________________________
			} else{
				stop();
				ticking= true;
				paused= false;
				$("#play").prop("disabled", true);
				$("#pause").prop("disabled", false);

				if (work== true) {
					val= $("#workTimer").html()* 60000;
					var initialTime= getInitialTime();
					counting= setInterval(function(){
						getTimeRemaining(initialTime, val);
					},1000);
				} else{
					val= $("#playTimer").html()* 60000;
					var initialTime= getInitialTime();
					counting= setInterval(function(){
						getTimeRemaining(initialTime, val);
					},1000);
				}
			}
	});


	// on click to controls button, toggle display of controls
	$("#controlToggle").click(function(){
		$("#controlPanel").fadeToggle();
	});


	// This section is for the + and - buttons
		// Work Span +
		$("#workPlus").click(function(){

			// add time
				var workSpan= parseInt($("#workTimer").html());
				$("#workTimer").html(++workSpan);

			// if the timer was counting this when the button was pushed,
			// restart the timer with the new time
				if (ticking== true && work== true) {

					stop();
					onTimer= workSpan;

					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				} else if (paused== true && work== true) {

					stop();
					onTimer= 0;
					paused= false;
					ticking= true;
					$("#play").prop("disabled", true);
					$("#pause").prop("disabled", false);


					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				}

		});

		// Work Span -
		$("#workMinus").click(function(){

			// subtract time
				var workSpan= parseInt($("#workTimer").html());
				if (workSpan > 1) {
					$("#workTimer").html(--workSpan);
				};

			// if the timer was counting this when the button was pushed,
			// restart the timer with the new time
				if (ticking== true && work== true) {


					// clearInterval so that the timer stops
						stop();

						onTimer= workSpan;

					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				} else if (paused== true && work== true) {
					onTimer= 0;
					paused= false;
					ticking= true;
					$("#play").prop("disabled", true);
					$("#pause").prop("disabled", false);


					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				}
		});

		// Play Span +
		$("#playPlus").click(function(){

			// add time
				var playSpan= parseInt($("#playTimer").html());
				$("#playTimer").html(++playSpan);


			// if the timer was counting this when the button was pushed,
			// restart the timer with the new time
				if (ticking== true && play== true) {
					stop();
					onTimer= workSpan;

					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				} else if (paused== true && play== true) {
					stop();
					onTimer= 0;
					paused= false;
					ticking= true;
					$("#play").prop("disabled", true);
					$("#pause").prop("disabled", false);


					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				}

		});

		// Play Span -
		$("#playMinus").click(function(){

			// subtract time
				var playSpan= parseInt($("#playTimer").html());
					if (playSpan > 1) {
					$("#playTimer").html(--playSpan);
				};

			// if the timer was counting this when the button was pushed,
			// restart the timer with the new time
				if (ticking== true && play== true) {
					stop();
					onTimer= workSpan;

					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				} else if (paused== true && play== true) {
					stop();
					onTimer= 0;
					paused= false;
					ticking= true;
					$("#play").prop("disabled", true);
					$("#pause").prop("disabled", false);


					// Step 1: determine the length of the timer
						var val= timerVal();
					//_____________________________


					// Step 2: get the time of the click
						var initialTime= getInitialTime();
					//_____________________________


					// Step 3: call countDown function
						counting= setInterval(function(){
							getTimeRemaining(initialTime, val);
						},1000);
					//_____________________________

				}
		});
	// _______________________________________


});