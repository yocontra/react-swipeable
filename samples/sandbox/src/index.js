/* global document, window */

'use strict';

var React = require('react');
var Swipeable = React.createFactory(require('../../../src'));
window.React = React; // for dev

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// TODO: figure out how to remove children better
var Stack = React.createClass({
  displayName: 'Stack',
  propTypes: {
    onSwipeRight: React.PropTypes.func,
    onSwipeLeft: React.PropTypes.func
  },
  swipedRight: function(){
    var child = this.props.children.shift();
    if (this.props.onSwipeRight) {
      this.props.onSwipeRight(child);
    }
    this.forceUpdate();
  },
  swipedLeft: function(){
    var child = this.props.children.shift();
    if (this.props.onSwipeLeft) {
      this.props.onSwipeLeft(child);
    }
    this.forceUpdate();
  },
  render: function(){
    // wrap each child in a swipeable
    var children = this.props.children.map(function(child, idx){
      var zIndex = this.props.children.length-idx;
      return Swipeable({
        key: zIndex,
        onSwipeRight: this.swipedRight,
        onSwipeLeft: this.swipedLeft,
        className: 'demo-swipeable',
        zIndex: zIndex
      }, React.addons.cloneWithProps(child));
    }, this);

    // wrap in a dummy container
    var container = React.DOM.div({
      className: this.props.className,
      style: this.props.style
    }, children);

    return container;
  }
});
Stack = React.createFactory(Stack);

var App = React.createClass({
  displayName: 'demo',
  render: function(){
    var stackChildren = arr.map(function(i){
      return React.DOM.div({
        key: String(i)
      }, String(i));
    });
    var stack = Stack(null, stackChildren);
    var container = React.DOM.div({
      className: 'demo-container'
    }, stack);
    return container;
  }
});
App = React.createFactory(App);

React.render(App(), document.body);