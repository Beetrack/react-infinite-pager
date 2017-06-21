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
      ulHeight: ulHeight
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
          { ulHeight } = this.state,
          indexElement = pageYOffset / elementHeight;

    let minIndex = Math.max(Math.ceil(indexElement) - 1, 0);
    let elementsCountOnWindow = Math.ceil(ulHeight / elementHeight)

    this.setState({
      offsetElementStart: minIndex,
      offsetElementEnd: minIndex + elementsCountOnWindow
    });

  }
  getItemsToShow(){
    const { children, itemsOutsideTheBox } = this.props;

    return children.slice(this.state.offsetElementStart, this.state.offsetElementEnd + itemsOutsideTheBox);
  }
  ///////////////////////////////////////////////////////////////// METHODS 
  getUlHeight(){
    const {containerHeight} = this.props;
    return containerHeight ? containerHeight : window.innerHeight;
  }
  getFirstDivHeight(){
    const { elementHeight } = this.props,
          { offsetElementStart } = this.state;

    return offsetElementStart * elementHeight;
  }
  getLastDivHeight(firstDivHeight){
    const { elementHeight, totalElements } = this.props,
          { offsetElementStart, offsetElementEnd } = this.state;

    return (elementHeight * totalElements) - ((offsetElementEnd - offsetElementStart)* elementHeight) - firstDivHeight
  }
  render(){
    const { ulHeight } = this.state,
          itemsToShow = this.getItemsToShow(),
          firstDivHeight = this.getFirstDivHeight(),
          lastDivHeight = this.getLastDivHeight(firstDivHeight);

    return (
      <ul style={{ulHeight}}>
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
  useWindowAsScrollContainer: PropTypes.bool,
  itemsOutsideTheBox: PropTypes.number
}

InfinitePager.defaultProps = {
  useWindowAsScrollContainer: true,
  itemsOutsideTheBox: 2
}