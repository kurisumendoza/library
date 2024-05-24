'use strict';

const myLibrary = [];
const booksList = document.getElementById('content');
const bookFormOverlay = document.querySelector('.book-form-overlay');
const addBookModal = document.querySelector('.add-book');
const addBookBtn = document.querySelector('.add-book-btn');
const addBookCloseBtn = document.querySelector('.close-btn');
const addBookForm = document.querySelector('.add-book-form');
const addBookSubmit = document.querySelector('.add-book-submit');
const editBookModal = document.querySelector('.edit-book');
const editBookBtn = document.querySelector('.edit-book-btn');
const editBookCloseBtn = document.querySelector('.edit-close-btn');
const editBookSubmit = document.querySelector('.edit-book-submit');
const deleteBookBtn = document.querySelector('.delete-book');
const finishEditBtn = document.querySelector('.finish-edit-btn');
const navStatusFilter = document.getElementById('nav-status');

const Book = function (title, author, pages, readStatus) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
};

const displayLibrary = function (library) {
  booksList.innerHTML = '';
  library.forEach((book, i) => {
    const newBook = bookEntryDetails(book, i + 1);
    booksList.insertAdjacentHTML('beforeend', newBook);
  });
};

const addBookToLibrary = function (title, author, pages, readStatus) {
  myLibrary.push(new Book(title, author, pages, readStatus));
  const newBook = bookEntryDetails(
    myLibrary[myLibrary.length - 1],
    myLibrary.length
  );
  booksList.insertAdjacentHTML('beforeend', newBook);
};

const bookEntryDetails = function (book, num) {
  return `<div class="book-entry">
      <p>${num}</p>
      <img src="images/placeholder.webp" alt="" style="max-width: 50px" />
      <p class="title">${book.title}</p>
      <p>${book.author}</p>
      <p>${book.pages}</p>
      <p>${book.readStatus}</p>
    </div>`;
};

const addNewBook = function () {
  addBookModal.classList.remove('hidden');
  bookFormOverlay.classList.remove('hidden');
};

const closeAddBookModal = function () {
  addBookModal.classList.add('hidden');
  bookFormOverlay.classList.add('hidden');
  clearBookForm();
};

const clearBookForm = function () {
  addBookForm.reset();
};

const newBookEntry = function () {
  const newBookTitle = document.getElementById('add-title').value;
  const newBookAuthor = document.getElementById('add-author').value;
  const newBookPages = document.getElementById('add-pages').value;
  const newBookStatus = document.getElementById('add-status').value;

  addBookToLibrary(newBookTitle, newBookAuthor, newBookPages, newBookStatus);

  if (!navStatusFilter.classList.contains('all-books'))
    filterBooksBy('All Books');
  clearBookForm();
  closeAddBookModal();
};

const pickBookToEdit = function () {
  [...booksList.children].forEach((book, i) => {
    const editPicker = document.createElement('img');
    editPicker.src = 'images/edit-button.svg';
    editPicker.setAttribute('data-number', i);
    book.firstElementChild.replaceWith(editPicker);
  });
  addBookBtn.classList.add('hidden');
  editBookBtn.classList.add('hidden');
  finishEditBtn.classList.remove('hidden');
};

const editBookProcess = function () {
  let index;
  const editBookTitle = document.getElementById('edit-title');
  const editBookAuthor = document.getElementById('edit-author');
  const editBookPages = document.getElementById('edit-pages');
  const editBookStatus = document.getElementById('edit-status');

  const editBookEntry = function (num) {
    index = num;
    editBookModal.classList.remove('hidden');
    bookFormOverlay.classList.remove('hidden');
    const bookToEdit = myLibrary[num];
    editBookTitle.value = bookToEdit.title;
    editBookAuthor.value = bookToEdit.author;
    editBookPages.value = bookToEdit.pages;
    editBookStatus.value = bookToEdit.readStatus;
  };

  const saveEditBookEntry = function () {
    myLibrary[index] = new Book(
      editBookTitle.value,
      editBookAuthor.value,
      editBookPages.value,
      editBookStatus.value
    );

    const editedBook = bookEntryDetails(myLibrary[index], Number(index) + 1);

    booksList.children[index].remove();
    booksList.children[index].insertAdjacentHTML('beforebegin', editedBook);
    pickBookToEdit();
    closeEditBookModal();
  };

  const confirmDelete = function () {
    const confirmation = confirm('Are you sure you want to delete this book?');
    if (!confirmation) return;
    deleteBook();
    closeEditBookModal();
  };

  const deleteBook = function () {
    booksList.children[index].remove();
    myLibrary.splice(index, 1);
  };

  return {
    editBookEntry,
    saveEditBookEntry,
    confirmDelete,
    deleteBook,
  };
};
const editBook = editBookProcess();

