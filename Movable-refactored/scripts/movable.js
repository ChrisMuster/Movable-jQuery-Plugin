$(document).ready(function() {

//Person using the plugin should be able to change the default keys from arrow keys
//to any other keys they like, such as wasd, by passing the keys through as an option
//that overrides the default keys, as seen below.
	$("#square").movable({
		add_controls: true,
		controls: "#controls",
		up: 104,
		left: 100,
		right: 102,
		down: 98,
		rotateL: 103,
		rotateR: 105
	}).draggable({
		containment: "document"
	});

	$("#controls").draggable({
		containment: "document"
	});
});