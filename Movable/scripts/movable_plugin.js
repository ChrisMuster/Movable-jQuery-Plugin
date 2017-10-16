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

//Merge defaults with options, with differences in options overriding defaults, in new object settings
		var settings = $.extend( {}, defaults, options);

//Return all the functions to the object to be moved, setting up the controls div and all controls allowing movement,
//also allowing other methods to be called on the object after movable is done
		return this.each(function() {
			
			//declare variables
			var upKey, leftKey, rightKey, downKey, rotateLKey, rotateRKey, width, height, farthestRight, farthestDown;

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

			//Set values for keys, either from options or defaults
			function setValues() {
				if (isNaN(settings.up)) {
					upKey = settings.up.toUpperCase().charCodeAt(0);  //from options
				} else {
					upKey = settings.up;  //from defaults
				}

				if (isNaN(settings.left)) {
					leftKey = settings.left.toUpperCase().charCodeAt(0);  //from options
				} else {
					leftKey = settings.left;  //from defaults
				}

				if (isNaN(settings.down)) {
					downKey = settings.down.toUpperCase().charCodeAt(0);  //from options
				} else {
					downKey = settings.down;  //from defaults
				}

				if (isNaN(settings.right)) {
					rightKey = settings.right.toUpperCase().charCodeAt(0);  //from options
				} else {
					rightKey = settings.right;  //from defaults
				}

				if (isNaN(settings.rotateL)) {
					rotateLKey = settings.rotateL.toUpperCase().charCodeAt(0);  //from options
				} else {
					rotateLKey = settings.rotateL;  //from defaults
				}

				if (isNaN(settings.rotateR)) {
					rotateRKey = settings.rotateR.toUpperCase().charCodeAt(0);  //from options
				} else {
					rotateRKey = settings.rotateR;  //from defaults
				}
			};

			setValues();

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

			//Keydown event listeners
			$(document).keydown(function(event) {

				if (event.which === rightKey) {
					$("#rightClick").trigger("click");
				}

				if (event.which === leftKey) {
					$("#leftClick").trigger("click");
				}

				if (event.which === downKey) {
					$("#downClick").trigger("click");
				}

				if (event.which === upKey) {
					$("#upClick").trigger("click");
				}

				if (event.which === rotateRKey) {
					$("#rotateRight").trigger("click");
				}

				if (event.which === rotateLKey) {
					$("#rotateLeft").trigger("click");
				}
			});

			//Click event handlers
			$("#rightClick").click(function() {
				position = self.position();
				rightMove(position);
				//console.log("width: " + width + " height: " + height);
			});

			$("#leftClick").click(function() {
				position = self.position();
				leftMove(position);
				//console.log("width: " + width + " height: " + height);
			});

			$("#downClick").click(function() {
				position = self.position();
				downMove(position);
				//console.log("width: " + width + " height: " + height);
			});

			$("#upClick").click(function() {
				position = self.position();
				upMove(position);
				//console.log("width: " + width + " height: " + height);
			});

			$("#rotateRight").click(function() {
				rotation += degrees;
				self.rotate(rotation);
				//console.log("rotation: " + rotation);
				//console.log(typeof(rotaVal));
			});

			$("#rotateLeft").click(function() {
				rotation -= degrees;
				self.rotate(rotation);
				//console.log("rotation: " + rotation);
				//console.log(typeof(rotaVal));
			});

			//submit click function
			$("#submit").click(function() {
				setKeys();

			//	console.log("upVal: " + upVal + " leftVal: " + leftVal + " downVal: " + downVal);
			//	console.log("rightVal: " + rightVal + " rotateLVal: " + rotateLVal + " rotateRVal: " + rotateRVal);
			//	console.log("distVal: " + distVal + " rotaVal: " + rotaVal);
				alert("Keys changed successfully.");
			});

			//Window resize event handler
			$(window).resize(function() {
				winResize();
				stayInBounds();

				//testing
				//position = self.position();
				//console.log("width: " + width + " height: " + height);
			});

			//Reset position of square when window is resized if the square is out of bounds
			function stayInBounds() {
				position = self.position();

				farthestRight = (width - squareWidth);
				farthestDown = (height - squareWidth);

				if ((position.left > farthestRight)) {
					//farthestRight = farthestRight + 17;
					self.css({"left":farthestRight+"px"});
				}

				if ((position.left < 0)) {
					self.css({"left":0+"px"});
				}

				if ((position.top > farthestDown)) {
					//farthestDown = farthestDown + 17;
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
					upKey = upVal.toUpperCase().charCodeAt(0);
					leftKey = leftVal.toUpperCase().charCodeAt(0);
					downKey = downVal.toUpperCase().charCodeAt(0);
					rightKey = rightVal.toUpperCase().charCodeAt(0);
					rotateLKey = rotateLVal.toUpperCase().charCodeAt(0);
					rotateRKey = rotateRVal.toUpperCase().charCodeAt(0);
				} else {
					upKey = 104;
					leftKey = 100;
					downKey = 98;
					rightKey = 102;
					rotateLKey = 103;
					rotateRKey = 105;
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