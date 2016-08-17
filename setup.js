const marklogic = require('marklogic');
const connection = require('./connection');
const db = marklogic.createDatabaseClient(connection);
const fs = require('fs');
const http = require('http');

const pathToMusicFile = 'binaries/robingrey-thesedays.mp3';
const pathToImageFile = 'binaries/sanandres.jpg';
const pathToClipFile = 'binaries/bunny.mp4';

const musicUri = '/songs/robingrey-thesedays.mp3';
const imageUri = '/images/sanandres.jpg';
const clipUri = '/clips/bunny.mp4';

const musicReadStream = fs.createReadStream(pathToMusicFile);
const imageReadStream = fs.createReadStream(pathToImageFile);
const clipReadStream = fs.createReadStream(pathToClipFile);

db.documents.write(
  {
    uri: musicUri,
    contentType: 'audio/mpeg',
    properties: {
      artist: 'Robin Grey',
      title: 'These Days',
      album: 'Only The Missle'
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
      info: 'https://peach.blender.org/',
      title: 'Big Buck Bunny',
    },
    content: clipReadStream
  }
)
.result((response) => response.documents.map((document) =>
  console.log('Inserted', document.uri))
)
.catch((error) => console.log(error));
