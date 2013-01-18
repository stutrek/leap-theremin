define([], function() {
	var exports = {};
	
	var ws;
	
	// Support both the WebSocket and MozWebSocket objects
	if ((typeof(WebSocket) == 'undefined') &&
		(typeof(MozWebSocket) != 'undefined')) {
		WebSocket = MozWebSocket;
	}
	
	// Create the socket with event handlers
	function init() {
		//Create and open the socket
		ws = new WebSocket("ws://localhost:6437/");
	
		// On successful connection
		ws.onopen = function(event) {
		};
	
		// On message received
		ws.onmessage = function(event) {
			var obj = JSON.parse(event.data);
			handlers.forEach(function(handler){handler(obj)});
		};
	
		// On socket close
		ws.onclose = function(event) {
			alert('close');
		}
	
		//On socket error
		ws.onerror = function(event) {
			alert("Received error");
		};
	}
	
	var handlers = [];
	
	exports.init = init;
	
	exports.onframe = function( handler ) {
		handlers.push(handler);
	}
	
	return exports;
})