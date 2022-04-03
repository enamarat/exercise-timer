let programs = [];

const createProgram = () => {
  const program_name = document.querySelector("#program_input").value;
  document.querySelector("#warning").textContent = "";
  
  if (program_name.length < 1) {
      document.querySelector("#warning").textContent = "Program name must consist of at least one character!";
      return 0;
  }

  // check if the program name already exists
  let duplicateFound = false;
  programs.map(program => {
    if (program.name == program_name) {
      document.querySelector("#warning").textContent = "A program with such name already exists!";
      duplicateFound = true;
    }
  });
  if (duplicateFound) {
    return 0;
  }

  const program = {name: program_name};
  programs.push(program);
  localStorage.setItem('programs', JSON.stringify(programs));
  
  displayPrograms(program, "");
  document.querySelector("#program_input").value = "";
}


const displayPrograms = (program, excercises) => {
  const div = document.createElement('DIV');
  div.innerHTML += `
      <div class="user_program">
          <h3 class="program_title">${program.name}</h3>
          <button class="delete_program_button">Delete</button>
          <button class="start_button">Start</button>

          <div class="confirm_program_deletion">
              <h3 class="confirmation">Are you sure?</h3>
              <button class="confirm_action_button">Yes</button>
              <button class="cancel_action_button">No</button>
          </div>

          <div class="excercise_creation">
            <button class="add_excercise_button">New Exercise</button>
            <div class="excercise_parameters">
                <h3>Exercise parameters</h3>
                <input class="excercise_name" maxLength="30" placeholder="name">
                <input class="excercise_time" type="number" min="0" max="9999" placeholder="duration, seconds">
                <input class="excercise_sets" type="number" min="0" max="9999" placeholder="number of sets">
                <input class="rest_time_between" type="number" min="0" max="9999" placeholder="rest time between sets, seconds">
                <input class="rest_time_after" type="number" min="0" max="9999" placeholder="rest time after the excercise, seconds">
                <button class="excercise_button">+</button>
            </div>
          </div>

          <div class="excercises_list">
            <table class="excercise_table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Time, sec</th>
                  <th>Number of sets</th>
                  <th>Rest time between sets, sec</th>
                  <th>Rest time after excercise, sec</th>
                </tr>
              </thead>
              <tbody>
              ${excercises}
              </tbody>
            </table>
          </div>

      </div>
  `;
  document.querySelector("#programs").append(div);
}


const showParameters = (event) => {
  if (event.target.className == "add_excercise_button" && event.target.textContent == "New Exercise") {
    event.target.parentNode.childNodes[3].style.display = "flex";
    event.target.textContent = "Hide";
  } else if (event.target.className == "add_excercise_button" && event.target.textContent == "Hide") {
    event.target.parentNode.childNodes[3].style.display = "none";
    event.target.textContent = "New Exercise";
  }
}


const createExercise = (event) => {
  if (event.target.className == "excercise_button") {
    const program_title = event.target.parentNode.parentNode.parentNode.querySelector(".program_title").textContent.trim();
    let excercise_id = "";
    document.querySelector("#warning").textContent = "";

    // don't accept empty fields
    if (event.target.parentNode.querySelector(".excercise_name").value.length == 0 ||
        event.target.parentNode.querySelector(".excercise_time").value.length == 0 ||
        event.target.parentNode.querySelector(".excercise_sets").value.length == 0 ||
        event.target.parentNode.querySelector(".rest_time_between").value.length == 0 ||
        event.target.parentNode.querySelector(".rest_time_after").value.length == 0) {
          document.querySelector("#warning").textContent = "Fill in all the fields, please!";
          return 0;
    }

    // add the excercise to the program
    for (let i = 0; i < programs.length; i++) {
      if (programs[i].name == program_title) {
        if (programs[i].excercises == undefined) {
          programs[i].excercises = [];
        }
        programs[i].excercises.push({
          excercise_name: event.target.parentNode.querySelector(".excercise_name").value,
          excercise_time: event.target.parentNode.querySelector(".excercise_time").value,
          excercise_sets: event.target.parentNode.querySelector(".excercise_sets").value,
          rest_time_between: event.target.parentNode.querySelector(".rest_time_between").value,
          rest_time_after: event.target.parentNode.querySelector(".rest_time_after").value,
          excercise_id: programs[i].excercises.length
        });
        excercise_id = programs[i].excercises.length;
      }
    }
    localStorage.setItem('programs', JSON.stringify(programs));

    // display the excercise
    const row = document.createElement("TR");
    row.innerHTML = `
      <td class="excercise_id">${excercise_id}</td>
      <td>${event.target.parentNode.querySelector(".excercise_name").value}</td>
      <td>${event.target.parentNode.querySelector(".excercise_time").value}</td>
      <td>${event.target.parentNode.querySelector(".excercise_sets").value}</td>
      <td>${event.target.parentNode.querySelector(".rest_time_between").value}</td>
      <td class="last_column">${event.target.parentNode.querySelector(".rest_time_after").value} <button class="delete_excercise_button">x</button></td>
    `;
    event.target.parentNode.parentNode.parentNode.querySelector('.excercises_list').querySelector(".excercise_table").appendChild(row);
  
    // empty fields
    event.target.parentNode.querySelector(".excercise_name").value = "";
    event.target.parentNode.querySelector(".excercise_time").value = "";
    event.target.parentNode.querySelector(".excercise_sets").value = "";
    event.target.parentNode.querySelector(".rest_time_between").value = "";
    event.target.parentNode.querySelector(".rest_time_after").value = "";
  }
}


