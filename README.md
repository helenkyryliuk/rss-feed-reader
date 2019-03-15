[![Build Status](https://travis-ci.org/helenkyryliuk/project-lvl3-s402.svg?branch=master)](https://travis-ci.org/helenkyryliuk/project-lvl3-s414)
[![Maintainability](https://api.codeclimate.com/v1/badges/b7016cda432015a47740/maintainability)](https://codeclimate.com/github/helenkyryliuk/project-lvl3-s414/maintainability)

# RSS Feed Reader 

### Homepage: http://helen-rss.surge.sh

## :white_check_mark: General info

[RSS](https://en.wikipedia.org/wiki/RSS) Reader with automatic updating.


## :arrow_forward: How to Run App

1. cd to the repo
2. Setup
  - run `make install`
2. Run Build
  - run `make develop`

## :hammer: Technologies

Project is created with:
* ES6
* AJAX using Axios
* Node.js
* JQuery
* Webpack
* DOMParser
* CORS Proxy
* WatchJS (pattern Observer for View)


## :file_folder: Examples

Provide a valid [rss](https://en.wikipedia.org/wiki/RSS) feed link. Click Add new feed to load all the latest channel articles with links, titles, and description.

<p align="center">
  <img alt="RSS Reader main page" width="800" src="https://user-images.githubusercontent.com/29301041/54170283-f413ac00-44da-11e9-9a5a-1122ca235aad.png">
</p>

Each of the channels will be automatically updated every 5 seconds. All the new articles that appear in the channel will be loaded to the feed.

<p align="center">
  <img alt="RSS Reader automatically updates channel" width="800" src="https://user-images.githubusercontent.com/29301041/54170102-3c7e9a00-44da-11e9-9229-bdac6403106b.png">
</p>