// Applicaiton code that handles user input from QASystem
const EVENT_KEY_CODE = 13; // To capture Enter input from keyboard
const HOME_BASE_URL = '/';
const SIMULATOR_BASE_URL = '/simulatorHome';
const LIGHTS_SIMULATION_START_URL = '/startSimulation';
const LIGHTS_SIMULATION_STOP_URL = '/stopSimulation';
const SIMULATION_INPUT_FORM_ID = 'simulationInputForm';
const NUMBER_OF_LIGHTS_INPUT_ID = '#numberOfLignts';
const SIGNAL_DELAY_INPUT_ID = '#signalDelay';
const ALERT_BOX_ELEMENT_ID = 'alert_box';
const EXIT_LOADER_ELEMENT_ID = 'exit_loader';
const EXIT_MESSAGE_ELEMENT_ID = 'exit_message';
const ALERT_MESSAGE_ELEMENT_ID = 'alert_message';
const NO_LIGHTS_RESPONSE_ANSWER_KEY = 'light_groups'
const LIGHT_COUNT_DISPLAY_ID = 'lightCount';
const LIGHTS_CONTAINER_ID = 'LightsContainer';
const LIGHTS_CONTAINER_DIV_CLASS_MAPPER = {
    1: "one",
    2: "two",
    3: "three",
    4: "four"
};
const DEACTIVATED_LIGHTS_HTML_TEXT = "<div class=\"column\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <i class=\"circular inverted large lightbulb icon\" style=\"color: red\" style=\"margin: auto\" data-id=\"red\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <i class=\"circular inverted large lightbulb icon\" style=\"color: orange\" data-id=\"orange\"></i>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <i class=\"circular inverted large lightbulb icon\" style=\"color: green\" data-id=\"green\"></i>\n" +
    "                    </div>\n" +
    "                </div>";
const EXECUTE_SIMULATION = true;
var green_signal_delay = 0;
var green_timer;
var red_timer;
var orange_timer;

function showAlertBox(message){
    document.getElementById(ALERT_MESSAGE_ELEMENT_ID).innerText = message;
    document.getElementById(ALERT_BOX_ELEMENT_ID).removeAttribute('hidden');
}


function hideAlertBox(){
    document.getElementById(ALERT_BOX_ELEMENT_ID).setAttribute("hidden", "true");
}

// Function that gets called when user clicks on start Simulation button
function getLights() {
    hideExitBox();
    const number_of_lights = $(NUMBER_OF_LIGHTS_INPUT_ID).val(); // document.getElementById(NUMBER_OF_LIGHTS_INPUT_ID).innerText;
    if( number_of_lights < 1 || number_of_lights > 4){
        showAlertBox("Number of lights should be between 1 and 4 inclusive. Please check.");
        clearSimulationForm();
        return;
    }
    const signal_delay = $(SIGNAL_DELAY_INPUT_ID).val(); // document.getElementById(SIGNAL_DELAY_INPUT_ID).innerText;
    green_signal_delay = signal_delay;
    if(signal_delay <= 4){
        showAlertBox("Green signal delay should be more that 4 seconds. Please check.");
        clearSimulationForm();
        return;
    }
    $.ajax({
        type: "POST",
        url: SIMULATOR_BASE_URL + LIGHTS_SIMULATION_START_URL,
        data: {
            lightCount:number_of_lights,
            signalDelay:signal_delay
        },
        crossDomain:true,
        success: function(msg){
            let start_signal_response = msg;
            var light_groups = start_signal_response[NO_LIGHTS_RESPONSE_ANSWER_KEY];
            displayLights(light_groups);
        },
        error: function(jqXHR, exception) {
            console.log(exception);
        }
    });
}

function displayLights(light_groups){
    document.getElementById(LIGHTS_CONTAINER_ID).innerHTML = "";
    var light_groups = light_groups;
    console.log("Light groups: " + light_groups);
    var column_class_mapper = LIGHTS_CONTAINER_DIV_CLASS_MAPPER[light_groups.length];
    console.log(column_class_mapper);
    for(list in light_groups){
        let interim_div = null;
        interim_div = document.createElement("div");
        interim_div.classList.add("four");
        interim_div.classList.add("wide");
        interim_div.classList.add("column");
        interim_div.setAttribute('group-id', light_groups[list]);
        interim_div.innerHTML += DEACTIVATED_LIGHTS_HTML_TEXT;
        document.getElementById(LIGHTS_CONTAINER_ID).appendChild(interim_div);
    }
    startSimulation();
}

function clearSimulationForm() {
    document.getElementById(SIMULATION_INPUT_FORM_ID).reset();
    var lights_container_document = document.getElementById(LIGHTS_CONTAINER_ID);
    while(lights_container_document.firstChild) {
        lights_container_document.removeChild(lights_container_document.firstChild);
    }
}

