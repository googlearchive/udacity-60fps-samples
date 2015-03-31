APP.Main = (function() {

  var stories = null;
  var storyStart = 0;
  var count = 100;
  var $ = document.querySelector.bind(document);
  var main = $('main');

  var storyTemplate =
      Handlebars.compile($('#tmpl-story').textContent);
  var storyDetailsTemplate =
      Handlebars.compile($('#tmpl-story-details').textContent);

  /**
   * As every single story arrives in shove its
   * content in at that exact moment. Feels like something
   * that should really be in a requestAnimationFrame.
   */
  function onStoryData (key, details) {
    var story = document.querySelector('#s-' + key);
    var html = storyTemplate(details);
    story.innerHTML = html;
    story.addEventListener('click', onStoryClick.bind(this, details));
  }

  function onStoryClick(details) {

    var storyDetails = $('sd-' + details.id);

    // Create and append the story. A visual change...
    // perhaps that should be in a requestAnimationFrame?
    // And maybe, since they're all the same, I don't
    // need to make a new element every single time? I mean,
    // it inflates the DOM and I can only see one at once.
    if (!storyDetails) {

      var html = storyDetailsTemplate(details);
      storyDetails = document.createElement('section');
      storyDetails.setAttribute('id', 'sd-' + details.id);
      storyDetails.classList.add('story-details');
      storyDetails.innerHTML = html;

      var closeButton = storyDetails.querySelector('.js-close');
      closeButton.addEventListener('click', hideStory.bind(this, details.id));

      document.body.appendChild(storyDetails);
    }

    // Wait a little time then show the story details.
    setTimeout(showStory.bind(this, details.id), 30);
  }

  function showStory(id) {

    var storyDetails = $('#sd-' + id);
    var left = null;

    function animate () {

      // Find out where it currently is.
      var storyDetailsPosition = storyDetails.getBoundingClientRect();

      // Set the left value if we don't have one already.
      if (left === null)
        left = storyDetailsPosition.left;

      // Now figure out where it needs to go.
      left += (0 - storyDetailsPosition.left) * 0.1;

      // Set up the next bit of the animation if there is more to do.
      if (Math.abs(left) > 0.5)
        setTimeout(animate, 4);
      else
        left = 0;

      // And update the styles. Wait, is this a read-write cycle?
      // I hope I don't trigger a forced synchronous layout!
      storyDetails.style.left = left + 'px';
    }

    // We want slick, right, so let's do a setTimeout
    // every few milliseconds. That's going to keep
    // it all tight. Or maybe we're doing visual changes
    // and they should be in a requestAnimationFrame
    setTimeout(animate, 4);
  }

  function hideStory(id) {

    var storyDetails = $('#sd-' + id);
    var left = 0;

    function animate () {
      // Find out where it currently is.
      var mainPosition = main.getBoundingClientRect();
      var storyDetailsPosition = storyDetails.getBoundingClientRect();

      // Now figure out where it needs to go.
      left += (mainPosition.width - storyDetailsPosition.left) * 0.1;

      // Set up the next bit of the animation if there is more to do.
      if (Math.abs(left) > 0.5)
        setTimeout(animate, 4);
      else
        left = 0;

      // And update the styles. Wait, is this a read-write cycle?
      // I hope I don't trigger a forced synchronous layout!
      storyDetails.style.left = left + 'px';
    }

    // We want slick, right, so let's do a setTimeout
    // every few milliseconds. That's going to keep
    // it all tight. Or maybe we're doing visual changes
    // and they should be in a requestAnimationFrame
    setTimeout(animate, 4);
  }

  main.addEventListener('scroll', function() {

    var header = $('header');
    var headerTitles = header.querySelector('.header__title-wrapper');
    var scrollTopCapped = Math.min(70, main.scrollTop);

    header.style.height = (156 - scrollTopCapped) + 'px';
    headerTitles.style.transform = 'scale(' +
      (1 - (scrollTopCapped / 300)) + ')';

    // Add a shadow...
    if (main.scrollTop > 70)
      header.classList.add('raised');
    else
      header.classList.remove('raised');

    // Add a 'subtle' parallax effect here...

  });

  // Bootstrap in the stories.
  APP.Data.getTopStories(function(data) {

    stories = data;

    for (var i = storyStart; i < count; i++) {
      if (!stories[i])
        return;

      var key = String(stories[i]);
      var story = document.createElement('div');
      story.setAttribute('id', 's-' + key);
      story.classList.add('story');
      story.innerHTML = storyTemplate({
        title: '...',
        score: '-',
        by: '...'
      });
      main.appendChild(story);

      APP.Data.getStoryById(stories[i], onStoryData.bind(this, key));
    }

  });

})();
