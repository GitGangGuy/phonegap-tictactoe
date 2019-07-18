var paused = true;
$().ready(function() {
	function gameAnalyser() {
		let fields = $(".cell").attr("data-owner");
		let winner = [];
		let newfields = fields.map(function(val,i,arr) {
			if (val != "n") {
				if (i % 3 == 0) { // Field is 1, 3, or 6
					if (arr[i + 1] == val && arr[i + 2] == val) { // Row = win
						winner.push(val);
						return "Win";
					} else if (i == 0) { // If index is 0: check for diagonal topleft-bottomright
						if (arr[4] == val && arr[8] == val) {
							winner.push(val);
							return "Win";
						}
					} else if (i == 6) { // if index is 6: check for diagonal bottomleft-topright
						if (arr[4] == val && arr[2] == val) {
							winner.push(val);
							return "Win";
						}
					}
				}
				if (i < 3) { // Field is 1,2 or 3
					if (arr[i + 3] == val && arr[i + 6] == val) {
						winner.push(val);
						return "Win";
					}
				}
			}
			return "Nope";
		});
		winner.filter(function(val,i,arr) {
			return arr.indexOf(val) == i;
		});
		console.log("GameAnalyser Reports: \nFields: ");
		console.log(fields);
		console.log("Winner:");
		console.log(winner);
		console.log("Newfields:");
		console.log(newfields);
		if (newfields.includes("Win")) {
			if (winner.length > 1) {
				return 0;
			} else if (winner.length < 1) {
				return 4;
			} else if (winner[0] == "x") {
				return 1;
			} else if (winner[0] == "o") {
				return 2;
			} else {
				return 4;
			}
		} else {
			return 3;
		}
	}
	function gameAi() {
		return new Promise(function (resolve, reject) {
			let chooseables = [];
			$(".cell[data-owner=n]").each(function (el) {
				chooseables.push("." + el.classList.item(1));
			});
			if (chooseables.length > 0) {
				let randomi = chooseables[Math.floor(Math.random() * chooseables.length)];
				$(randomi).attr("data-owner", "o");
				$(randomi).css("background-color", "#bb7064");
				resolve();
			} else {
				reject();
			}
		});
	}
	function gameEnd(result) {
		$(".cell").off("click",gameClick);
		$(".cell").attr("data-owner","n");
		$(".overlay").css("display","flex");
		if (result == 0) { // draw
			$(".status").html("Draw");
		} else if (result == 1) { // win
			$(".status").html("Win!");
		} else if (result == 2) { // loose
			$(".status").html("Lost");
		} else {
			$(".status").html("Play");
			alert("error");
		}
		$(".overlay").removeClass("fadeOut");
		$(".overlay").addClass("fadeIn");
		paused = true;
	}
	function gameClick() {
		if (!paused) {
			$(".cell[data-owner=n]").removeClass("blink"); // Remove blink effect of all cells
			$(".cell").off("click", gameClick); // Remove all event listeners attached to .cell s which are binded to the click event
			$(this).attr("data-owner", "x"); // Add owner tag to the clicked Element
			$(this).css("background-color", "#64bb70");
			let res = gameAnalyser();
			if (res == 3) {
				gameAi().then(function () {
					// Check the game stats, end game or invoke loop
					let res = gameAnalyser();
					if (res == 3) {
						gameLoop();
					} else {
						setTimeout(function () {
							gameEnd(res);
						}, 200);
					}
				}).catch(function () {
					gameEnd(0); // Draw because no fields left
				}); // let AI play its turn
			} else {
				setTimeout(function () {
					gameEnd(res);
				}, 200);
			}
		}
	}
	function gameLoop() {
		$(".cell[data-owner=n]").addClass("blink"); // Add a blink effect to all clickable cells
		$(".cell[data-owner=n]").on("click", gameClick); // Add listeners to all clickable cells
		$(".cell").each(function (el) {
			if (el.getAttribute("data-owner") == "x") {
				el.style.backgroundColor = "#64bb70";
			} else if (el.getAttribute("data-owner") == "o") {
				el.style.backgroundColor = "#bb7064";
			} else {
				el.style.backgroundColor = "#fff1b6";
			}
		});
	}
	$(".cell").html("");
	$(".playbutton").on("click", function () { // User has clicked play button, start the game
		paused = false; // Set paused state to false - allow exection of functions
		$(".overlay").addClass("fadeOut"); // Fadeout playbutton overlay
		$(".cell").css("background-color", "#fff1b6");
		$(".cell").attr("data-owner","n"); // set all cells to unowned
		$(".cell").off("click", gameClick);
		setTimeout(function() {
			$(".overlay").css("display", "none"); // hide the overlay
			gameLoop(); // start the event loop
		},250);
	});
});
