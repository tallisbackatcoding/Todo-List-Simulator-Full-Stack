import React from 'react';
import { withRouter } from 'react-router-dom';
import  './App.css'; 
import Wrapper from './Wrapper/Wrapper';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(){
  
  return (
    <div>
      <Wrapper/>
    </div>
  )
}

export default withRouter(App);
