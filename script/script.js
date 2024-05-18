'use strict';

const myLibrary = [];
const booksList = document.getElementById('content');
const addBookModal = document.querySelector('.add-book');
const addBookOverlay = document.querySelector('.add-book-overlay');
const addBookBtn = document.querySelector('.add-book-btn');
const addBookCloseBtn = document.querySelector('.close-btn');
const addBookForm = document.querySelector('.add-book-form');
const addBookSubmit = document.querySelector('.submit');

const Book = function (title, author, pages, readStatus) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
};

const displayLibrary = function () {
  myLibrary.forEach((book, i) => {
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
  return `<div class="book-entry" data-number="${num}">
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
  addBookOverlay.classList.remove('hidden');
};

const closeAddBookModal = function () {
  addBookModal.classList.add('hidden');
  addBookOverlay.classList.add('hidden');
  clearBookForm();
};

const clearBookForm = function () {
  addBookForm.reset();
};

const newBookEntry = function () {
  let newBookTitle = document.getElementById('add-title').value;
  let newBookAuthor = document.getElementById('add-author').value;
  let newBookPages = document.getElementById('add-pages').value;
  let newBookStatus = document.getElementById('add-status').value;

  addBookToLibrary(newBookTitle, newBookAuthor, newBookPages, newBookStatus);

  clearBookForm();
  closeAddBookModal();
};

const sampleBooks = function (title, author, pages, readStatus) {
  myLibrary.push(new Book(title, author, pages, readStatus));
};

sampleBooks('The Hobbit', 'J.R.R. Tolkien', 295, 'no');
sampleBooks(
  "Harry Potter and the Sorcerer's Stone",
  'J.K. Rowling',
  320,
  'yes'
);
sampleBooks('Game of Thrones', 'G.R.R. Martin', '143', 'no');

displayLibrary();

addBookBtn.addEventListener('click', addNewBook);
addBookCloseBtn.addEventListener('click', closeAddBookModal);
addBookOverlay.addEventListener('click', closeAddBookModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (!addBookModal.classList.contains('hidden')) closeAddBookModal();
  }
});
addBookSubmit.addEventListener('click', function (e) {
  e.preventDefault();
  newBookEntry();
});
