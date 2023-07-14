const parentBookElement = document.getElementById("clone-book");
const modalElement = document.getElementById("modal");
const showModalButtonElement = document.getElementById("show-modal");
const closeModalButtonElement = document.getElementById("close-modal");
const bookContainerElement = document.getElementById("book-list");
const newBookForm = document.forms["new-book-form"];
const totalBooksElement = document.getElementById("total-books");
const totalReadElement = document.getElementById("read-books");
const totalUnreadElement = document.getElementById("unread-books");
const totalPagesElement = document.getElementById("total-pages");
const totalReadPagesElement = document.getElementById("read-pages");
const totalUnreadPagesElement = document.getElementById("unread-pages");
let bookList = [];

function book(title, author, pagecount, publishdate, readstatus) {
  this.title = title;
  this.author = author;
  this.pagecount = pagecount;
  this.publishdate = publishdate;
  this.readstatus = readstatus;
  this.id = crypto.randomUUID();
}

function addBookToList(book) {
  bookList.push(book);
  updateLibraryStats();
  bookContainerElement.appendChild(createClonedElement(book));
}

function createClonedElement(book) {
  const cloneElement = parentBookElement.cloneNode(true);
  const deleteButtonElement = cloneElement.querySelector(
    ".book-admin .book-delete"
  );
  const titleElement = cloneElement.querySelector(".data-list .book-title");
  const authorElement = cloneElement.querySelector(".data-list .book-author");
  const pageCountElement = cloneElement.querySelector(
    ".data-list .book-pagecount"
  );
  const publishDateElement = cloneElement.querySelector(
    ".data-list .book-publishing"
  );
  const readStatusElement = cloneElement.querySelector(
    ".data-list .book-readstatus"
  );
  const hiddenCheckboxElement = readStatusElement.querySelector(
    "input[type=checkbox]"
  );
  const sliderBackgroundElement =
    readStatusElement.querySelector(".slider-background");

  cloneElement.removeAttribute("hidden");
  cloneElement.setAttribute("id", book.id);
  deleteButtonElement.setAttribute("data-book-id", book.id);

  titleElement.textContent = book.title;
  authorElement.textContent = book.author;
  pageCountElement.textContent = book.pagecount;
  publishDateElement.textContent = book.publishdate;

  hiddenCheckboxElement.setAttribute("id", `${book.id}:checkbox`);
  sliderBackgroundElement.setAttribute("for", `${book.id}:checkbox`);
  sliderBackgroundElement.setAttribute("id", `${book.id}:slider`);

  updateReadStatus(cloneElement, book.readstatus);
  return cloneElement;
}

function updateLibraryStats() {
  const totalRead = bookList.filter((book) => book.readstatus).length;
  const totalUnread = bookList.filter((book) => !book.readstatus).length;
  const totalPages = bookList.reduce((total, book) => {
    return total + parseInt(book.pagecount);
  }, 0);
  const totalReadPages = bookList
    .filter((book) => book.readstatus)
    .reduce((total, book) => {
      return total + parseInt(book.pagecount);
    }, 0);
  const totalUnreadPages = bookList
    .filter((book) => !book.readstatus)
    .reduce((total, book) => {
      return total + parseInt(book.pagecount);
    }, 0);

  totalBooksElement.textContent = bookList.length;
  totalReadElement.textContent = totalRead;
  totalUnreadElement.textContent = totalUnread;
  totalPagesElement.textContent = totalPages;
  totalReadPagesElement.textContent = totalReadPages;
  totalUnreadPagesElement.textContent = totalUnreadPages;
}

function showModal() {
  modal.removeAttribute("hidden");
}

function closeModal() {
  modal.setAttribute("hidden", true);
  newBookForm.reset();
}

function handleClickOnBook(event) {
  const target = event.target;
  if (target.classList.contains("delete-icon")) {
    const parent = target.parentElement;
    const uuid = parent.getAttribute("data-book-id");
    const targetBook = document.getElementById(uuid);
    const bookListEntry = bookList.find((entry) => entry.id === uuid);

    targetBook.remove();
    bookList.splice(bookList.indexOf(bookListEntry), 1);
    updateLibraryStats();
  } else if (target.classList.contains("checkbox-hidden")) {
    const uuid = target.getAttribute("id").split(":")[0];
    const targetBook = document.getElementById(uuid);

    updateReadStatus(targetBook, target.checked);
  }
}

function submitBook(event) {
  event.preventDefault();
  const formData = new FormData(document.forms["new-book-form"]);
  const title = formData.get("title");
  const author = formData.get("author");
  const pageCount = formData.get("pagecount");
  const publishDate = formData.get("publishdate");
  const publishYear = publishDate.substring(0, publishDate.indexOf("-"));
  const publishText = publishDate
    .slice(publishDate.indexOf("-") + 1)
    .concat(` / ${publishYear}`)
    .replace("-", " / ");
  const readStatus = formData.get("readstatus") ? true : false;

  addBookToList(new book(title, author, pageCount, publishText, readStatus));
  closeModal();
}

function updateReadStatus(book, status) {
  const bookListEntry = bookList.find((entry) => entry.id === book.id);
  const readStatusElement = book.querySelector(".data-list .book-readstatus");
  const hiddenCheckboxElement = readStatusElement.querySelector(
    "input[type=checkbox]"
  );
  const statusTextElement = book.querySelector(".status-text");

  if (status) {
    statusTextElement.textContent = "Read";
    statusTextElement.classList.add("book-read");
    hiddenCheckboxElement.checked = true;
    bookListEntry.readstatus = true;
  } else {
    statusTextElement.textContent = "Unread";
    statusTextElement.classList.remove("book-read");
    hiddenCheckboxElement.checked = false;
    bookListEntry.readstatus = false;
  }
  updateLibraryStats();
}

bookContainerElement.addEventListener("click", handleClickOnBook);
showModalButtonElement.addEventListener("click", showModal);
closeModalButtonElement.addEventListener("click", closeModal);
newBookForm.addEventListener("submit", submitBook);
