const {
  saveBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  // route 1: menyimpan buku
  {
    method: 'POST',
    path: '/books',
    handler: saveBookHandler,
  },

  // route 2: menampilkan seluruh buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },

  // route 3: menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler,
  },

  // route 4: mengubah buku
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler,
  },
  
  // route 5: menghapus buku
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
