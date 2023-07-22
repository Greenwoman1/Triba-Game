import React, { useState } from 'react';
import * as api from '../api';
const Grade = ({ playerId }) => {
    const [grade, setGrade] = useState(0);
  
    const handleGradeChange = (event) => {
      setGrade(Number(event.target.value));
    };
  
    const submit = async () => {
      await api.updateGrade(grade);
     
    };
  
    return (
      <div>
        <h2>Ocijenite svog protivnika</h2>
        <input
          type="number"
          name="grade"
          id="grade"
          min="1"
          max="5"
          onChange={handleGradeChange}
          required
        />
        <button onClick={submit}>Submit</button>
      </div>
    );
  };
  
  export default Grade;



