function modalOpts( $anchor, assert ) {
  var steps = {};
  for (var i = 1; i <= 6; i++) {
    steps[i] = {
      label: 'Step ' + i.toString(),
      startFunction: function() {
        assert.ok( true, 'step '+i.toString()+' reached' );
        $anchor.progressModal('proceed');
      }
    };
  }
  return {steps: steps};
}

function setAnchor( test_num, assert ) {
  var done = assert.async();
  var $anchor = $("<button id='test"+test_num.toString()+"'>click me</button>");
  $anchor.appendTo('body');
  $anchor.progressModal( modalOpts($anchor, assert) );
  $anchor.on('progressmodalhidden', function() {
    assert.ok( true, 'modal closed' );
    $anchor.remove();
    done();
  });
  return $anchor;
}

function setStartFunction( $anchor, step_num, func ) {
  $anchor.data('sh-progressModal').options.steps[step_num].startFunction = func;
}

QUnit.test( 'it progresses through all steps without error', function( assert ) {
  expect(7);
  $anchor = setAnchor(1, assert);
  $anchor.click();
});

QUnit.test( 'it fails on step 4', function( assert ) {
  expect(5);
  $anchor = setAnchor(2, assert);
  setStartFunction( $anchor, 4, function() {
    $anchor.progressModal('fail');
    assert.ok( true, 'step 4 reached but failed' );
  });
  setStartFunction( $anchor, 5, function() {
    assert.ok( false, 'step 5 should not be reached' );
  });
  $anchor.click();
});

QUnit.test( 'it halts on step 2 and proceeds', function( assert ) {
  expect(8);
  $anchor = setAnchor(3, assert);
  setStartFunction( $anchor, 2, function() {
    assert.ok( true, 'step 4 reached' );
    $anchor.progressModal('hault', "<h1>Haulted!</h1><a class='btn btn-default pq-hault'>Continue</a>");
    assert.ok( $('.pq-hault').is(':visible'), 'haulting content is displayed on step 2' );
    $anchor.progressModal('proceed');
  });
  $anchor.click();
});

QUnit.test( 'it halts on step 3 and fails', function( assert ) {
  expect(4);
  $anchor = setAnchor(4, assert);
  setStartFunction( $anchor, 2, function() {
    assert.ok( true, 'step 4 reached' );
    $anchor.progressModal('hault', "<h1>Haulted!</h1><a class='btn btn-default pq-hault'>Continue</a>");
    assert.ok( $('.pq-hault').is(':visible'), 'haulting content is displayed on step 2' );
    $anchor.progressModal('fail');
  });
  setStartFunction( $anchor, 5, function() {
    assert.ok( false, 'step 5 should not be reached' );
  });
  $anchor.click();
});
