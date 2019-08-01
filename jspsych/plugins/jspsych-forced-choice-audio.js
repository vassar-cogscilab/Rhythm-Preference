jsPsych.plugins["forced-choice-audio"] = (function() {
	var plugin = {};

	jsPsych.pluginAPI.registerPreload('forced-choice-audio', 'stimulus', 'audio');

	plugin.info = {
		name: 'forced-choice-audio',
		description: '',
		parameters: {
			stimulus: {
				type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
        array: true,
				default: undefined,
				description: 'The audio to be played.'
			},
			choices: {
				type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
				default: null,
				array: true,
				description: 'The button labels.'
			},
      button_html: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'Custom button. Can make your own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'Vertical margin of button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'Horizontal margin of button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial will end when user makes a response.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // setup stimulus
    //var context = jsPsych.pluginAPI.audioContext();
    var audioBuffers = [];
    for(var i=0; i<trial.stimulus.length; i++){
      audioBuffers.push(jsPsych.pluginAPI.getAudioBuffer(trial.stimulus[i]));
    }

    // declare some objects in this scope
    var audio, active_id;

    // keep track of which audio tracks are listened to
    var listened = [];
    for(var i=0; i<trial.stimulus.length; i++){
      listened.push(false);
    }
    play_history = [];

    function all_listened(){
      var yes = true;
      for(var i=0; i<listened.length; i++){
        if(listened[i] == false){
          yes = false;
          break;
        }
      }
      return yes;
    }
    
    // if(context !== null){
    //   var source = context.createBufferSource();
    //   source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
    //   source.connect(context.destination);
    // } else {
    //   var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
    //   audio.currentTime = 0;
    // }

    var html = '';

    // style injection
    html += '<style>';
    html += '.forced-choice-audio-opt { display: inline-block; padding: 16px; }';
    html += '.forced-choice-audio-opt div svg { cursor: pointer; height: 64px; width: 64px }';
    html += '</style>';

    html += '<div id="forced-choice-audio-play-buttons">';
    for(var i=0; i<trial.stimulus.length; i++){
      html += '<div class="forced-choice-audio-opt">';
      html += '<div id="opt-'+i+'" data-choice="'+i+'">';
      // material design play icon
      html += '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>';
      html += '</div>';
      html += '<button id="btn-'+i+'" data-choice="'+i+'" class="jspsych-btn" disabled>This one.</button>';
      html += '</div>';
    }
    html += '</div>';
    
		//show prompt if there is one
		if (trial.prompt !== null) {
			html += trial.prompt;
		}

    display_element.innerHTML = html;
    
    enable_audio_buttons();

		for (var i = 0; i < trial.stimulus.length; i++) {
      display_element.querySelector('#btn-' + i).addEventListener('click', function(e){
        var choice = parseInt(e.currentTarget.getAttribute('data-choice')); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    function play_audio(e){
      var choice = parseInt(e.currentTarget.getAttribute('data-choice')); // don't use dataset for jsdom compatibility
      audio = audioBuffers[choice];
      active_id = choice;
      play_history.push(active_id);
      audio.currentTime = 0;
      audio.play();
      audio.onended = enable_audio_buttons;
      disable_audio_buttons();
    }

    function disable_audio_buttons(){
      for (var i = 0; i < trial.stimulus.length; i++) {
        if(i==active_id){
          display_element.querySelector('#opt-' + i).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        } else {
          display_element.querySelector('#opt-' + i).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="#cccccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>';
        }
        display_element.querySelector('#opt-' + i).removeEventListener('click', play_audio);
      }
    }

    function enable_audio_buttons(){
      listened[active_id] = true;
      for (var i = 0; i < trial.stimulus.length; i++) {
        display_element.querySelector('#opt-' + i).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>';
        display_element.querySelector('#opt-' + i).addEventListener('click', play_audio);
      }
      if(all_listened()){
        enable_choice_buttons();
      }
    }

    function enable_choice_buttons(){
      for (var i = 0; i < trial.stimulus.length; i++) {
        display_element.querySelector('#btn-' + i).disabled = false;
      }
    }
        

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      end_trial();
    };

    // function to end trial when it is time
    function end_trial() {

			// stop the audio file if it is playing
			// remove end event listeners if they exist
      audio.pause();
      audio.onended = null;
      
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button,
        "play_history": JSON.stringify(play_history)
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

		// start time
    var start_time = performance.now();

  };

  return plugin;
})();
