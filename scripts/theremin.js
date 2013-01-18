/*
 * ElectroTheremin
 * by Stuart Memo
 */
define(['../theresas-sound-world/theresas-sound-world'], function( SoundWorld ) {
    var LOWEST_FREQ = 300, HIGHEST_FREQ = 1000;
    
	var context = new webkitAudioContext(),
		mySoundWorld = new SoundWorld(context),
		osc = context.createOscillator(),
		oscGainNode = context.createGainNode(),
		reverbGainNode = context.createGainNode(),
		convolver = context.createConvolver(),
		isPlaying = false;

	mySoundWorld.load({reverb: 'scripts/reverb.ogg'}, function (files) {
		osc.connect(convolver);
		osc.connect(oscGainNode);
		oscGainNode.connect(context.destination);

		convolver.buffer = files.reverb;
		convolver.loop = true;
		convolver.connect(reverbGainNode);
		reverbGainNode.connect(context.destination);

		reverbGainNode.gain.value = oscGainNode.gain.value = 0;
		osc.start(mySoundWorld.now());
	});


	var exports = {};
	
	exports.init = function( min, max ) {
    	LOWEST_FREQ = min;
    	HIGHEST_FREQ = max;
	};
	
	exports.play = function( percent ) {
		
		if (percent) {
			exports.changePitch( percent );
		}
	};
	
	exports.stop = function () {
		oscGainNode.gain.value = 0;
		reverbGainNode.gain.value = 0;

		isPlaying = false;
	};
	
	exports.setVolume = function (zeroToOne) {
        oscGainNode.gain.value = zeroToOne;
        reverbGainNode.gain.value = zeroToOne / 6;
	};
	
	exports.changePitch = function( percent ) {
		osc.frequency.value = ((HIGHEST_FREQ - LOWEST_FREQ) * (percent / 100)) + LOWEST_FREQ;
	}
	
	return exports;
});
