/* global document, window */

'use strict';

var Swipeable = require('../../../src');
var React = require('react');
window.React = React; // for dev

var App = React.createClass({
  displayName: 'demo',
  getInitialState: function(){
    return {};
  },
  swipedRight: function(){
    console.log('swiped right');
  },
  swipedLeft: function(){
    console.log('swiped left');
  },
  render: function(){
    var child = React.DOM.div({
      style: {
        height: 250,
        width: 250,
        backgroundColor: 'red'
      }
    });

    var swipeable = Swipeable({
      onSwipeRight: this.swipedRight,
      onSwipeLeft: this.swipedLeft
    }, child);

    var container = React.DOM.div({
      className: 'demo-container'
    }, swipeable);

    return container;
  }
});

React.renderComponent(App(), document.body);