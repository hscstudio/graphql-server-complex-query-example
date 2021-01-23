const { GraphQLScalarType } = require('graphql') ;
const { Kind } = require('graphql/language');
const { users, products, orders } = require('./db');

const operate = (operatorName, data1, data2) => {
  if (operatorName === '_eq') return data1 === data2
  if (operatorName === '_in') return data2.indexOf(data1)>=0
  if (operatorName === '_like') return data1.indexOf(data2) >= 0
  if (operatorName === '_lt') return data1 < data2
  if (operatorName === '_lte') return data1 <= data2
  if (operatorName === '_gt') return data1 > data2
  if (operatorName === '_gte') return data1 >= data2
  return false
}

const where = (results, where, items) => {
  const wheres = JSON.parse(JSON.stringify(where))
  Object.keys(wheres).map(fieldName => {
    const fieldValue = wheres[fieldName] // id: { _eq: 1 }
    if (fieldName.indexOf('__')>=0) {
      const fieldNames = fieldName.split('__')
      const objectName = fieldNames[0]
      const pathName = fieldNames[1]
      Object.keys(fieldValue).map(operatorName => {
        const value = fieldValue[operatorName] // _eq : 1
        const result = items.filter(item => {
          return operate(operatorName, item[objectName][pathName], value)
        })
        result && results.push(...result)
        return true
      })
    } else {
      Object.keys(fieldValue).map(operatorName => {
        const value = fieldValue[operatorName] // _eq : 1
        const result = items.filter(item => {
          return operate(operatorName, item[fieldName], value)
        })
        result && results.push(...result)
        return true
      })
    }
    return true
  })
  return results
}

const resolvers = {
  Query: {
    users(parent, args, context, info) {
      if (args) {
        if (args.where) {
          return where([], args.where, users)  
        }     
      }
      return users
    },
    products(parent, args, context, info) {
      if (args) {
        if (args.where) {
          return where([], args.where, products)  
        }     
      }
      return users
    },
    user(parent, args, context, info) {
      return users.find(user => user.id === args.id);
    },
    product(parent, args, context, info) {
      return products.find(product => product.id === args.id);
    },
    order(parent, args, context, info) {
      return orders.find(order => order.id === args.id);
    }
  },

  IntOrString: new GraphQLScalarType({
    name: 'IntOrString',
    description: 'Custom Int Or String scalar',
    parseValue(value) {
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value);
      }
      if (ast.kind === Kind.STRING) {
        return String(ast.value);
      }
      return null;
    }
  })
};

module.exports = resolvers;