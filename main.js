"use strict";
const noteTitleBox = document.getElementById("noteTitleBox");
const noteDescriptionBox = document.getElementById("noteDescriptionBox");
const formFileBox = document.getElementById("formFileBox");
const noteDateBox = document.getElementById("noteDateBox");
const cardsContainer = document.getElementById("cardsContainer");

let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Function to load notes from local storage and display them
function loadNotesFromLocalStorage() {
    // Retrieve the notes from local storage
    const notesFromStorage = JSON.parse(localStorage.getItem('notes')) || [];

    // Update the global notes array with the data from local storage
    notes = notesFromStorage;

    // Display notes in cards
    displayDataInCards();
}

window.onload = loadNotesFromLocalStorage;

function addNote(event) {
    event.preventDefault();
    addData();
    displayDataInCards();
}

function addData() {

    const id = notes.length + 1;
    const noteTitle = noteTitleBox.value;
    const noteDescription = noteDescriptionBox.value;
    const noteDate = noteDateBox.value;
    const formFile = formFileBox.files[0];  // Get the actual file, not just its name

    // Validation checks of title and description
    if (noteTitle === "") {
        alert("Title can't be empty.");
        noteTitleBox.focus();
        return;
    }
    if (noteDescription === "") {
        alert("Description can't be empty.");
        noteDescriptionBox.focus();
        return;
    }

    // If a file is selected, generate an object URL for it
    const formFileURL = formFile ? URL.createObjectURL(formFile) : '';

    // Create the note object
    const note = {
        id,
        noteTitle,
        noteDescription,
        noteDate,
        fileName: formFile ? formFile.name : '',  // Store file name
        formFileURL  // Store the generated URL
    };
    
    // Add the note to the notes array
    notes.push(note); 
    // Save the updated notes array to local storage
    localStorage.setItem('notes', JSON.stringify(notes));
    clearUI();
    // Refresh the display with the new note
    displayDataInCards(); 
}


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
    
    <!-- Note content on the right side -->
    <div class="card-content">
        <span class="noteTitle">${note.noteTitle}</span>
        <span class="noteDescription">${note.noteDescription}</span>
        <div>
        <a class="noteFile" href="${note.formFileURL}" target="_blank">${note.fileName}</a>
        </div>
        <span class="noteDate">${note.noteDate}</span>
    </div>
</div>
        `;
    }
    cardsContainer.innerHTML = content;
}

// Function to toggle the specific menu visibility
function toggleMenu(id) {
    // Handle the menu display
    const menu = document.getElementById(`menu-${id}`);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

    // Close the menu if clicked outside
    document.addEventListener('click', function handleOutsideClick(event) {
        // Check if the click is outside the menu-container
        if (!event.target.closest(`#card-${id} .menu-container`)) {
            menu.style.display = 'none';
            document.removeEventListener('click', handleOutsideClick); // Remove the listener after it closes
        }
    });
}

// Delete one item: 
function deleteNote(id) {
    const sure = confirm("Are you sure?");
    // Check if  the user choose no
    if (!sure) return;

    // Get the index of the item that need to be deleted
    let index = 0;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
            index = i;
            break; // אין צורך להמשיך את הלולאה כי מצאנו את האינדקס
        }
    }
    // Delete from this index only one item.
    notes.splice(index, 1); 
    // Save the updated notes array to local storage
    localStorage.setItem('notes', JSON.stringify(notes));
    displayDataInCards();
}

function editCard(id) {
    const card = document.getElementById(`card-${id}`);

    // Find the note by ID
    const note = notes.find(note => note.id === id);

    // Get the current card content
    const noteTitleElement = card.querySelector('.noteTitle');
    const noteDescriptionElement = card.querySelector('.noteDescription');
    const noteFileElement = card.querySelector('.noteFile');
    const noteDateElement = card.querySelector('.noteDate');
    const fileNameTemp = "";
    // Change content to editable fields
    noteTitleElement.innerHTML = `<input type="text" id="editTitle-${id}" value="${note.noteTitle}">`;
    noteDescriptionElement.innerHTML = `<textarea id="editDescription-${id}">${note.noteDescription}</textarea>`;
    noteFileElement.innerHTML = `<input type="file" id="editFile-${id}">${fileNameTemp}</input>`;
    noteDateElement.innerHTML = `<input type="date" id="editDate-${id}" value="${note.noteDate}">`;

    // Show the Save button and hide the Edit button
    card.querySelector('.edit').style.display = 'none';
    card.querySelector('.save').style.display = 'inline-block';
}

function saveCard(id) {
    const card = document.getElementById(`card-${id}`);

    // Get the edited values from the inputs
    const editedTitle = document.getElementById(`editTitle-${id}`).value;
    const editedDescription = document.getElementById(`editDescription-${id}`).value;
    const editFile = document.getElementById(`editFile-${id}`).value;
    const editedDate = document.getElementById(`editDate-${id}`).value;

    // Update the note in the notes array
    const note = notes.find(note => note.id === id);
    note.noteTitle = editedTitle;
    note.noteDescription = editedDescription;
    // Check if the user did not choose a file and keep the last name
    if (editFile === "") {
        note.fileName = note.fileName;
    }
    else{
        note.fileName = editFile;
    }
    note.noteDate = editedDate;

    displayDataInCards();

    // Hide the Save button and show the Edit button again
    card.querySelector('.edit').style.display = 'inline-block';
    card.querySelector('.save').style.display = 'none';

}



// Reset boxes: 
function clearUI() {

    // Clear boxes:
    noteTitleBox.value = "";
    noteDescriptionBox.value = "";
    
    // Put focus in the item box:
    noteTitleBox.focus();
}

function clearFields() {
    // Get references to the form fields
    document.getElementById('noteTitleBox').value = '';
    document.getElementById('noteDescriptionBox').value = '';
    document.getElementById('formFileBox').value = '';
    document.getElementById('noteDateBox').value = '';
}