'use strict';

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var DOM = require('react/lib/ReactDOM');
var PropTypes = require('react/lib/ReactPropTypes');

var Draggable = require('react-draggable');

var Swipeable = ReactCompositeComponent.createClass({
  displayName: 'Swipeable',
  propTypes: {
    onDrag: PropTypes.func,
    onSwipeRight: PropTypes.func,
    onSwipeLeft: PropTypes.func
  },

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {};
  },

  render: function(){
    return null;
  }
});

module.exports = Swipeable;