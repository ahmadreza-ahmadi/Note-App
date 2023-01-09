export default class NotesView {
    constructor(root, handlers) {
        // create root
        this.root = root;

        const { onNoteAdd, onNoteEdit, onNoteSelect, onNoteDelete } = handlers;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteSelect = onNoteSelect;
        this.onNoteDelete = onNoteDelete;

        // show content of root in DOM
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <div class="notes__header">Notes</div>
                <div class="notes__list">
                </div>
                <button class="notes__add">ADD NOTE</button>
            </div>
            <div class="notes__preview">
            <h1 class="notes__logo">NOTE APP</h1>
            <a href="#input-title" tabindex="-1">
            <input type="text" class="notes__title" id="input-title" placeholder="Note title" />
            </a>
            <a href="#input-body" tabindex="-1" class="notes__body-container">
            <textarea name="" class="notes__body" id="input-body" placeholder="Take note..."></textarea>
            </a>
            </div>
        `;

        const addNoteBtn = this.root.querySelector(".notes__add");
        const inputTitle = this.root.querySelector(".notes__title");
        const inputBody = this.root.querySelector(".notes__body");

        addNoteBtn.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inputTitle, inputBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const newTitle = inputTitle.value.trim();
                const newBody = inputBody.value.trim();
                this.onNoteEdit(newTitle, newBody);
            });
        });

        // hide notes preview in first load
        // this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LEGTH = 50;

        return `
        <a href="#${id}" tabindex="-1">
        <div id="${id}" class="notes__list-item" data-note-id="${id}">
        <div class="notes__small-title">${title}</div>
        <hr class="notes__hr">
        <div class="notes__small-body">
        ${body.substring(0, MAX_BODY_LEGTH)}
        ${body.length > MAX_BODY_LEGTH ? "..." : ""}
        </div>
        <div class="notes__item-footer">
        <div class="notes__samll-updated">
        ${new Date(updated).toLocaleString("en", {
            dataStyle: "full",
            timeStyle: "short"
        })}
        </div>
        <span class="notes__item-trash" data-note-id="${id}"><i class="fa-solid fa-trash-can"></i></span>
        </div>
        </div>
        </a>
        `;
    }

    updateNoteList(notes) {
        const notesContainer = this.root.querySelector(".notes__list");

        let notesList = "";

        for (const note of notes) {
            const { id, title, body, updated } = note;
            const html = this._createListItemHTML(id, title, body, updated);
            notesList += html;
        }

        notesContainer.innerHTML = notesList;

        notesContainer.querySelectorAll(".notes__list-item").forEach((noteItem) => {
            noteItem.addEventListener("click", () =>
                this.onNoteSelect(noteItem.dataset.noteId)
            );
        });

        notesContainer.querySelectorAll(".notes__item-trash")
            .forEach(noteItem => {
                noteItem.addEventListener("click", (event) => {
                    event.stopPropagation();
                    this.onNoteDelete(noteItem.dataset.noteId);
                }
                );
            });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(item => {
            item.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
            .classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        const notesPreview = this.root.querySelector(".notes__preview");
        const inputTitle = this.root.querySelector(".notes__title");
        const inputBody = this.root.querySelector(".notes__body");
        const notesContainer = this.root.querySelector(".notes__list");

        if (!visible) {
            notesPreview.childNodes[3].classList.add("disabled");
            notesPreview.childNodes[5].classList.add("disabled");
            inputTitle.value = "Note title";
            inputBody.value = "";
            notesContainer.innerHTML = `<p class="notes__empty">You don't have any note!</p>`;
        }

        else {
            notesPreview.childNodes[3].classList.remove("disabled");
            notesPreview.childNodes[5].classList.remove("disabled");
        }

        notesPreview.addEventListener("click", (event) => {
            if (event.target.childNodes[3].classList.contains("disabled")) {
                this.onNoteAdd();
            }
        });
    }
}