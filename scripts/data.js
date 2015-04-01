APP.Data = (function() {

  var HN_API_BASE = 'https://hacker-news.firebaseio.com';
  var HN_TOPSTORIES_URL = HN_API_BASE + '/v0/topstories.json';
  var HN_STORYDETAILS_URL = HN_API_BASE + '/v0/item/[ID].json';

  function getTopStories(callback) {
    request(HN_TOPSTORIES_URL, function(evt) {
      callback(evt.target.response);
    });
  }

  function getStoryById(id, callback) {

    var storyURL = HN_STORYDETAILS_URL.replace(/\[ID\]/, id);

    request(storyURL, function(evt) {
      callback(evt.target.response);
    });
  }

  function getStoryComment(id, callback) {

    var storyCommentURL = HN_STORYDETAILS_URL.replace(/\[ID\]/, id);

    request(storyCommentURL, function(evt) {
      callback(evt.target.response);
    });
  }

  function request(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = callback;
    xhr.send();
  }

  return {
    getTopStories: getTopStories,
    getStoryById: getStoryById,
    getStoryComment: getStoryComment
  };

})();
