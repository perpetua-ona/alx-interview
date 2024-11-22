#!/usr/bin/node
// Prints all characters of a Star Wars movie

const ID = process.argv[2];
if (!ID) {
  console.error('Please enter a Star Wars Movie ID');
  process.exit(1);
}

const request = require('request');

const options = {
  url: `https://swapi-api.alx-tools.com/api/films/${ID}/`,
  json: true // Automatically parses response as JSON
};

function requestPromise (charUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      url: charUrl,
      json: true
    };
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      resolve(body.name);
    });
  });
}

request(options, (error, response, body) => {
  if (error) {
    console.error(error);
    return;
  }

  if (!body || !body.characters) {
    console.error('Invalid response or movie ID not found');
    process.exit(1);
  }

  const characterPromises = [];

  const charactersUrl = body.characters;
  for (const characterUrl of charactersUrl) {
    const characterPromise = requestPromise(characterUrl);
    characterPromises.push(characterPromise);
  }

  Promise.all(characterPromises)
    .then((results) => {
      results.forEach((result) => {
        console.log(result);
      });
    })
    .catch(error => {
      console.error(error);
    });
