define(['./theremin', './leap'], function( theremin, leap ) {
	var h1 = document.querySelector('h1');
	leap.init();
	
	theremin.init( 100, 1000 );
	
	leap.onframe(function( frame ) {
		if (frame.hands.length === 2) {
			var volumeHand, pitchHand;
			if (frame.hands[0].palmPosition[0] < frame.hands[1].palmPosition[0]) {
				volumeHand = frame.hands[0];
				pitchHand = frame.hands[1];
			} else {
				volumeHand = frame.hands[1];
				pitchHand = frame.hands[0];
			}
			
			var volume = Math.min( volumeHand.palmPosition[1] / 400, 1 );
			var pitch = pitchHand.palmPosition[1] / 6;
			theremin.play( pitch );
			theremin.setVolume( volume );
			
			h1.innerHTML = 'vol: '+Math.floor(volume*10)+' pitch:'+Math.floor(pitch);
			
		} else {
			h1.innerHTML = 'off'
			theremin.stop();
		}
	})
})