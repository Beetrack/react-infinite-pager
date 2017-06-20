import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class InfinitePager extends Component{
  ///////////////////////////////////////////////////////////////// REACT LIFECYCLE 
  constructor(props){
    super(props);

    const { elementHeight } = this.props, 
          ulHeight = this.getUlHeight();

    this.handleScroll = this.handleScroll.bind(this);

    this.state = {
      offsetElementStart: 0,
      offsetElementEnd: Math.ceil(ulHeight / elementHeight),
      ulHeight: ulHeight,
      isScrolling: false
    }
  }
  componentDidMount(){
    const { useWindowAsScrollContainer } = this.props;
    if(useWindowAsScrollContainer){
      window.addEventListener('scroll', this.handleScroll);
    }
  }
  componentWillUnmount(){
    if(useWindowAsScrollContainer){
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.offsetElementEnd != this.state.offsetElementEnd)
      return true;
    else
      return false;
  }
  ///////////////////////////////////////////////////////////////// HANDLERS 
  handleScroll(event){
    const { pageYOffset, scrollY } = window,
          { elementHeight } = this.props,
          indexElement = pageYOffset / elementHeight;

    let minIndex = Math.max(Math.ceil(indexElement) - 1, 0);
    let elementsCountOnWindow = Math.ceil(this.state.ulHeight / elementHeight)

    this.setState({
      offsetElementStart: minIndex,
      offsetElementEnd: minIndex + elementsCountOnWindow
    });

  }
  getItemsToShow(){
    const { children } = this.props;

    return children.slice(this.state.offsetElementStart, this.state.offsetElementEnd + 3);
  }
  ///////////////////////////////////////////////////////////////// METHODS 
  getUlHeight(){
    const {containerHeight} = this.props;
    return containerHeight ? containerHeight : window.innerHeight;
  }
  render(){
    const {elementHeight, totalElements, containerHeight, children} = this.props,
          {offsetElementStart, offsetElementEnd} = this.state,
          itemsToShow = this.getItemsToShow(),
          firstDivHeight = offsetElementStart * elementHeight,
          lastDivHeight = (elementHeight * totalElements) - ((offsetElementEnd - offsetElementStart)* elementHeight) - firstDivHeight;

    return (
      <ul style={{height: this.state.ulHeight}}>
        <div style={{ height: firstDivHeight }}></div>
        { itemsToShow }
        <div style={{ height: lastDivHeight }}></div>
      </ul>
    );
  }
}

InfinitePager.PropTypes = {
  elementHeight: PropTypes.number.isRequired,
  totalElement: PropTypes.number.isRequired,
  containerHeight: PropTypes.number,
  useWindowAsScrollContainer: PropTypes.bool
}

InfinitePager.defaultProps = {
  useWindowAsScrollContainer: true
}