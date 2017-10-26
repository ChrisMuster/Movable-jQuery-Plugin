(function($) {

	$.fn.movable = function(options) {

//Set defaults
		var defaults = {
			add_controls: false,
			controls: "#controls",
			up: 38,
			left: 37,
			down: 40,
			right: 39,
			rotateL: 188,
			rotateR: 190,
			distance: 30,
			rotateDeg: 10
		};

//Merge defaults with options
		var settings = $.extend( {}, defaults, options);

//Return all the functions to the object to be moved, setting up the controls div and all controls allowing movement,
//also allowing other methods to be called on the object after movable is done
		return this.each(function() {
			
			//declare variables
			var width, height, farthestRight, farthestDown;

			var rotation = 0;

			var squareWidth = 54;

			var increment = settings.distance;
			var degrees = settings.rotateDeg;
			var time = 500;

			var upVal = "";
			var leftVal = "";
			var downVal = "";
			var rightVal = "";
			var rotateLVal = "";
			var rotateRVal = "";
			var distVal = "";
			var rotaVal = "";

			var self = $(this);
			var position = self.position();

			var move = true;

			//Set values for keys
			function setValues(settings) {
				$.each(settings, function(key, val) {
					if (isNaN(val)) {
						key = val.toUpperCase().charCodeAt(0);
					} else {
						key = val;
					}
				});

			};

			var buttonSettings = {
				upKey: settings.up,
				leftKey: settings.left,
				rotateLKey: settings.rotateL,
				downKey: settings.down,
				rightKey: settings.right,
				rotateRKey: settings.rotateR,
				submitKey: 13
			 };

			var bS = buttonSettings;

			setValues(bS);

			distVal = increment;
			rotaVal = degrees;
			winResize();
			self.css("position", "absolute");

			//add the controls if add_controls equals true
			if (settings.add_controls) {

				$(settings.controls).css({"float": "right",
										  "border": "2px solid DarkRed",
										  "margin-right": "50px",
										  "width": "256px",
										  "height": "420px"
				});

				$(settings.controls).html(
					'<h4>Click Controls</h4>\
					<table>\
						<tbody>\
							<tr>\
								<td>\
									<img id="rotateLeft" src="images/rotate-left.png">\
								</td>\
								<td>\
									<img id="upClick" src="images/up-arrow.png">\
								</td>\
								<td>\
									<img id="rotateRight" src="images/rotate-to-right.png">\
								</td>\
							</tr>\
							<tr>\
								<td>\
									<img id="leftClick" src="images/left-arrow.png">\
								</td>\
								<td>\
									<img id="downClick" src="images/down-arrow.png">\
								</td>\
								<td>\
									<img id="rightClick" src="images/right-arrow.png">\
								</td>\
							</tr>\
						</tbody>\
					</table>\
					<div id="setControls">\
							<h4>Set new direction keys:</h4>\
							<h6>All fields must be filled in or keys revert to default</h6>\
							<div class="column">\
								<label for="upKey" class="margin3">Up</label>\
								<input type="text" id="upKey" name="upKey" class="keySet margin3" value="'+upVal+'" maxlength="1">\
								<br><br>\
								<label for="leftKey" class="margin3">Left</label>\
								<input type="text" id="leftKey" name="leftKey" class="keySet margin3" value="'+leftVal+'" maxlength="1">\
								<br><br>\
								<label for="rotateLeftKey" class="margin5">Rotate Left</label>\
								<input type="text" id="rotateLeftKey" name="rotateLeftKey" class="keySet margin5" value="'+rotateLVal+'" maxlength="1">\
							</div>\
							<div class="column">\
								<label for="downKey" class="margin3">Down</label>\
								<input type="text" id="downKey" name="downKey" class="keySet margin3" value="'+downVal+'" maxlength="1">\
								<br><br>\
								<label for="rightKey" class="margin3">Right</label>\
								<input type="text" id="rightKey" name="rightKey" class="keySet margin3" value="'+rightVal+'" maxlength="1">\
								<br><br>\
								<label for="rotateRightKey" class="margin5">Rotate Right</label>\
								<input type="text" id="rotateRightKey" name="rotateRightKey" class="keySet margin5" value="'+rotateRVal+'" maxlength="1">\
							</div>\
							<br>\
							<p>Distance:</p><input type="text" id="distance" name="distance" value="'+distVal+'" maxlength="4">\
							<br>\
							<p>Rotation:</p><input type="text" id="rotation" name="rotation" value="'+rotaVal+'" maxlength="4">\
							<br>\
							<input type="submit" id="submit" name="submit" value="Submit">\
					</div>'
				);
			}

			//Movement functions, check current position against window width and height before moving
			function rightMove(position) {
				var sideIncrement = 0;
				farthestRight = (width - squareWidth);

				if (((position.left + increment) >= farthestRight)) {
					sideIncrement = (farthestRight - position.left);
					animate("left", "+="+sideIncrement+"px");
				} else {
					animate("left", "+="+increment+"px");
				}			
			}

			function leftMove(position) {
				var sideIncrement = 0; 

				if (((position.left - increment) <= 0)) {
					sideIncrement = position.left;
					animate("left", "-="+sideIncrement+"px");
				} else {
					animate("left", "-="+increment+"px");
				}
			}

			function downMove(position) {
				var topIncrement = 0;
				var farthestDown = (height - squareWidth);

				if (((position.top + increment) >= farthestDown)) {
					topIncrement = (farthestDown - position.top);
					animate("top", "+="+topIncrement+"px");
				} else {
					animate("top", "+="+increment+"px");
				}
			}

			function upMove(position) {
				var topIncrement = 0;

				if (((position.top - increment) <= 0)) {
					sideIncrement = position.top;
					animate("top", "-="+sideIncrement+"px");
				} else {
					animate("top", "-="+increment+"px");
				}
			}

			//Animate function, taking info from the move functions and animating them
			function animate(side, increment) {
				if (move) {
					var opts = {};
					opts[side] = increment;

					self.animate(opts,{
						start : function(){move = false;},
						done  : function(){move = true;},
						duration : time
					});
				}
			}

			//Set the width and height variables to the current window width and height
			function winResize() {
				width = $(window).width();
				height = $(window).height();
			}

			var clickID = ["#upClick", "#leftClick", "#rotateLeft", "#downClick", "#rightClick", "#rotateRight", "#submit"];

			//Keydown event listeners function
			$(document).keydown(function(event) {
				var clickArray = [];
				$.each(bS, function(key, val) {
					clickArray.push(val);
				});
				for (var i = 0; i < clickID.length; i++) {
					if (event.which === clickArray[i]) {
						$(clickID[i]).trigger("click");
					};
				};		
				clickArray.length = 0;
			/*	if (event.which === bS.upKey) {
					$("#upClick").trigger("click");
				}

				if (event.which === bS.leftKey) {
					$("#leftClick").trigger("click");
				}

				if (event.which === bS.downKey) {
					$("#downClick").trigger("click");
				}

				if (event.which === bS.rightKey) {
					$("#rightClick").trigger("click");
				}

				if (event.which === bS.rotateLKey) {
					$("#rotateLeft").trigger("click");
				}

				if (event.which === bS.rotateRKey) {
					$("#rotateRight").trigger("click");
				} */
			});

			//Click event handlers
			$("#rightClick").click(function() {
				position = self.position();
				rightMove(position);
			});

			$("#leftClick").click(function() {
				position = self.position();
				leftMove(position);
			});

			$("#downClick").click(function() {
				position = self.position();
				downMove(position);
			});

			$("#upClick").click(function() {
				position = self.position();
				upMove(position);
			});

			$("#rotateRight").click(function() {
				rotation += degrees;
				self.rotate(rotation);
			});

			$("#rotateLeft").click(function() {
				rotation -= degrees;
				self.rotate(rotation);
			});

			//submit click function
			$("#submit").click(function() {
				setKeys();
			});

			//Window resize event handler
			$(window).resize(function() {
				winResize();
				stayInBounds();
			});

			//Reset position of square when window is resized if the square is out of bounds
			function stayInBounds() {
				position = self.position();

				farthestRight = (width - squareWidth);
				farthestDown = (height - squareWidth);

				if ((position.left > farthestRight)) {
					self.css({"left":farthestRight+"px"});
				}

				if ((position.left < 0)) {
					self.css({"left":0+"px"});
				}

				if ((position.top > farthestDown)) {
					self.css({"top":farthestDown+"px"});
				}

				if ((position.top < 0)) {
					self.css({"top":0+"px"});
				}				
			}

			//Set the values of the movement keys by capturing the input fields and assigning them to a key
			function setKeys() {
				upVal = $("#upKey").val();
				leftVal = $("#leftKey").val();
				downVal = $("#downKey").val();
				rightVal = $("#rightKey").val();
				rotateLVal = $("#rotateLeftKey").val();
				rotateRVal = $("#rotateRightKey").val();
				distVal = parseInt($("#distance").val(), 10);
				rotaVal = parseInt($("#rotation").val(), 10);

				if (upVal != "" && leftVal != "" && rightVal != "" && downVal != "" && rotateRVal != "" && rotateLVal != "") {
					bS.upKey = upVal.toUpperCase().charCodeAt(0);
					bS.leftKey = leftVal.toUpperCase().charCodeAt(0);
					bS.rotateLKey = rotateLVal.toUpperCase().charCodeAt(0);
					bS.downKey = downVal.toUpperCase().charCodeAt(0);
					bS.rightKey = rightVal.toUpperCase().charCodeAt(0);					
					bS.rotateRKey = rotateRVal.toUpperCase().charCodeAt(0);
				} else {
					setValues(bS);
					alert("Default Keys - Up: NumPad 8 " + "Left: NumPad 4 " + "Down: NumPad 2 " +
						"Right: NumPad 6 " + "Rotate Left: NumPad 7 " + "Rotate Right: NumPad 9");
				}

				if (distVal != "") {
					increment = distVal;
				}

				if (rotaVal != "") {
					degrees = rotaVal;
				}
			}

		});
	};

}(jQuery));