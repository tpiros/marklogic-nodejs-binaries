# MarkLogic Node.js API - working with binary documents

> Please note that the project requires you to have Node.js v4.4.5 or above and MarkLogic v8.0 or above.

> This project uses binaries that are openly available. Video file (mp4) taken from: [http://www.sample-videos.com/](http://www.sample-videos.com/). Music file (mp3) taken from [http://freemusicarchive.org/curator/creative_commons/](http://freemusicarchive.org/curator/creative_commons/)

## Setup
First make sure that `connection.js` contains the appropriate host, port number as well as the right username and password combination for a REST API instance.

> By default we are using the Documents database.

In order to setup the project dependencies please make sure that you execute `npm install` first.

### Displaying Images
In order to display an image please execute `npm run image`

### Displaying a video using range requests
In order to see range requests in action please execute `npm run range`

### Displaying metadata for binary documents
In order to display the properties metadata assigned to binaries please execute `npm run metadata`

## Example application
A simple example app is also part of this repository that uses [React](https://facebook.github.io/react/) to give some UI components to the UI. The app tries to showcase in a simple way how to display a video and some metadata from the database.

To start the application execute `npm run app`.