function startSimulation(){
    // Initiate timers
    green_timer = parseInt(green_signal_delay);
    orange_timer = 3; // Hard coding orange_timer to 3
    red_timer = green_timer + orange_timer;
    totalTime = green_timer + orange_timer + red_timer;
    start_group_one_simulation();
    start_group_two_simulation();
}

// Writing a promise to implement sleep function
const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

function activate_lights(color_nodes, color) {
    // Activating lights on group one
    for(let index = 0; index < color_nodes.length; index++) {
        if(color == 'red'){
            color_nodes[index].querySelector("[data-id='red']").classList.remove('inverted');
        } else if(color == 'green'){
            color_nodes[index].querySelector("[data-id='green']").classList.remove('inverted');
        } else {
            color_nodes[index].querySelector("[data-id='orange']").classList.remove('inverted');
        }

    }
}

function deactivate_lights(color_nodes, color) {
    // Deactivating lights on group one
    for(let index = 0; index < color_nodes.length; index++) {
        if(color == 'red'){
            color_nodes[index].querySelector("[data-id='red']").classList.add('inverted');
        } else if(color == 'green'){
            color_nodes[index].querySelector("[data-id='green']").classList.add('inverted');
        } else {
            color_nodes[index].querySelector("[data-id='orange']").classList.add('inverted');
        }
    }
}

function start_group_one_simulation() {
    let g1_red_nodes = document.querySelectorAll("[group-id='g1']");
    let g1_orange_nodes = document.querySelectorAll("[group-id='g1']");
    let g1_green_nodes = document.querySelectorAll("[group-id='g1']");

    // Activating red lights on group one
    activate_lights(g1_red_nodes, 'red');
    // Deactivating red lights on group one
    sleep(red_timer * 1000).then(() => {
        console.log('On for ' + red_timer + ' seconds');
        deactivate_lights(g1_red_nodes, 'red');
        // Activating green lights on group one
        activate_lights(g1_green_nodes, 'green');
        // Deactivating green lights on group one
        sleep(green_timer * 1000).then(() => {
            console.log('On for ' + green_timer + ' seconds');
            deactivate_lights(g1_green_nodes, 'green');
            // Activating orange lights on group one
            activate_lights(g1_orange_nodes, 'orange');
            // Deactivating orange lights on group one
            sleep(orange_timer * 1000).then(() => {
                console.log('On for ' + orange_timer + ' seconds');
                deactivate_lights(g1_orange_nodes, 'orange');
                // Recursive call to restart the group one simulation
                start_group_one_simulation();
            });
        });
    });
}

function start_group_two_simulation() {
    let g2_red_nodes = document.querySelectorAll("[group-id='g2']");
    let g2_orange_nodes = document.querySelectorAll("[group-id='g2']");
    let g2_green_nodes = document.querySelectorAll("[group-id='g2']");

    // Activating green lights on group two
    activate_lights(g2_green_nodes, 'green');
    // Deactivating green lights on group two
    sleep(green_timer * 1000).then(() => {
        deactivate_lights(g2_green_nodes, 'green');
        // Activating orange lights on group two
        activate_lights(g2_orange_nodes, 'orange');
        // Deactivating orange lights on group two
        sleep(orange_timer * 1000).then(() => {
            deactivate_lights(g2_orange_nodes, 'orange');
            // Activating red lights on group two
            activate_lights(g2_red_nodes, 'red');
            // Deactivating red lights on group two
            sleep(red_timer * 1000).then(() => {
                deactivate_lights(g2_red_nodes, 'red')
                // Recursive call to restart the group one simulation
                start_group_two_simulation();
            });
        });
    });
}

function showExitMessage(message) {
    document.getElementById(EXIT_MESSAGE_ELEMENT_ID).innerText = message;
    document.getElementById(EXIT_LOADER_ELEMENT_ID).removeAttribute('hidden');
}

function hideExitBox(){
    document.getElementById(EXIT_LOADER_ELEMENT_ID).setAttribute('hidden', "true");
}

// function to call the stop simulation API
function stopSimulation() {
    $.ajax({
        type: "GET",
        url: SIMULATOR_BASE_URL + LIGHTS_SIMULATION_STOP_URL,
        crossDomain:true,
        success: function(msg){
            let stop_signal_response = msg;
            let stop_simulator_message = stop_signal_response['message'];
            showExitMessage(stop_simulator_message);
            clearSimulationForm();
            return;
        },
        error: function(jqXHR, exception) {
            console.log(exception);
        }
    });
    sleep(2 * 1000).then(() => {
        window.location.replace(HOME_BASE_URL);
    });
}