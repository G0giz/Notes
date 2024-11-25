"use strict";

//Get the elements of the form.
const noteTitleBox = document.getElementById("noteTitleBox");
const noteDescriptionBox = document.getElementById("noteDescriptionBox");
const formFileBox = document.getElementById("formFileBox");
const noteDateBox = document.getElementById("noteDateBox");
const cardsContainer = document.getElementById("cardsContainer");

// Get the notes from local storage if there is no data create empty array.
let notes = JSON.parse(localStorage.getItem('notes')) || [];;

//On load get the notes and display.
window.onload = displayDataInCards;


function addNote() {
    try {
        addData();
        //Display the notes after 2 seconds because the fade-in effect.
        //I want the last note to display with fade-in and then to remove
        //from all the cards divs this class.
        setTimeout(displayDataInCards,2000);
    }
    catch (err) {
        alert(err.message);
    }
}


//Function to add the data of a note to the notes array.
function addData() {

    const id = notes.length + 1;
    const noteTitle = noteTitleBox.value;
    const noteDescription = noteDescriptionBox.value;
    const noteDate = noteDateBox.value;
    //Get the actual file, not just its name.
    const formFile = formFileBox.files[0];  

    //If a file is selected, generate an object URL for it.
    const formFileURL = formFile ? URL.createObjectURL(formFile) : '';

    //Get the date and time string from the datetime-local value.

    const date = getDateFromNoteDate(noteDate);
    const time = getTimeFromNote(noteDate);

    //Create the note object
    const note = {
        id,
        noteTitle,
        noteDescription,
        date,
        time,
        //Store file name.
        fileName: formFile ? formFile.name : '',
        //Store the generated URL.
        formFileURL  
    };

    // Add the note to the notes array.
    notes.push(note);
    // Save the updated notes array to local storage.
    localStorage.setItem('notes', JSON.stringify(notes));
    clearFields();
    // Refresh the display the new note
    displayLastAddedNote(note);
}

// Function to get the date from the date string.
function getDateFromNoteDate(noteDate) {

    let date;
    // If date empty return an empty string.
    if (noteDate === "") {
        return "";
    }
    else {
        for (let i = 0; i < noteDate.length; i++) {
            if (noteDate[i] == "T") {
                // Cut the string for return the date from index 0 until the index of 'T'.
                date = noteDate.substring(0, i);
                return date;
            }
        }
    }

}

// Function to get the time from the date string.
function getTimeFromNote(noteDate) {

    let time;
    // If date empty return an empty string.
    if (noteDate === "") {
        return "";
    }
    else {
        for (let i = 0; i < noteDate.length; i++) {
            if (noteDate[i] == "T") {
                //Cut the string for return the time from 1 index after the 'T' until the end.
                time = noteDate.substring(i + 1, noteDate.length);
                return time;
            }
        }
    }
}

//Add the last note and display with fade-in (fade-in class).
function displayLastAddedNote(note){

    let content = "";
    content += `
    <div class="card fade-in" id="card-${note.id}">
        <!-- Three dots menu button -->
        <div class="menu-container">
            <button class="menu-button" onclick="toggleMenu(${note.id})">⋮</button>
            <div class="menu-options" id="menu-${note.id}" style="display: none;">
                <button class="edit" onclick="editCard(${note.id})">✏️ Edit</button>
                <button class="save" onclick="saveCard(${note.id})" style="display:none;">💾 Save</button>
                <button class="delete" onclick="deleteNote(${note.id})">❌ Delete</button>
            </div>
        </div>
       
        <div class="cardContent">
            <span id='noteEditTitle-${note.id}' class="noteTitle inputWidth">${note.noteTitle}</span>
            <span id='noteEditDescription-${note.id}' class="noteDescription inputWidth">${note.noteDescription}</span>
                <div>
                <a id='noteEditFileName-${note.id}' class="noteFile inputWidth" href="${note.formFileURL}" target="_blank">${note.fileName}</a>
                </div>
            <span id='noteEditDate-${note.id}' class="noteDate inputWidth">${note.date}</span>
            <span id='noteEditTime-${note.id}' class="noteTime inputWidth">${note.time}</span>
        </div>
    </div>
    `;
    cardsContainer.innerHTML += content;
}

//Function to display the notes in cards without fade-in
function displayDataInCards() {

    let content = "";
     for (const note of notes) {
         content += `
         <div class="card" id="card-${note.id}">
             <!-- Three dots menu button -->
             <div class="menu-container">
                 <button class="menu-button" onclick="toggleMenu(${note.id})">⋮</button>
                 <div class="menu-options" id="menu-${note.id}" style="display: none;">
                     <button class="edit" onclick="editCard(${note.id})">✏️ Edit</button>
                     <button class="save" onclick="saveCard(${note.id})" style="display:none;">💾 Save</button>
                     <button class="delete" onclick="deleteNote(${note.id})">❌ Delete</button>
                 </div>
             </div>
            
             <div class="cardContent">
                 <span id='noteEditTitle-${note.id}' class="noteTitle inputWidth">${note.noteTitle}</span>
                 <span id='noteEditDescription-${note.id}' class="noteDescription inputWidth">${note.noteDescription}</span>
                     <div>
                     <a id='noteEditFileName-${note.id}' class="noteFile inputWidth" href="${note.formFileURL}" target="_blank">${note.fileName}</a>
                     </div>
                 <span id='noteEditDate-${note.id}' class="noteDate inputWidth">${note.date}</span>
                 <span id='noteEditTime-${note.id}' class="noteTime inputWidth">${note.time}</span>
             </div>
         </div>
         `;
     }

    cardsContainer.innerHTML = content; 
}

