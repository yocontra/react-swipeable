/* global window:true */
'use strict';

var React = require('react');
var events = require('add-event-listener');
var tweenState = require('react-tween-state');
var merge = require('lodash.merge');
var Draggable = React.createFactory(require('react-draggable'));

function getRotationAngle(v, max, angle) {
  return Math.max(-angle, Math.min(angle, angle * (v / max)));
}

function rotate(deg) {
  var v = 'rotate('+deg+'deg)';
  return {
    transform: v,
    webkitTransform: v,
    mozTransform: v,
    oTransform: v,
    msTransform: v
  };
}

var Swipeable = React.createClass({
  displayName: 'Swipeable',
  mixins: [tweenState.Mixin],
  propTypes: {
    onDragStart: React.PropTypes.func,
    onDragStop: React.PropTypes.func,
    onDrag: React.PropTypes.func,
    onSwipeRight: React.PropTypes.func,
    onSwipeLeft: React.PropTypes.func,
    zIndex: React.PropTypes.number,
    rotationAngle: React.PropTypes.number,
    axis: React.PropTypes.string,
    incompleteAnimation: React.PropTypes.object,
    completeAnimation: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {
      rotationAngle: 20,
      axis: 'both',
      incompleteAnimation: {
        easing: tweenState.easingTypes.easeOutElastic,
        duration: 750,
        endValue: 0
      },
      completeAnimation: {
        easing: tweenState.easingTypes.easeInQuad,
        duration: 500,
        endValue: 0
      }
    };
  },

  getInitialState: function(){
    return {
      rotation: 0,
      breakpoint: null,
      swiped: null,
      leaning: null
    };
  },

  componentDidMount: function(){
    events.addEventListener(window, 'resize', this.setBreakPoint);
    this.setBreakPoint();
  },
  componentWillUnmount: function() {
    events.removeEventListener(window, 'resize', this.setBreakPoint);
  },
  componentDidUpdate: function(){
    this.setBreakPoint();
  },

  setBreakPoint: function(){
    var el = this.getDOMNode();
    var breakpoint = el.offsetWidth / 4;
    if (this.state.breakpoint !== breakpoint) {
      this.setState({breakpoint: breakpoint});
    }
  },

  handleDrag: function(event, ui){
    var pos = ui.position.left;
    var rotateAngle = getRotationAngle(pos, this.state.breakpoint, this.props.rotationAngle);

    if (this.state.swiped) {
      return this.setState({
        rotation: rotateAngle
      });
    }

    // determine which way its leaning
    var leaning = null;
    if (pos >= this.state.breakpoint) {
      leaning = 'right';
    } else if (pos <= -this.state.breakpoint) {
      leaning = 'left';
    }
    ui.leaning = leaning;
    
    this.setState({
      rotation: rotateAngle,
      leaning: leaning
    });

    if (this.props.onDrag) {
      this.props.onDrag(event, ui);
    }
  },
  handleDragStop: function(event, ui){
    if (this.state.swiped) {
      return this.reset(false);
    }

    var pos = ui.position.left;

    if (this.state.leaning === 'right') {
      this.reset(true);
      this.setState({swiped: 'right'}, this.props.onSwipeRight);
    } else if (this.state.leaning === 'left') {
      this.reset(true);
      this.setState({swiped: 'left'}, this.props.onSwipeLeft);
    }

    if (!this.state.swiped &&
      pos !== this.state.breakpoint &&
      pos !== -this.state.breakpoint) {
      this.reset(false);
    }

    if (this.props.onDragStop) {
      this.props.onDragStop(event, ui);
    }
  },

  emulateSwipeRight: function(){
    var movement = this.state.breakpoint*4;
    this.refs.draggable.emulateDrag(movement, -movement);
  },
  emulateSwipeLeft: function(){
    var movement = this.state.breakpoint*4;
    this.refs.draggable.emulateDrag(-movement, -movement);
  },

  reset: function(completed){
    var animation = completed ?
      this.props.completeAnimation :
      this.props.incompleteAnimation;

    if (animation) {
      this.tweenState('rotation', animation);
    } else {
      this.setState({rotation: 0});
    }

    this.refs.draggable.reset(animation, animation);
  },

  render: function(){
    var defaultStyle = {
      position: 'relative',
      userSelect: 'none',
      webkitUserSelect: 'none',
      mozUserSelect: 'none',
      msUserSelect: 'none',
      oUserSelect: 'none',
    };
    var style = merge(defaultStyle, rotate(this.getTweeningValue('rotation')));
    var draggable = Draggable({
      ref: 'draggable',
      axis: this.props.axis,
      onStart: this.props.onDragStart,
      onStop: this.handleDragStop,
      onDrag: this.handleDrag,
      zIndex: this.props.zIndex,
      /*
      ranges: {
        x: [this.state.lowerLimit, this.state.upperLimit]
      },
      */
      style: style,
      className: this.props.className
    }, this.props.children);

    return draggable;
  }
});

module.exports = Swipeable;