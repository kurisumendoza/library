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
const searchInput = document.getElementById('search');
const searchBookBtn = document.getElementById('search-button');

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

const addBookProcess = function () {
  const addNewBook = function () {
    addBookModal.classList.remove('hidden');
    bookFormOverlay.classList.remove('hidden');
  };

  const closeAddBookModal = function () {
    addBookModal.classList.add('hidden');
    bookFormOverlay.classList.add('hidden');
    addBookForm.reset();
  };

  const newBookEntry = function () {
    const newBookTitle = document.getElementById('add-title').value;
    const newBookAuthor = document.getElementById('add-author').value;
    const newBookPages = document.getElementById('add-pages').value;
    const newBookStatus = document.getElementById('add-status').value;

    if (
      newBookTitle.trim() === '' ||
      newBookAuthor.trim() === '' ||
      newBookPages.trim() === ''
    ) {
      alert('Please fill out required fields.');
    } else if (Number(newBookPages.trim()) < 1) {
      alert("Number of pages can't be less than 0.");
    } else {
      addBookToLibrary(
        newBookTitle,
        newBookAuthor,
        newBookPages,
        newBookStatus
      );

      if (!navStatusFilter.classList.contains('all-books'))
        filterBooksBy('All Books');
      addBookForm.reset();
      closeAddBookModal();
    }
  };

  return {
    addNewBook,
    closeAddBookModal,
    newBookEntry,
  };
};
const addBook = addBookProcess();

const editBookProcess = function () {
  let index;
  const editBookTitle = document.getElementById('edit-title');
  const editBookAuthor = document.getElementById('edit-author');
  const editBookPages = document.getElementById('edit-pages');
  const editBookStatus = document.getElementById('edit-status');

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
    if (
      editBookTitle.value.trim() === '' ||
      editBookAuthor.value.trim() === '' ||
      editBookPages.value.trim() === ''
    ) {
      alert('Please fill out required fields.');
    } else if (Number(editBookPages.value.trim()) < 1) {
      alert("Number of pages can't be less than 0.");
    } else {
      myLibrary[index] = new Book(
        editBookTitle.value,
        editBookAuthor.value,
        editBookPages.value,
        editBookStatus.value
      );

      const editedBook = bookEntryDetails(myLibrary[index], Number(index) + 1);

      booksList.children[index].remove();
      booksList.children[index - 1].insertAdjacentHTML('afterend', editedBook);
      pickBookToEdit();
      closeEditBookModal();
    }
  };

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
    addBookForm.reset();
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
    pickBookToEdit();
  };

  return {
    pickBookToEdit,
    editBookEntry,
    saveEditBookEntry,
    finishEditing,
    closeEditBookModal,
    confirmDelete,
    deleteBook,
  };
};
const editBook = editBookProcess();

const filterBooksBy = function (status) {
  const filteredBooks = myLibrary.filter((book) => book.readStatus === status);
  if (status === 'All Books') {
    displayLibrary(myLibrary);
    navStatusFilter.classList.add('all-books');
  } else {
    displayLibrary(filteredBooks);
    navStatusFilter.classList.remove('all-books');
  }
};

const searchBook = function () {
  const bookQuery = document.getElementById('search').value.toLowerCase();
  const bookMatch = myLibrary.filter(
    (book) =>
      book.title.toLowerCase().includes(bookQuery) ||
      book.author.toLowerCase().includes(bookQuery)
  );
  if (bookMatch.length < 1) alert('Book not found.');
  else {
    displayLibrary(bookMatch);
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
sampleBooks('A Game of Thrones', 'G.R.R. Martin', '694', 'To Read');

displayLibrary(myLibrary);

addBookBtn.addEventListener('click', addBook.addNewBook);
addBookCloseBtn.addEventListener('click', addBook.closeAddBookModal);
bookFormOverlay.addEventListener('click', function () {
  addBook.closeAddBookModal();
  editBook.closeEditBookModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (
      !addBookModal.classList.contains('hidden') ||
      !editBookModal.classList.contains('hidden')
    ) {
      addBook.closeAddBookModal();
      editBook.closeEditBookModal();
    }
  }
});
addBookSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  addBook.newBookEntry();
});
editBookBtn.addEventListener('click', editBook.pickBookToEdit);
finishEditBtn.addEventListener('click', editBook.finishEditing);
booksList.addEventListener('click', function (e) {
  if (e.target.getAttribute('data-number') !== null)
    editBook.editBookEntry(e.target.dataset.number);
});
editBookCloseBtn.addEventListener('click', editBook.closeEditBookModal);
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
  }
});
searchBookBtn.addEventListener('click', function (e) {
  e.preventDefault();
  searchBook();
  searchInput.value = '';
});
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    searchBook();
    searchInput.value = '';
  }
});