//Function to toggle the specific three dots menu visibility.
function toggleMenu(id) {

    //Handle the three dots menu display.
    const menu = document.getElementById(`menu-${id}`);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

    //Close the three dots menu if clicked outside.
    document.addEventListener('click', function handleOutsideClick(event) {
        //Check if the click is outside the menu-container.
        if (!event.target.closest(`#card-${id} .menu-container`)) {
            menu.style.display = 'none';
            document.removeEventListener('click', handleOutsideClick); // Remove the listener after it closes
        }
    });
}


//Function for Delete one item
function deleteNote(id) {

    let note = getNoteById(id);
    const sure = confirm(`Are you sure you want to delete ${note.noteTitle} ?`);

    //Check if  the user choose no.
    if (!sure) return;

    //Get the index of the item that need to be deleted.
    let index = 0;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
            index = i;
            break; // אין צורך להמשיך את הלולאה כי מצאנו את האינדקס
        }
    }

    //Delete from this index only one item.
    notes.splice(index, 1);

    //Save the updated notes array to local storage.
    localStorage.setItem('notes', JSON.stringify(notes));
    displayDataInCards();
}

//Function to return the note by id.
function getNoteById(id) {
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
            return notes[i];
        }
    }
}

function editCard(id) {

    //Get the card element by id.
    const card = document.getElementById(`card-${id}`);

    let note = getNoteById(id);

    //Get the current card content inputs by classes.
    const noteTitleElement = document.getElementById(`noteEditTitle-${id}`);
    const noteDescriptionElement = document.getElementById(`noteEditDescription-${id}`);
    const noteFileElement = document.getElementById(`noteEditFileName-${id}`);
    const noteDateElement = document.getElementById(`noteEditDate-${id}`);
    const noteTimeElement = document.getElementById(`noteEditTime-${id}`);

    //Hide the element when the user edit the data.
    noteTimeElement.style.display = "none";

    //Change content to editable fields.
    //The values of the inputs are the data of the note.
    noteTitleElement.innerHTML = `<input type="text" id="editTitle-${id}" value="${note.noteTitle}">`;
    noteDescriptionElement.innerHTML = `<textarea id="editDescription-${id}">${note.noteDescription}</textarea>`;
    noteFileElement.innerHTML = `<input type="file" id="editFile-${id}">`;
    //Assign the value of the date and time with T as the format should be.
    noteDateElement.innerHTML = `<input type="datetime-local" id="editDate-${id}" value="${note.date}T${note.time}">`;

    //Show the Save button and hide the Edit button.
    card.querySelector('.edit').style.display = 'none';
    card.querySelector('.save').style.display = 'inline-block';
}


function saveCard(id) {

    const card = document.getElementById(`card-${id}`);

    //Get the edited values from the inputs
    const editedTitle = document.getElementById(`editTitle-${id}`).value;
    const editedDescription = document.getElementById(`editDescription-${id}`).value;
    const editFile = document.getElementById(`editFile-${id}`);
    const editedDate = document.getElementById(`editDate-${id}`).value;

    //Get the new date and time value from the input.
    const date = getDateFromNoteDate(editedDate);
    const time = getTimeFromNote(editedDate);

    let note = getNoteById(id);
    
    note.noteTitle = editedTitle;
    note.noteDescription = editedDescription;

    //Check if a file was selected
    const formFile = editFile.files[0];

    if (formFile) {
        //Generate a temporary object URL for the selected file.
        const formFileURL = URL.createObjectURL(formFile);
        //Update the note with the new file details.
        note.fileName = formFile.name;
        // Store the generated URL in the note.
        note.formFileURL = formFileURL; 
    } else {
        //If no file is selected, retain the existing file name and URL.
        note.fileName = note.fileName;
        note.formFileURL = note.formFileURL;
    }

    note.date = date;
    note.time = time;

    //Update the local storage.
    localStorage.setItem('notes', JSON.stringify(notes));

    displayDataInCards();

    //Hide the Save button and show the Edit button again.
    card.querySelector('.edit').style.display = 'inline-block';
    card.querySelector('.save').style.display = 'none';

}


//Reset Inputs: 
function clearFields() {

    //Clear inputs.
    noteTitleBox.value = "";
    noteDescriptionBox.value = "";
    formFileBox.value = "";
    noteDateBox.value = "";
    //Put focus in the title input.
    noteTitleBox.focus();
}