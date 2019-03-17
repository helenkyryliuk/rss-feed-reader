[![Build Status](https://travis-ci.org/helenkyryliuk/RSS-Feed-Reader.svg?branch=master)](https://travis-ci.org/helenkyryliuk/RSS-Feed-Reader)
[![Maintainability](https://api.codeclimate.com/v1/badges/7741831cd657b74e0cb1/maintainability)](https://codeclimate.com/github/helenkyryliuk/RSS-Feed-Reader/maintainability)
# RSS Feed Reader 

## :white_check_mark: General info

### Homepage: http://helen-rss.surge.sh

[RSS](https://en.wikipedia.org/wiki/RSS) Reader with automatic updating of all the feeds every 5 seconds.


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

RSS links to test:

* Update every second:  http://lorem-rss.herokuapp.com/feed?unit=second
* Update every 30 seconds:  http://lorem-rss.herokuapp.com/feed?unit=second&interval=30
* Update every minute:  http://lorem-rss.herokuapp.com/feed
* https://ru.hexlet.io/blog.rss
* https://ru.hexlet.io/lessons.rss



<p align="center">
  <img alt="RSS Reader main page" width="800" src="https://user-images.githubusercontent.com/29301041/54483337-4deaec00-48b6-11e9-82bf-9499ea37a522.png">
</p>

All feeds will be automatically updated every 5 seconds even after reloading the page. All the new articles that appear in the Rss will be loaded to the feed.

<p align="center">
  <img alt="RSS Reader automatically updates channel" width="800" src="https://user-images.githubusercontent.com/29301041/54483347-71159b80-48b6-11e9-9ee4-80a185d92119.png">
</p>
