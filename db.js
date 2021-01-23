const users = [
  { id: 1, username: 'abc', password: '123456', profile: { name: 'Abc', email: 'abc@gmail.com' }, status: true },
  { id: 2, username: 'def', password: '123456', profile: { name: 'Def', email: 'def@yahoo.com' }, status: true },
  { id: 3, username: 'ghi', password: '123456', profile: { name: 'Ghi', email: 'ghi@gmail.com' }, status: true },
  { id: 4, username: 'jkl', password: '123456', profile: { name: 'Jkl', email: 'jkl@yahoo.com' }, status: true },
  { id: 5, username: 'mno', password: '123456', profile: { name: 'Mno', email: 'mno@gmail.com' }, status: true },
  { id: 6, username: 'pqr', password: '123456', profile: { name: 'Pqr', email: 'pqr@yahoo.com' }, status: true },
  { id: 7, username: 'stu', password: '123456', profile: { name: 'Stu', email: 'stu@gmail.com' }, status: true },
  { id: 8, username: 'vwq', password: '123456', profile: { name: 'Vwx', email: 'vwx@yahoo.com' }, status: true },
]

const products = [
  { id: 1, title: 'Pensil', price: 2500, stock: 5, status: true },
  { id: 2, title: 'Bulpoin', price: 4000, stock: 10, status: true },
  { id: 3, title: 'Buku Tulis', price: 5000, stock: 20, status: true },
  { id: 4, title: 'Penggaris', price: 3000, stock: 3, status: true },
  { id: 5, title: 'Spidol', price: 6000, stock: 4, status: true },
  { id: 6, title: 'Penghapus', price: 1000, stock: 6, status: true },
  { id: 7, title: 'Gunting', price: 7500, stock: 2, status: true }
]

const orders = [
  { id: 1, user_id: 1, items: [{ id: 1, price: 2500, qty: 1}, { id: 3, price: 5000, qty: 2}], status: true },
  { id: 1, user_id: 2, items: [{ id: 5, price: 6000, qty: 1}, { id: 7, price: 7500, qty: 1}], status: true }
]

exports.users = users
exports.products = products
exports.orders = orders