var webAudioToolkit = false;
if (typeof webkitAudioContext !== 'undefined') {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  webAudioToolkit = {
    'audioContext': new AudioContext(),

    'loadSound': function (url, callback) {
      var _self = this;
      var request = new XMLHttpRequest();
      callback = callback || function () {};

      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        _self.audioContext.decodeAudioData(request.response, callback);
      };

      request.send();
    },

    'playSound': function (buffer, options, callback) {
      var _self = this;

      if (!options) callback = options;
      options = options || {};

      var source = _self.audioContext.createBufferSource();
      source.buffer = buffer;

      var gainNode = _self.audioContext.createGain();
      source.connect(gainNode);

      gainNode.connect(_self.audioContext.destination);

      if (typeof options.volume !== 'undefined') {
        gainNode.gain.value = options.volume;
      } else {
        gainNode.gain.value = 1;
      }

      // Options
      if (options.loop) {
        source.loop = true;
      }

      source.start(0);

      if (callback) {
        callback(source);
      }
    },

    'stopSound': function (source) {
      source.stop(0);
    }
  };
}

export default webAudioToolkit;
