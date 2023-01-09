const notes = [
    {
        id: 1,
        title: "first note",
        body: "some dummy text first",
        updated: "2021-10-31T15:02:00.411Z",
    },
    {
        id: 2,
        title: "second note",
        body: "some dummy text second",
        updated: "2021-10-31T15:03:23.556Z",
    },
    {
        id: 3,
        title: "third note",
        body: "this is third note",
        updated: "2021-11-01T10:47:26.889Z",
    },
];

export default class NotesAPI {
    static getAllNotes() {
        // get notes from local storage
        const savedNotes = JSON.parse(localStorage.getItem("notes-app")) || [];
        // organize notes based on last date

        return savedNotes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) {
        // get notes from getAllNotes method
        const notes = this.getAllNotes();

        // check existed or not
        const existedNote = notes.find(note => note.id == noteToSave.id);

        if (existedNote) {
            // update title of note
            existedNote.title = noteToSave.title;
            // update body of note
            existedNote.body = noteToSave.body;
            // update date of note
            existedNote.updated = new Date().toISOString();
        } else {
            // create id for new note
            noteToSave.id = new Date().getTime();
            // create date for new note
            noteToSave.updated = new Date().toISOString();
            // add new note to notes
            notes.push(noteToSave);
        }

        // add notes to local storage
        localStorage.setItem("notes-app", JSON.stringify(notes));
    }

    static deleteNote(id) {
        // get notes from getAllNotes function
        const notes = this.getAllNotes();

        // delete available id of notes
        const filteredNotes = notes.filter(note => note.id != id);

        // update local storage with fitered notes
        localStorage.setItem("notes-app", JSON.stringify(filteredNotes));
    }
}