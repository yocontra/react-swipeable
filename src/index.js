'use strict';

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var DOM = require('react/lib/ReactDOM');
var PropTypes = require('react/lib/ReactPropTypes');

var Draggable = require('react-draggable');

var rotate = function(deg) {
  var v = 'rotate('+deg+'deg)';
  return {
    transform: v,
    webkitTransform: v,
    mozTransform: v,
    oTransform: v,
    msTransform: v
  };
};

// TODO: curb rotation
// TODO: rotate back if stopped and didnt swipe right or left

var Swipeable = ReactCompositeComponent.createClass({
  displayName: 'Swipeable',
  propTypes: {
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    onDrag: PropTypes.func,
    onSwipeRight: PropTypes.func,
    onSwipeLeft: PropTypes.func,
    zIndex: PropTypes.number,
    rotationAngle: PropTypes.number
  },

  getDefaultProps: function(){
    return {
      rotationAngle: 10
    };
  },

  getInitialState: function(){
    return {
      rotation: 0
    };
  },

  componentDidMount: function(){
    var el = this.getDOMNode();
    this.setState({
      breakpoint: el.clientWidth / 2
    });
  },

  handleDrag: function(event, ui){
    if (ui.position.left >= this.state.breakpoint) {
      this.props.onSwipeRight();
    } else if (ui.position.left <= -this.state.breakpoint) {
      this.props.onSwipeLeft();
    }
    this.setState({
      rotation: ui.position.left / this.props.rotationAngle
    });

    if (this.props.onDrag) {
      this.props.onDrag(event, ui);
    }

    console.log(ui.position.left);
  },

  render: function(){
    var draggable = Draggable({
      axis: 'x',
      onStart: this.props.onDragStart,
      onStop: this.props.onDragStop,
      onDrag: this.handleDrag,
      zIndex: this.props.zIndex,
      ranges: {
        x: [-this.state.breakpoint, this.state.breakpoint]
      },
      style: rotate(this.state.rotation)
    }, this.props.children);

    return draggable;
  }
});

module.exports = Swipeable;