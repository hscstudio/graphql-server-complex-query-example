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
  if (operatorName === '_between') {
    return data1 > data2[0] && data1 < data2[1]
  }
  return false
}

const where = (results, where, items) => {
  const wheres = JSON.parse(JSON.stringify(where))
  Object.keys(wheres).map(fieldName => {
    if (['_and', '_or'].indexOf(fieldName)>=0) {
      const objects = wheres[fieldName]
      let parts = []
      Object.keys(objects).map(key => {
        parts[key] = []
        const wheres2 = objects[key]
        // { price: { _gt: 2000 } }
        Object.keys(wheres2).map((fieldName, index) => {
          const fieldValue = wheres2[fieldName]
          if (fieldName.indexOf('__')>=0) {
            const fieldNames = fieldName.split('__')
            const objectName = fieldNames[0]
            const pathName = fieldNames[1]
            Object.keys(fieldValue).map(operatorName => {
              const value = fieldValue[operatorName] // _eq : 1
              const result = items.filter(item => {
                return operate(operatorName, item[objectName][pathName], value)
              })
              result && parts[key].push(...result)
              return true
            })
          } else {
            Object.keys(fieldValue).map(operatorName => {
              const value = fieldValue[operatorName] // _eq : 1
              const result = items.filter(item => {
                return operate(operatorName, item[fieldName], value)
              })
              result && parts[key].push(...result)
              return true
            })
          }
        })
      })
      
      results = parts.reduce((previous, current) => {
        if (previous.length > 0) {
          if (fieldName==='_and') {
            return current.filter(a => previous.some(b => a.id === b.id)); 
          } else if (fieldName==='_or') {
            return current.filter(a => previous.some(b => a.id !== b.id));
          }
        } else {
          return current
        }
      }, [])
    } else {
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
    }
    return true
  })
  return results
}

const sort = (type, a, b) => {
  if (typeof a === 'number') {
    if (type==='asc') return a - b
    else return b - a
  } else if (typeof a === 'string') {
    if (type==='asc') return a.localeCompare(b)
    else {
      return b.localeCompare(a)
    }
  } else {
    return false
  }
}

const orderBy = (results, order_by) => {
  const orderBys = JSON.parse(JSON.stringify(order_by))
  Object.keys(orderBys).map(fieldName => {
    const sortType = orderBys[fieldName]
    if (fieldName.indexOf('__')>=0) {
      const fieldNames = fieldName.split('__')
      const objectName = fieldNames[0]
      const pathName = fieldNames[1]
      results = results.sort((a, b) => {
        return sort(sortType, a[objectName][pathName], b[objectName][pathName])
      })
    } else {
      results = results.sort((a, b) => {
        return sort(sortType, a[fieldName], b[fieldName])
      })
    }
    return true
  })
  return results
}

const argumenter = (args, items) => {
  let results = []

  if (args.where) {
    results = where(results, args.where, items)  
  } else {
    results = items
  }

  if (args.order_by) {
    results = orderBy(results, args.order_by)
  }

  if (args.limit) {
    results = results.slice(0, args.limit)
  }

  return results
}

const resolvers = {
  Query: {
    users(parent, args, context, info) {
      if (args) return argumenter(args, users)
      return users
    },
    products(parent, args, context, info) {
      if (args) return argumenter(args, products)
      return products
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