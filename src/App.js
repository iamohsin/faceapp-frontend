import React,{Component} from 'react';
import './App.css';
import Navi from './Components/Nav/Navi.js';
import Logo from './Components/Logo/Logo';
import Rank from './Components/Rank/Rank';
import FaceFinder from './Components/FaceFinder/FaceFinder';
import Particles from 'react-particles-js';
import ImgForm from './Components/ImgForm/ImgForm';
import Clarifai from 'clarifai';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';


const app = new Clarifai.App({
    apiKey: '819644da0fbf4b548d16b072c9b6ae77'
   });

const particleoptions = {
  
 
    "particles": {
        "number": {
            "value": 2000,
            "density": {
                "enable": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "speed": 4,
                "size_min": 0.3
            }
        },
        "line_linked": {
            "enable": false
        },
        "move": {
            "random": true,
            "speed": 1,
            "direction": "top",
            "out_mode": "out"
        }
    },
    "interactivity": {
        "events": {
            "onhover": {
                "enable": false,
                "mode": "bubble"
            },
            "onclick": {
                "enable": !true,
                "mode": "repulse"
            }
        },
        "modes": {
            "bubble": {
                "distance": 250,
                "duration": 2,
                "size": 0,
                "opacity": 0
            },
            "repulse": {
                "distance": 400,
                "duration": 4
            }
        }
      }}

const initialState={
        input:'',
        imgUrl:'',
        box: {},
        route: 'signin',
        isSignIn: false,
        user:{
            id:'',
            name:'',
            email:'',
            entries:'',
            joined: ''
        }

}

class App extends Component{
    constructor(){
        super();
        this.state=initialState;
    }

    loadUser=(data)=>{
        this.setState({user : {

            id:data.id,
            name:data.name,
            email:data.email,
            entries:data.entries,
            joined: data.joined
        }
        })

    }



calFaceLocation = (data)=>{
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return{
        leftCol: clarifaiFace.left_col*width,
        topRow: clarifaiFace.top_row*height,
        rightCol: width-(clarifaiFace.right_col*width),
        bottomRow: height-(clarifaiFace.bottom_row*height)
    }
    
}

displayFaceBox =(box)=>{
    this.setState({box:box});
}

  onInputChange = (event) => {
      this.setState({input: event.target.value});
  }

  onButtonClick =() =>{
    this.setState({imgUrl : this.state.input});
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>{
        if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count}))
              })
              .catch(console.log)
    }
        this.displayFaceBox( this.calFaceLocation(response))
    })
      .catch(err=>console.log(err));
      
  }
  onRouteChange = (route) => {
      if(route==='signout'){
          this.setState(initialState)
      }else{
        if(route==='home'){
            this.setState({isSignIn:true})
        }
      }
      this.setState({route: route})
  }
  


  render(){
  return (
    <div className="App">
            <Particles className='particles' 
              params={particleoptions}
               
              />
    <Navi isSignIn={this.state.isSignIn} onRouteChange={this.onRouteChange} /> 
    { this.state.route==='home' ? 
    <div>       
    <Logo />
    <Rank
        name={this.state.user.name}
        entries={this.state.user.entries}
              />
    <ImgForm 
        onInputChange={this.onInputChange} 
        onButtonClick={this.onButtonClick} />
    <FaceFinder 
        box= {this.state.box} 
        imgUrl={this.state.imgUrl}/>
    </div>
    : (
        this.state.route==='signin' || this.state.route==='signout' ?
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    )
     
  }
    </div>
  );
}}
export default App;
