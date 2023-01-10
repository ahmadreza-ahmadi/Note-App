import "../css/style.css";
import "../css/fonts.css";
import NotesAPI from "./notesAPI.js";
import NotesView from "./notesView.js";

export default class app {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());
        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();

        // set notes
        this._setNotes(notes);

        // set active notes
        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _handlers() {
        return {
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "",
                };

                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },

            onNoteEdit: (newTitle, newBody) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title: newTitle,
                    body: newBody,
                });
                this._refreshNotes();
            },

            onNoteSelect: (noteId) => {
                const selectedNotes = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNotes);
            },

            onNoteDelete: (noteId) => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            }
        };
    }
}