import React from 'react';
import './ImgForm.css'

const ImgForm = ({onInputChange,onButtonClick}) =>{
    return (
        <div>
            <p>
                {'This Site Will Detect Faces in Your Pictures'}
            </p>
            <div className='center'>
                <div className='center form pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center'  type='text' onChange={onInputChange}/>
                <button className='w-30 grow f4 link ph3 dib white bg-light-purple'onClick={onButtonClick}>Detect</button>
            </div>
            </div>
        </div>
    );
}
export default ImgForm