'use strict';

const marklogic = require('marklogic');
const connection = require('./connection');
const db = marklogic.createDatabaseClient(connection);
const qb = marklogic.queryBuilder;
const http = require('http');

http.createServer((req, res) => {
  const uri = req.url;
  if (uri === '/favicon.ico') {
    res.end();
    return;
  }
  if (uri !== '/') {
    db.documents.probe(uri).result().then(response => {
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
          'Content-Disposition': 'filename=' + uri,
          'Content-Range': 'bytes ' + start + '-' + end + '/' + contentLength,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType
        };

        res.writeHead(206, header);

        let stream = db.documents.read({uris: uri, range: [start, streamEnd]}).stream('chunked');
        stream.pipe(res);
        stream.on('error', error => console.log(error));
        stream.on('end', () => res.end());
      } else {
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', contentLength);
        let stream = db.documents.read({uris: uri}).stream('chunked');
        stream.on('error', error => console.log(error));
        stream.pipe(res);
      }
    }).catch((error) => console.log(error));
  }
}).listen(3000, () => console.log('Magic happens on port 3000. Please open a browser and go to an endpoint that represents a URI in your MarkLogic database, e.g.: "http://localhost:3000/clips/jbalvin-ay-vamos.mp4"'));
