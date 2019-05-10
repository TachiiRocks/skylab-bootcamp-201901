const express = require('express');
const { bodyParser, cookieParser, injectLogic, checkLogin } = require('./middlewares');
const render = require('./render');
const package = require('./package.json');
const { Login, Register, Home, DuckDetail } = require('./components');

const {
  argv: [, , port = 8080],
} = process;

const app = express();

app.use(express.static('public'));

app.use(cookieParser, injectLogic);

app.get('/', checkLogin('/home'), (req, res) => {
  res.send(
    req.root.render(`<h1>Welcome to this Web Application</h1>
<a href="/register">Register</a> or <a href="/login">Login</a>`)
  );
});

app.get('/register', checkLogin('/home'), (req, res) => {
  res.send(req.root.render(new Register().render()));
});

app.post('/register', [checkLogin('/home'), bodyParser], (req, res) => {
  const {
    body: { name, surname, email, password },
    logic,
  } = req;

  try {
    logic
      .registerUser(name, surname, email, password)
      .then(() =>
        res.send(req.root.
          render(
            `<p>Ok, user correctly registered, you can now proceed to <a href="/login">login</a></p>`
          )
        )
      )
      .catch(({ message }) => {
        res.send(req.root.render(new Register().render({ name, surname, email, message })));
      });
  } catch ({ message }) {
    res.send(req.render(new Register().render({ name, surname, email, message })));
  }
});

app.post('/logout',  (req, res) => {
  res.setHeader('set-cookie', [`token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`]);
  res.redirect('/');
});

app.get('/login', checkLogin('/home'), (req, res) => res.send(req.root.render(new Login().render())));

app.post('/login', [checkLogin('/home'), bodyParser], (req, res) => {
  const {
    body: { email, password },
    logic,
  } = req;

  try {
    logic
      .loginUser(email, password)
      .then(() => {
        res.setHeader('set-cookie', [`token=${logic.__userToken__}`]);
        res.redirect('/home');
      })
      .catch(({ message }) => res.send(rq.root.render(new Login().render({ email, message }))));
  } catch ({ message }) {
    res.send(req.root.render(new Login().render({ email, message })));
  }
});

app.get('/home', checkLogin('/', false), (req, res) => {
  const { logic, url } = req;

  logic
    .retrieveUser()
    .then(({ name }) => {
      const { query } = req.query;
      if (query) {
        req.logic
          .searchDucks(query)
          .then(listDucks => res.send(req.root.render(new Home().render({ name, listDucks, query }))));
      } else {
        res.send(req.root.render(new Home().render({ name })));
      }
    })
    .catch(({ message }) => res.send(render(`<p>${message}</p>`)));
});

app.get('/detail/:id', checkLogin('/', false), (req, res) => {
  const {
    logic,
    params: { id },
    query: { query = '' },
  } = req;

  logic
    .retrieveDuck(id)
    .then(duck => res.send(req.root.render(new DuckDetail().render({ ...duck, query }))));
});

app.use((req, res) => {
  res.redirect('/')
});

app.listen(port, () => console.log(`${package.name} ${package.version} up on port ${port}`));
