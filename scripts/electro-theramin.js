/*
 * ElectroTheremin
 * by Stuart Memo
 */

(function (window, undefined) {
    const LOWEST_FREQ = 300,
          HIGHEST_FREQ = 1000;

    var context = new webkitAudioContext(),
        mySoundWorld = new SoundWorld(context),
        osc = context.createOscillator(),
        oscGainNode = context.createGainNode(),
        reverbGainNode = context.createGainNode(),
        convolver = context.createConvolver(),
        paperWidth = 800,
        paperHeight = 400,
        paperLeft = (document.width / 2) - 400,
        paperTop = 100,
        paper = Raphael(paperLeft, paperTop, paperWidth, paperHeight),
        chassisLeft = 74,
        chassisTop = 105,
        chassisWidth = 650,
        chassisHeight = 280,
        chassis = paper.rect(chassisLeft, chassisTop, chassisWidth, chassisHeight, 5),
        tails = [],
        isMouseDown = false,
        yellow = '#F2ED63';

    chassisWidth += 100;

    chassis.attr('stroke', yellow);
    chassis.attr('fill', '#27363d');
    chassis.attr('stroke-width', 2);
    chassis.attr('stroke-opacity', 1);

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

    var changePitch = function (percent) {
        osc.frequency.value = ((HIGHEST_FREQ - LOWEST_FREQ) * (percent / 100)) + LOWEST_FREQ;
    };

    var calculatePercentage = function (value, total) {
        return Math.round((value/total) * 100);
    };

    var makeSound = function (chass, obj) {
        if (isMouseDown) {
            changePitch(calculatePercentage(obj.layerX - chass.attrs.x, 650));

            var tailCircle = paper.circle(obj.layerX, obj.layerY, 10);
            tailCircle.attr('fill', yellow);
            tailCircle.attr('opacity', 0.5);
            tailCircle.attr('stroke-width', 0);
            tailCircle.attr('stroke-opacity', 0);
            tails.push(tailCircle);
        }
    } 

    setInterval(function () {
        tails.forEach(function (tail) {
            var opacity = tail.attr('opacity');
            opacity -= 0.05;
            tail.attr('opacity', opacity)
            if (opacity < 0) {
              tail.remove()  
            }
        })
    }, 50)

    chassis.mousemove(function (obj) {
        makeSound(this, obj);
    })

    chassis.mousedown(function (obj) {
        oscGainNode.gain.value = 0.6;
        reverbGainNode.gain.value = 0.1;

        isMouseDown = true;
        makeSound(this, obj);
    });

    window.addEventListener('mouseup', function () {
        oscGainNode.gain.value = 0;
        reverbGainNode.gain.value = 0;

        isMouseDown = false;
    });

})(window);
