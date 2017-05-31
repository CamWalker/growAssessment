
var exports = module.exports = {}
const app = require('./index.js');
const axios = require('axios');


exports.getUserByName = function (req, res) {
  const name = req.params.name;
  axios.get(`https://swapi.co/api/people/?search=${name}`)
    .then((person) => {
      res.render('layout', { person: person.data.results[0] });
    })
}


exports.getUsers = function (req, res) {
  const sortParam = req.query.sort ? req.query.sort : '';
  let characters = []
  function getPeople(address) {
    axios.get(address)
      .then((response) => {
        characters = characters.concat(response.data.results)
        if (characters.length < 50) {
          getPeople(response.data.next)
        } else {

          function compare(a, b) {
            if (Number(a[sortParam]) < Number(b[sortParam]))
              return -1;
            if (Number(a[sortParam]) > Number(b[sortParam]))
              return 1;
            return 0;
          }

          function compareString(a, b) {
            if (a[sortParam] < b[sortParam])
              return -1;
            if (a[sortParam] > b[sortParam])
              return 1;
            return 0;
          }

          if (sortParam === 'name') {
            characters.sort(compareString);
          } else {
            characters.sort(compare);
          }
          res.status(200).send(characters)
        }
      })
  }

  getPeople(`https://swapi.co/api/people/`);
}


exports.getPlanetResidents = function (req, res) {
  let planetResidents = {};
  let characters = [];
  characters.length = 87;
  function getPlanets(address) {
    axios.get(address)
      .then((planets) => {
        planets.data.results.forEach((v, i) => {
          planetResidents[v.name] = v.residents;
        })
        if (planets.data.next) {
          getPlanets(planets.data.next);
        } else {
          function getPeople(address) {
            axios.get(address)
              .then((response) => {
                response.data.results.forEach(v => {
                  characters[Number(v.url.slice(27, v.url.length - 1)) - 1] = v.name
                })
                if (response.data.next) {
                  getPeople(response.data.next)
                } else {
                  for (let key in planetResidents) {
                    for( let i = 0; i < planetResidents[key].length; i++) {
                      let url = planetResidents[key][i]
                      planetResidents[key][i] = characters[Number(url.slice(27, url.length - 1)) - 1]
                    }
                  }
                  res.status(200).send(planetResidents)
                }
              })
          }
          getPeople(`https://swapi.co/api/people/`);
        }
      })
  }
  getPlanets('https://swapi.co/api/planets/')
}
