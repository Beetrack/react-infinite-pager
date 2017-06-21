import React from 'react';
import ReactDOM from 'react-dom';
import InfinitePager from '../../src/components/infinite-pager.jsx';

const elements = [];

for(let $i = 0; $i <= 30; $i++){
    elements.push(
      <li key={`key-list-${$i}`}>
        { $i }
      </li>
    );
}

ReactDOM.render( 
  <InfinitePager
    elementHeight={ 60 }
    totalElements={ 30 }
    containerHeight={ 300 }
  >
    { elements }
  </InfinitePager>, 
  document.getElementById('root') );