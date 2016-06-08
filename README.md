bootstrap-progress-modal
==============

A live demo can be found at: http://seanhuber.com/demos/bs-progress-modal/demo.html

![Screenshot](https://cdn.rawgit.com/seanhuber/bootstrap-progress-modal/master/screenshot.png)

bootstrap-progress-modal is a jQuery widget that displays a Bootstrap 3 modal multi-step progress indicators.  It is similar to a progress bar, but allows the user to see more detailed information about what is happening during progress (like a command-line installation).

Requirements
-----------------

Bootstrap version >= 3.1.0 (it has not yet been tested on Bootstrap 4).

jQuery version 1.9.0 or newer.

Installation
-----------------

With Bower:

```
bower install bootstrap-progress-modal
```

Or grab the scripts and styles and manually insert them in `<head>`:

```html
<script src="bootstrap-progress-modal.js" type="text/javascript" charset="utf-8"></script>
<link rel="stylesheet" href="bootstrap-progress-modal" type="text/css" media="screen" />
```

Or if you are using Ruby on Rails, this widget has been packaged into a ruby gem (thanks to the folks at https://rails-assets.org).  Add to your `Gemfile`:

```ruby
gem 'rails-assets-bootstrap-progress-modal', source: 'https://rails-assets.org'
```

Run `bundle install` and then update your asset pipeline.

Add to `app/assets/javascripts/application.js`:

```javascript
//= require bootstrap-progress-modal
```

Add to `app/assets/stylesheets/application.css`:

```css
/*
 *= require bootstrap-progress-modal
 */
```

Basic Usage
-----------------

```html
<div id='progress_modal_anchor'></div>

<script>
$('#progress_modal_anchor').progressModal({ // the modal will be displayed when the anchor element is clicked

  steps: { // keys are numbers 1 through N, values are step options
    1: {
      label: 'Step 1', // a string that'll appear in the modal near an icon indicating the status of this step

      startFunction: function() { // a callback for performing this step
        console.log('...step 1 started');
        setTimeout( function() {
          $('#progress_modal_anchor').progressModal('proceed'); // proceed indicates the step is complete and to start the next step
        }, 500);
      }
    },
    2: {
      label: 'Step 2',
      startFunction: function() {
        console.log('...step 2 started');
        setTimeout( function() {
          $('#progress_modal_anchor').progressModal('proceed');
        }, 500);
      }
    },
    3: {
      label: 'Step 3',
      startFunction: function() {
        console.log('...step 3 started');
        setTimeout( function() {
          // hault shows a caution icon next to the current step.  The 2nd argument is an html string to display in the modal during the hault
          $('#progress_modal_anchor').progressModal('hault', "<h1>Haulted!</h1><a class='btn btn-default pq-hault'>Continue</a>");
          $('.pq-hault.btn').click( function() {
            $('#progress_modal_anchor').progressModal('proceed');
            return false;
          });
        }, 500);
      }
    },
    4: {
      label: 'Step 4',
      startFunction: function() {
        console.log('...step 4 started');
        setTimeout( function() {
          $('#progress_modal_anchor').progressModal('proceed');
        }, 500);
      }
    },
    5: {
      label: 'Step 5',
      startFunction: function() {
        console.log('...step 5 started');
        setTimeout( function() {
          $('#progress_modal_anchor').progressModal('fail'); // fail() prevents the queue from proceeding to the next step and closes the modal
        }, 500);
      }
    },
    6: {
      label: 'Step 6',
      startFunction: function() {
        console.log('...step 6 started');
        setTimeout( function() {
          $('#progress_modal_anchor').progressModal('proceed');
        }, 500);
      }
    }
  }
});
</script>
```


License
-----------------

MIT-LICENSE.
