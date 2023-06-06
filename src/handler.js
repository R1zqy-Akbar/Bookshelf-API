// import nanoid dari package-nya
const {nanoid} = require('nanoid');
// import array books pada berkas handler.js
const books = require('./books');

// handler 1: untuk menyimpan buku
const saveBookHandler = (request, h) => {
  // data yang dikirimkan oleh client
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // apabila client tidak melampirkan properti name
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // apabila Client melampirkan nilai properti readPage 
  // yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',      
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // id unik dengan menggunakan nanoid
  const id = nanoid(16);
  // menampung tanggal dimasukkannya buku
  const insertedAt = new Date().toISOString();
  // menampung tanggal diperbaruinya buku
  const updatedAt = insertedAt;
  // properti boolean, apakah buku telah selsai dibaca atau tidak
  const finished = (pageCount === readPage);

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  // menentukan apakah newBook sudah masuk ke dalam array books?
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  // jika buku berhasil dimasukkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  // jika buku gagal dimasukkan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// handler 2: untuk menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  // mengembalikan respons
  if (name !== undefined) {
    const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksName.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  } else if (reading !== undefined) {
    const BooksReading = books.filter(
        (book) => Number(book.reading) === Number(reading),
    );

    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksReading.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  } else if (finished !== undefined) {
    const BooksFinished = books.filter(
        (book) => book.finished == finished,
    );

    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksFinished.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  } else {
    // Jika belum terdapat buku yang dimasukkan, 
    // server bisa merespons dengan array books kosong.
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler 3: mengubah buku
const editBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line linebreak-style
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  saveBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
