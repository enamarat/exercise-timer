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


const displayPrograms = (program, exercises) => {
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

          <div class="exercise_creation">
            <button class="add_exercise_button">New Exercise</button>
            <div class="exercise_parameters">
                <h3>Exercise parameters</h3>
                <input class="exercise_name" maxLength="30" placeholder="name">
                <input class="exercise_time" type="number" min="0" max="9999" placeholder="duration, seconds">
                <input class="exercise_sets" type="number" min="0" max="9999" placeholder="number of sets">
                <input class="rest_time_between" type="number" min="0" max="9999" placeholder="rest time between sets, seconds">
                <input class="rest_time_after" type="number" min="0" max="9999" placeholder="rest time after the exercise, seconds">
                <button class="exercise_button">+</button>
            </div>
          </div>

          <div class="exercises_list">
            <table class="exercise_table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Time, sec</th>
                  <th>Number of sets</th>
                  <th>Rest time between sets, sec</th>
                  <th>Rest time after exercise, sec</th>
                </tr>
              </thead>
              <tbody>
              ${exercises}
              </tbody>
            </table>
          </div>

      </div>
  `;
  document.querySelector("#programs").append(div);
}


const showParameters = (event) => {
  if (event.target.className == "add_exercise_button" && event.target.textContent == "New Exercise") {
    event.target.parentNode.childNodes[3].style.display = "flex";
    event.target.textContent = "Hide";
  } else if (event.target.className == "add_exercise_button" && event.target.textContent == "Hide") {
    event.target.parentNode.childNodes[3].style.display = "none";
    event.target.textContent = "New Exercise";
  }
}


const createExercise = (event) => {
  if (event.target.className == "exercise_button") {
    const program_title = event.target.parentNode.parentNode.parentNode.querySelector(".program_title").textContent.trim();
    let exercise_id = "";

    // add the exercise to the program
    for (let i = 0; i < programs.length; i++) {
      if (programs[i].name == program_title) {
        if (programs[i].exercises == undefined) {
          programs[i].exercises = [];
        }
        programs[i].exercises.push({
          exercise_name: event.target.parentNode.querySelector(".exercise_name").value,
          exercise_time: event.target.parentNode.querySelector(".exercise_time").value,
          excercise_sets: event.target.parentNode.querySelector(".exercise_sets").value,
          rest_time_between: event.target.parentNode.querySelector(".rest_time_between").value,
          rest_time_after: event.target.parentNode.querySelector(".rest_time_after").value,
          exercise_id: programs[i].exercises.length
        });
        exercise_id = programs[i].exercises.length;
      }
    }
    localStorage.setItem('programs', JSON.stringify(programs));

    // display the exercise
    const row = document.createElement("TR");
    row.innerHTML = `
      <td class="exercise_id">${exercise_id}</td>
      <td>${event.target.parentNode.querySelector(".exercise_name").value}</td>
      <td>${event.target.parentNode.querySelector(".exercise_time").value}</td>
      <td>${event.target.parentNode.querySelector(".exercise_sets").value}</td>
      <td>${event.target.parentNode.querySelector(".rest_time_between").value}</td>
      <td class="last_column">${event.target.parentNode.querySelector(".rest_time_after").value} <button class="delete_exercise_button">x</button></td>
    `;
    event.target.parentNode.parentNode.parentNode.querySelector('.exercises_list').querySelector(".exercise_table").appendChild(row);
  
    // empty fields
    event.target.parentNode.querySelector(".exercise_name").value = "";
    event.target.parentNode.querySelector(".exercise_time").value = "";
    event.target.parentNode.querySelector(".exercise_sets").value = "";
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

  // display the list of exercises
  let exercises = ``;
  programs.map(program => {
    const div = document.createElement('DIV');
    let content = ``;
  
    if (program.exercises != undefined) {
      for (let i = 0; i < program.exercises.length; i++) {
        content += `
        <tr>
          <td class="exercise_id">${program.exercises[i].exercise_id}</td>
          <td>${program.exercises[i].exercise_name}</td>
          <td>${program.exercises[i].exercise_time}</td>
          <td>${program.exercises[i].excercise_sets}</td>
          <td>${program.exercises[i].rest_time_between}</td>
          <td class="last_column">${program.exercises[i].rest_time_after} <button class="delete_exercise_button">x</button></td>
        </tr>
        `;
      }
    }
    exercises = content;
    displayPrograms(program, exercises);
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
  if (event.target.className == "delete_exercise_button") {
    const program_title = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".program_title").textContent.trim();
    const exercise_id = event.target.parentNode.parentNode.childNodes[1].textContent.trim();
    
    programs.forEach(program => {
      if (program.name == program_title) {
        program.exercises.forEach(exercise => {
            if (exercise.exercise_id == exercise_id) {
              program.exercises = program.exercises.filter(element => element.exercise_id != exercise_id);
            }
        });
      }
    });
    localStorage.setItem('programs', JSON.stringify(programs));
    event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
  }
}


document.querySelector("#program_button").addEventListener("click", createProgram);
document.querySelector("#programs").addEventListener("click", showParameters);
document.querySelector("#programs").addEventListener("click", createExercise);
document.querySelector("#programs").addEventListener("click", showDeletionWindow);
document.querySelector("#programs").addEventListener("click", hideDeletionWindow);
document.querySelector("#programs").addEventListener("click", deleteProgram);
document.querySelector("#programs").addEventListener("click", deleteExercise);
window.addEventListener("load", displaySavedPrograms);