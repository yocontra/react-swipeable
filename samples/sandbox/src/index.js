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
  render: function(){
    return null;
  }
});

React.renderComponent(App(), document.body);