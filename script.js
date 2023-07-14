//Book class represents a single book object

class Book {
  constructor(title, author, pagecount, publishdate, readstatus) {
    this.title = title;
    this.author = author;
    this.pagecount = pagecount;
    this.publishdate = publishdate;
    this.readstatus = readstatus;
    this.id = crypto.randomUUID();
  }
}

//Library class manages the book list and provides functions for adding books, updating statistics, and handling user interactions

//Library class encapsulates the variables and functions that were previously defined in the global scope. The constructor initializes the necessary DOM elements and event listeners. The methods of the Library class are bound using the bind function to ensure they have the correct 'this' context when called from event handlers.
class Library {
  constructor() {
    this.bookList = [];
    this.parentBookElement = document.getElementById("clone-book");
    this.modalElement = document.getElementById("modal");
    this.showModalButtonElement = document.getElementById("show-modal");
    this.closeModalButtonElement = document.getElementById("close-modal");
    this.bookContainerElement = document.getElementById("book-list");
    this.newBookForm = document.forms["new-book-form"];
    this.totalBooksElement = document.getElementById("total-books");
    this.totalReadElement = document.getElementById("read-books");
    this.totalUnreadElement = document.getElementById("unread-books");
    this.totalPagesElement = document.getElementById("total-pages");
    this.totalReadPagesElement = document.getElementById("read-pages");
    this.totalUnreadPagesElement = document.getElementById("unread-pages");

    this.bookContainerElement.addEventListener(
      "click",
      this.handleClickOnBook.bind(this)
    );
    this.showModalButtonElement.addEventListener(
      "click",
      this.showModal.bind(this)
    );
    this.closeModalButtonElement.addEventListener(
      "click",
      this.closeModal.bind(this)
    );
    this.newBookForm.addEventListener("submit", this.submitBook.bind(this));
  }

  addBookToList(book) {
    this.bookList.push(book);
    this.updateLibraryStats();
    this.bookContainerElement.appendChild(this.createClonedElement(book));
  }

  createClonedElement(book) {
    const cloneElement = this.parentBookElement.cloneNode(true);
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

    this.updateReadStatus(cloneElement, book.readstatus);
    return cloneElement;
  }

  updateLibraryStats() {
    const totalRead = this.bookList.filter((book) => book.readstatus).length;
    const totalUnread = this.bookList.filter((book) => !book.readstatus).length;
    const totalPages = this.bookList.reduce((total, book) => {
      return total + parseInt(book.pagecount);
    }, 0);
    const totalReadPages = this.bookList
      .filter((book) => book.readstatus)
      .reduce((total, book) => {
        return total + parseInt(book.pagecount);
      }, 0);
    const totalUnreadPages = this.bookList
      .filter((book) => !book.readstatus)
      .reduce((total, book) => {
        return total + parseInt(book.pagecount);
      }, 0);

    this.totalBooksElement.textContent = this.bookList.length;
    this.totalReadElement.textContent = totalRead;
    this.totalUnreadElement.textContent = totalUnread;
    this.totalPagesElement.textContent = totalPages;
    this.totalReadPagesElement.textContent = totalReadPages;
    this.totalUnreadPagesElement.textContent = totalUnreadPages;
  }

  showModal() {
    this.modalElement.removeAttribute("hidden");
  }

  closeModal() {
    this.modalElement.setAttribute("hidden", true);
    this.newBookForm.reset();
  }

  handleClickOnBook(event) {
    const target = event.target;
    if (target.classList.contains("delete-icon")) {
      const parent = target.parentElement;
      const uuid = parent.getAttribute("data-book-id");
      const targetBook = document.getElementById(uuid);
      const bookListEntry = this.bookList.find((entry) => entry.id === uuid);

      targetBook.remove();
      this.bookList.splice(this.bookList.indexOf(bookListEntry), 1);
      this.updateLibraryStats();
    } else if (target.classList.contains("checkbox-hidden")) {
      const uuid = target.getAttribute("id").split(":")[0];
      const targetBook = document.getElementById(uuid);

      this.updateReadStatus(targetBook, target.checked);
    }
  }

  submitBook(event) {
    event.preventDefault();
    const formData = new FormData(this.newBookForm);
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

    this.addBookToList(
      new Book(title, author, pageCount, publishText, readStatus)
    );
    this.closeModal();
  }

  updateReadStatus(book, status) {
    const bookListEntry = this.bookList.find((entry) => entry.id === book.id);
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
    this.updateLibraryStats();
  }
}

const library = new Library();