const displaySavedPrograms = () => {
  //localStorage.clear();
  document.querySelector("#programs").innerHTML = `
    <div id="programs">
      <h2>Programs</h2>
    </div>
  `;
  
  const loadedPrograms = JSON.parse(localStorage.getItem('programs'));
  if (loadedPrograms != null) {
    programs = loadedPrograms;
  }

  // display the list of excercises
  let excercises = ``;
  programs.map(program => {
    const div = document.createElement('DIV');
    let content = ``;
  
    if (program.excercises != undefined) {
      for (let i = 0; i < program.excercises.length; i++) {
        content += `
        <tr>
          <td class="excercise_id">${program.excercises[i].excercise_id}</td>
          <td>${program.excercises[i].excercise_name}</td>
          <td>${program.excercises[i].excercise_time}</td>
          <td>${program.excercises[i].excercise_sets}</td>
          <td>${program.excercises[i].rest_time_between}</td>
          <td class="last_column">${program.excercises[i].rest_time_after} <button class="delete_excercise_button">x</button></td>
        </tr>
        `;
      }
    }
    excercises = content;
    displayPrograms(program, excercises);
  });
}

// Deletion
const deleteProgram = (event) => {
  if (event.target.className == "confirm_action_button") {
    const program_to_delete = event.target.parentNode.parentNode.querySelector(".program_title").textContent.trim();
    programs = programs.filter(program => program.name != program_to_delete);
    localStorage.setItem('programs', JSON.stringify(programs));
    displaySavedPrograms();
  }
}

const showDeletionWindow = (event) => {
  if (event.target.className == "delete_program_button") {
    event.target.parentNode.querySelector(".confirm_program_deletion").style.display = "block";
  }
}

const hideDeletionWindow = (event) => {
  if (event.target.className == "cancel_action_button") {
    event.target.parentNode.style.display = "none";
  }
}

const deleteExercise = (event) => {
  if (event.target.className == "delete_excercise_button") {
    const program_title = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".program_title").textContent.trim();
    const excercise_id = event.target.parentNode.parentNode.childNodes[1].textContent.trim();
    
    programs.forEach(program => {
      if (program.name == program_title) {
        program.excercises.forEach(excercise => {
            if (excercise.excercise_id == excercise_id) {
              program.excercises = program.excercises.filter(element => element.excercise_id != excercise_id);
            }
        });
      }
    });
    localStorage.setItem('programs', JSON.stringify(programs));
    event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
  }
}

// Start timer
const startTimer = (event) => {
  if (event.target.className == "start_button") {
    const program_title = event.target.parentNode.querySelector(".program_title").textContent;
    let data = null;
    excerciseNumber = 0;
  
    for (let i = 0; i < programs.length; i++) {
      if (programs[i].name == program_title) {
        data = programs[i];
        break;
      }
    }
    playSound(data, 1, data.excercises.length, 0);
  }
}

//sets, duration, timeBetween, timeAfter
const playSound = (data, count, excercisesLength, excerciseNumber) => {
  document.querySelector("#start_signal").play();
  let timeCount = data.excercises[excerciseNumber].excercise_time;
  console.log(`duration ${data.excercises[excerciseNumber].excercise_time}`);
 
  const interval = setInterval(()=> {
    console.log(timeCount);
    timeCount--;
    if (timeCount == 0) {
      document.querySelector("#stop_rest").play();
      clearInterval(interval);
      if (count < data.excercises[excerciseNumber].excercise_sets) {
        setTimeout(()=>{
          playSound(data, count+1, excercisesLength, excerciseNumber);
        }, 4000+(data.excercises[excerciseNumber].rest_time_between*1000));
      } else if (count == data.excercises[excerciseNumber].excercise_sets) {
        console.log("end");
        if (excerciseNumber < excercisesLength) {
          setTimeout(()=>{
            playSound(data, count+1, excercisesLength, excerciseNumber+1);
          }, 4000+(data.excercises[excerciseNumber].rest_time_after*1000));
        }
      }
    }
  }, 1000);
}


document.querySelector("#program_button").addEventListener("click", createProgram);
document.querySelector("#programs").addEventListener("click", showParameters);
document.querySelector("#programs").addEventListener("click", createExercise);
document.querySelector("#programs").addEventListener("click", showDeletionWindow);
document.querySelector("#programs").addEventListener("click", hideDeletionWindow);
document.querySelector("#programs").addEventListener("click", deleteProgram);
document.querySelector("#programs").addEventListener("click", deleteExercise);
document.querySelector("#programs").addEventListener("click", startTimer);
window.addEventListener("load", displaySavedPrograms);
//document.querySelector("#start_signal").addEventListener('ended', playSound);