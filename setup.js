const marklogic = require('marklogic');
const connection = require('./connection');
const db = marklogic.createDatabaseClient(connection);
const fs = require('fs');
const http = require('http');

const pathToMusicFile = 'binaries/jbalvin-safari.mp3';
const pathToImageFile = 'binaries/jbalvin.jpg';
const pathToClipFile = 'binaries/jbalvin-ay-vamos.mp4';

const musicUri = '/songs/jbalvin-safari.mp3';
const imageUri = '/images/jbalvin.jpg';
const clipUri = '/clips/jbalvin-ay-vamos.mp4';

const musicReadStream = fs.createReadStream(pathToMusicFile);
const imageReadStream = fs.createReadStream(pathToImageFile);
const clipReadStream = fs.createReadStream(pathToClipFile);

db.documents.write(
  {
    uri: musicUri,
    contentType: 'audio/mpeg',
    properties: {
      artist: 'J Balvin',
      title: 'Safari',
      album: 'Energia'
    },
    content: musicReadStream
  },
  {
    uri: imageUri,
    contentType: 'image/jpeg',
    content: imageReadStream
  },
  {
    uri: clipUri,
    contentType: 'video/mp4',
    properties: {
      artist: 'J Balvin',
      title: 'Ay Vamos',
      album: 'La Familia'
    },
    content: clipReadStream
  }
)
.result((response) => response.documents.map((document) =>
  console.log('Inserted', document.uri))
)
.catch((error) => console.log(error));