const finishEditing = function () {
  [...booksList.children].forEach((book, i) => {
    const returnToNum = document.createElement('p');
    book.firstElementChild.replaceWith(returnToNum);
    returnToNum.textContent = `${i + 1}`;
  });
  addBookBtn.classList.remove('hidden');
  editBookBtn.classList.remove('hidden');
  finishEditBtn.classList.add('hidden');
};

const closeEditBookModal = function () {
  editBookModal.classList.add('hidden');
  bookFormOverlay.classList.add('hidden');
  clearBookForm();
};

const filterBooksBy = function (status) {
  const filteredBooks = myLibrary.filter((book) => book.readStatus === status);
  console.log(filteredBooks);
  if (status === 'All Books') {
    displayLibrary(myLibrary);
    navStatusFilter.classList.add('all-books');
  } else {
    displayLibrary(filteredBooks);
    navStatusFilter.classList.remove('all-books');
  }
};

const sampleBooks = function (title, author, pages, readStatus) {
  myLibrary.push(new Book(title, author, pages, readStatus));
};

sampleBooks('The Hobbit', 'J.R.R. Tolkien', 295, 'Finished');
sampleBooks(
  "Harry Potter and the Philosopher's Stone",
  'J.K. Rowling',
  320,
  'Reading'
);
sampleBooks('Game of Thrones', 'G.R.R. Martin', '143', 'To Read');

displayLibrary(myLibrary);

addBookBtn.addEventListener('click', addNewBook);
addBookCloseBtn.addEventListener('click', closeAddBookModal);
bookFormOverlay.addEventListener('click', function () {
  closeAddBookModal();
  closeEditBookModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (
      !addBookModal.classList.contains('hidden') ||
      !editBookModal.classList.contains('hidden')
    ) {
      closeAddBookModal();
      closeEditBookModal();
    }
  }
});
addBookSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  newBookEntry();
});
editBookBtn.addEventListener('click', pickBookToEdit);
finishEditBtn.addEventListener('click', finishEditing);
booksList.addEventListener('click', function (e) {
  if (e.target.getAttribute('data-number') !== null)
    editBook.editBookEntry(e.target.dataset.number);
});
editBookCloseBtn.addEventListener('click', closeEditBookModal);
editBookSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  editBook.saveEditBookEntry();
});
deleteBookBtn.addEventListener('click', function (e) {
  e.preventDefault();
  editBook.confirmDelete();
});
navStatusFilter.addEventListener('click', function (e) {
  if (e.target.classList.contains('nav-link')) {
    filterBooksBy(e.target.textContent);
    console.log(e.target.textContent);
  }
});

// FINISHED
// 1. When EDIT BOOK clicked, turn # into a pencil icon.
// 2. EDIT BOOK button will then turn into CANCEL button which will make the page to its normal state.
// ----- 2a : Decide to hide ADD BUTTON or replace it when edit mode is on.
// 3. When pencil icon is clicked, open a modal with the details of the corresponding book. It is in a FORM which can be edited, similar to the ADD BOOK modal. This will then edit the displayed information.
//  ----- 3a. Change 'add-book-overlay' into something that can be reused for EDIT BOOK.
// 4. The modal will also have a DELETE button which will delete the book entry.
// ----- 4a : Decide to disable nav links or clicking them will cancel edit mode. Also consider this with ADD BUTTON

// TODO
// 5. Make the nav work. These links will make the page show only the clicked status.
// 6. Make the search box work. It will make it so the only displayed book/books are the ones that matches the search criteria.

// 6. RESTRUCTURE. Find a way to not call the pickBookToEdit function when editing a book, as it is looping to the whole list again just to change the number of a single book into an image.
