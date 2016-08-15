'use strict';
const marklogic = require('marklogic');
const connection = require('./connection');
const db = marklogic.createDatabaseClient(connection);
const qb = marklogic.queryBuilder;
const express = require('express');
const app = express();
const router = express.Router();

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/', router);
app.set('port', 3000);

const indexRoute = (req, res) => res.sendFile(__dirname + '/index.html');

// Change these values
const uriToImage = '/images/jbalvin.jpg';
const uriToVideoClip = '/clips/jbalvin-ay-vamos.mp4';

const artistImage = (req, res) => {
  let data = [];
  db.documents.read(uriToImage).stream('chunked')
  .on('data', chunks => data.push(chunks))
  .on('error', error => console.log(error))
  .on('end', () => {
    let buffer = new Buffer(data.length).fill(0);
    buffer = Buffer.concat(data);
    res.end(buffer);
  });
};

const artistClip = (req, res) => {
  if (req.query.data && req.query.data === 'meta') {
    db.documents.read({
      uris: uriToVideoClip,
      categories: ['metadata']
    }).result().then(response => res.json(response[0].properties));
  }
  if (req.query.data && req.query.data === 'content') {
    db.documents.probe(uriToVideoClip).result().then(response => {
      let {contentLength, contentType} = response;
      contentLength = Number(contentLength);

      let rangeRequest = req.headers.range;
      if (rangeRequest) {
        let [partialStart, partialEnd] = rangeRequest.replace(/bytes=/, '').split('-');
        let start = Number(partialStart);
        let end = partialEnd ? Number(partialEnd) : contentLength;
        let chunksize = end - start;
        let streamEnd = end;
        end = end - 1;

        let header = {
          'Content-Disposition': 'filename=' + uriToVideoClip,
          'Content-Range': 'bytes ' + start + '-' + end + '/' + contentLength,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType
        };

        res.writeHead(206, header);

        let stream = db.documents.read({uris: uriToVideoClip, range: [start, streamEnd]}).stream('chunked');
        stream.pipe(res);
        stream.on('error', error => console.log(error));
        stream.on('end', () => res.end());
      } else {
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', contentLength);
        let stream = db.documents.read({uris: uriToVideoClip}).stream('chunked');
        stream.on('error', error => console.log(error));
        stream.pipe(res);
      }
    }).catch((error) => console.log(error));
  }
}

router.route('/').get(indexRoute);
router.route(uriToImage).get(artistImage);
router.route(uriToVideoClip).get(artistClip);

app.listen(app.get('port'), () => console.log('Magic happens on port ' + app.get('port') + '. Please make sure that you have updated the URI references in this file.'));
