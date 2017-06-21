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
    const { containerHeight } = this.props;
    if(!containerHeight){
      window.addEventListener('scroll', this.handleScroll);
    }else{
      this.refs.container.addEventListener('scroll', this.handleScroll);
    }
  }
  componentWillUnmount(){
    if(!containerHeight){
      window.removeEventListener('scroll', this.handleScroll);
    }else{
      this.refs.container.removeEventListener('scroll', this.handleScroll);
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.offsetElementEnd != this.state.offsetElementEnd)
      return true;
    else
      return false;
  }
  ///////////////////////////////////////////////////////////////// HANDLERS 
  handleScroll({currentTarget}){
    const { elementHeight } = this.props,
          { ulHeight } = this.state,
          offset = currentTarget.scrollTop != undefined ? currentTarget.scrollTop : currentTarget.pageYOffset,
          indexElement = offset / elementHeight;

    let minIndex = Math.max(Math.ceil(indexElement) - 1, 0);
    let elementsCountOnWindow = Math.ceil(ulHeight / elementHeight)
    
    this.setState({
      offsetElementStart: minIndex,
      offsetElementEnd: minIndex + elementsCountOnWindow
    });

  }
  handleContainerScroll(event){
    console.log(event.currentTarget.scrollTop)
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
  getContainerStyles(){
    const { containerHeight } = this.props,
          { ulHeight } = this.state;

    if(containerHeight){
      return {
        height: ulHeight,
        overflow: 'hidden',
        overflowY: 'scroll'
      }
    }else{
      return {}
    }
  }
  render(){
    const itemsToShow = this.getItemsToShow(),
          firstDivHeight = this.getFirstDivHeight(),
          lastDivHeight = this.getLastDivHeight(firstDivHeight),
          containerStyles = this.getContainerStyles();

    return (
      <ul style={containerStyles} ref="container">
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
  itemsOutsideTheBox: PropTypes.number
}

InfinitePager.defaultProps = {
  itemsOutsideTheBox: 2
}