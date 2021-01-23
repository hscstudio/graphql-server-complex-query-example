const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar IntOrString

  type Profile {
    name: String
    email: String
  }

  type User {
    id: Int
    username: String
    password: String
    profile: Profile
    status: Boolean
  }

  type Product {
    id: Int
    title: String
    price: Int
    stock: Int
    status: Boolean
  }

  type Item {
    id: Int
    price: Int
    qty: Int
  }

  type Order {
    id: Int
    user_id: Int
    items: [Item]
    status: Boolean
  }

  input UserWhere {
    id: UserWhere
    username: UserWhere
    profile__name: UserWhere
    profile__email: UserWhere
    status: ProductWhere
    _eq: IntOrString
    _in: [IntOrString]
    _like: String
    _lt: Int
    _lte: Int
    _gt: Int
    _gte: Int
  }

  input ProductWhere {
    id: ProductWhere
    title: ProductWhere
    price: ProductWhere
    stock: ProductWhere
    status: ProductWhere
    _eq: IntOrString
    _in: [IntOrString]
    _like: String
    _lt: Int
    _lte: Int
    _gt: Int
    _gte: Int
  }

  input OrderWhere {
    id: OrderWhere
    user_id: OrderWhere
    items: [OrderWhere]
    status: ProductWhere
    _eq: IntOrString
    _in: [IntOrString]
    _like: String
    _lt: Int
    _lte: Int
    _gt: Int
    _gte: Int
  }

  type Query {
    users(where: UserWhere): [User]
    products(where: ProductWhere): [Product]
    orders(where: OrderWhere): [Order]
    user(id: Int!): User
    product(id: Int!): Product
    order(id: Int!): Order
  }
`;

module.exports = typeDefs;