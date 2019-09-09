[![Build Status](https://travis-ci.org/helenkyryliuk/rss-feed-reader.svg?branch=master)](https://travis-ci.org/helenkyryliuk/rss-feed-reader)
[![Maintainability](https://api.codeclimate.com/v1/badges/e6b511b860c3ca2940a2/maintainability)](https://codeclimate.com/github/helenkyryliuk/rss-feed-reader/maintainability)
# RSS Feed Reader 

## :white_check_mark: General info

### Homepage: http://helen-rss.surge.sh

[RSS](https://en.wikipedia.org/wiki/RSS) Reader with automatic updating of all the feeds every 5 seconds.

## :file_folder: Examples

Provide a valid [rss](https://en.wikipedia.org/wiki/RSS) feed link. Click Add new feed to load all the latest channel articles with links, titles, and description.

RSS links to test:
* [US News](http://www.cbn.com/cbnnews/us/feed/) - The latest CBN US news
* [Link](http://lorem-rss.herokuapp.com/feed?unit=second) - RSS with every second update

<p align="center">
  <img alt="RSS Reader main page" src="https://user-images.githubusercontent.com/29301041/58387899-fbbf0780-806a-11e9-8cd4-9a8f5a73229a.gif">
</p>

All feeds will be automatically updated every 5 seconds even after reloading the page. All the new articles that appear in the Rss will be loaded to the feed.

<p align="center">
  <img alt="RSS Reader automatically updates channel" src="https://user-images.githubusercontent.com/29301041/58387994-6cb2ef00-806c-11e9-8181-a9b23984eed9.gif">
</p>

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

