# graphql-server-complex-query-example

Example GraphQL Server for Complex Query

## Installation

Run on terminal

```sh
git clone https://github.com/hscstudio/grapql-server-complex-query-example.git
cd grapql-server-complex-query-example
npm install
npm run dev
```

You will see below on terminal

```
> nodemon index.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
🚀 Server ready at http://localhost:4000/
```

## Usage

Access GraphQL console `http://localhost:4000`

Input query:

```js
{
  users {
    id
    username
    profile {
      name
      email
    }
    status
  }
}
```

Click run

![](graphql-console.png)

## Example Complex Query

### Where


Find users where username equal `def`

```js
{
  users(where: { username: { _eq: "def" } }) {
    id
    username
    profile {
      name
      email
    }
    status
  }
}
```

Result:

```
{
  "data": {
    "users": [
      {
        "id": 2,
        "username": "def",
        "profile": {
          "name": "Def",
          "email": "def@yahoo.com"
        },
        "status": true
      }
    ]
  }
}
```

Other query:
- `users(where: { profile__email: { _eq: "ghi@gmail.com" } })`
- `users(where: { profile__email: { _like: "gmail" } })`
- `products(where: { price: { _lte: 2000 } })`
- `products(where: { _and: [{ price: { _lt: 5000 }}, { stock: { _gte: 10 }}] })`
- `products(where: { _or: [{ price: { _lt: 5000 }}, { stock: { _gte: 10 }}] })`
- `products(where: { price: { _between: [2000, 5000] } })`

### Available Operator

- `_eq`: equal
- `_in`: in_array
- `_like`: like
- `_lt`: lower than
- `_lte`: lower than equal
- `_gt`: greather than
- `_gte`: greather than equal
- `_and`: and
- `_or`: or
- `_between`: between

## Request Using Other Tools

### Postman

![](graphql-postman.png)


### Javascript Axios

```js
var axios = require('axios');
var data = JSON.stringify({
  query: `{
  products(where: { price: { _lte: 2000 } }) {
    id
    title
    price
    status
  }
}`,
  variables: {}
});

var config = {
  method: 'post',
  url: 'http://localhost:4000',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```
