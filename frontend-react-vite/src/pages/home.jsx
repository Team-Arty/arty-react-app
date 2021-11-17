import * as React from "react";
import { animated } from "react-spring";
import { useWiggle } from "../hooks/wiggle";
import { Link } from "wouter";
import DataService from "../services/DataService";

function Spinner(){
  return (
    <div class="lds-ripple"><div></div><div></div></div>
  )
}



// Our language strings for the header
const strings = [
  "Hello",
  "Salut",
  "Hola",
  "안녕",
  "Hej",
  "வணக்கம்!",
  "नमस्ते",
  "Guten Tag"
];

// Utility function to choose a random value from the language array
function randomLanguage() {
  return strings[Math.floor(Math.random() * strings.length)];
}


export default function Home() {
  
  const [hello, setHello] = React.useState(strings[0]);
  const [style, trigger] = useWiggle({ x: 5, y: 5, scale: 1 });
  const [image, setImage] = React.useState(null);
  const [emotion, setEmotion] = React.useState(null);


  //GRU-normal
  const [gru_n_prediction, gru_n_setPrediction] = React.useState(true);
  //GRU-artemis
  const [gru_a_prediction, gru_a_setPrediction] = React.useState(true);
  //Artemis-sample
  const [art_s_prediction, art_s_setPrediction] = React.useState(true);
  //Artemis-predict
  const [art_p_prediction, art_p_setPrediction] = React.useState(true);


  // const [outputs, setOutputs] = React.useState([]);
  const[audioPath,setAudioPath]= React.useState("");


  React.useEffect(() => {
    console.log(audioPath," effect.")
  }, [audioPath])

  // When the user clicks we change the header language
  const handleChangeHello = () => {
    
    // Choose a new Hello from our languages
    const newHello = randomLanguage();
    
    // Call the function to set the state string in our component
    setHello(newHello);
  };

  //-------- Predict on Caption using GRU Model -----------
  const handleOnChange= (event) => {
    console.log(event.target.files);
    setImage(URL.createObjectURL(event.target.files[0]));
    gru_n_setPrediction(false)
    gru_a_setPrediction(false)
    art_s_setPrediction(false)
    art_p_setPrediction(false)
    setEmotion("What is this picture making me feel?")
    setAudioPath(false)

    var formData = new FormData();
    formData.append("file", event.target.files[0]);
    
    
    DataService.Predict(formData)
        .then(function (response) {
            console.log(response.data.caption);
            gru_n_setPrediction('"'+response.data.caption_gru.split('').slice(0,-2).join('')+'."');
            gru_a_setPrediction('"'+response.data.caption_art.split('').slice(0,-2).join('')+'."');
        })

 
    DataService.Predict_ART_Caption(formData)
    .then(function (response) {
        console.log(response.data.caption);
        art_p_setPrediction('"'+response.data.caption_pred+'."');
        setEmotion(response.data.emotion_pred);
    })

}

// Handlers
const handleOnSynthesisClick = () => {
  DataService.Text2Audio({ "text": art_p_prediction })
      .then(function (response) {
          // var ops = [...outputs];
          // setOutputs([]);
          //ops.push(response.data);
          // ops.splice(0, 0, response.data);
          // setOutputs(ops);
          setAudioPath(response.data.audio_path);
          console.log(audioPath);
      })
}


  return (
    <>
      <h1 className="title">{hello}!</h1>
      {/* When the user hovers over the image we apply the wiggle style to it */}
      <animated.div onMouseEnter={trigger} style={style}>
        <img
          src="https://cdn.glitch.com/6ea63b9b-2208-4e42-8a87-a3781ca1ba73%2Fimageedit_2_7764580346.png?v=1632154065731"
          className="illustration"
          onClick={handleChangeHello}
          alt="Illustration click to change language"
          style={{width:"200%"}}
        />
      </animated.div>
      
      
      <div className="navigation">
        {/* When the user hovers over this text, we apply the wiggle function to the image style */}
        <animated.div onMouseEnter={trigger}>
          <a className="btn--click-me" onClick={handleChangeHello}>
            Psst, click me above to see something cool!
          </a>
        </animated.div>
      </div>

      {/* Main */}
      <div className="body-container">
          <div className="section-container">
                <div>Upload a picture here...</div>
                <p></p>
        
                  <input type="file" id="file" onChange={(event) => handleOnChange(event)}/>
                  <div><img className="img-container" src={image} /></div>
          </div>

          <div className="section-container">
            <div>The models generated the following caption for you...</div>
            <p></p>

            {/* ------------------- GRU-normal Model---------------- */}
            <div className="model-output">
            <div className="model-title">Baseline GRU-based Attention model trained on FLICKR and COCO-Dataset alone:</div>
            <div className="output-container">{gru_n_prediction?gru_n_prediction:<Spinner></Spinner>}</div>
            </div>


            {/* ------------------- GRU-ARTemis Model---------------- */}
            <div className="model-output">
            <div className="model-title">Basline GRU-based Attention model trained on ARTemis Dataset: </div>
            <div className="output-container">{gru_a_prediction?gru_a_prediction:<Spinner></Spinner>}</div>
            </div>


            {/* ------------------- SAT-speaker Model---------------- */}
            <div className="model-output">
            <div className="model-title">SAT-Speaker:</div>
            <div> Do wait patiently as this model runs. The reason it takes time is because we are using an LSTM model on a CPU.</div>
            <div className="output-container">{art_p_prediction?art_p_prediction:<Spinner></Spinner>}</div>
            </div>

            {/* ----------------------Emotion Classification----------------- */}

            <div className="emotion-output">
              <div className="model-title">Emotion Predicted:</div>
              <div className="output-container">{emotion}</div>
            </div>
            <p></p><p></p>

            <div className="voiceover">
            <p></p>
            <button onClick={() => handleOnSynthesisClick()}>Speak it out loud</button>
            <p></p>

            
            {audioPath && <audio controls>
              <source src={"http://localhost:9000/get_audio_data?path=" + audioPath} type="audio/mp3" />
              Your browser does not support the audio element.
             </audio>} 
            
            
            </div>        
          
          </div>
        </div>


      <div className="instructions">
        <h2 style={{color:"white"}}>Who is Arty?</h2>
        <p>
           This is <strong>Arty. </strong> Arty loves artwork. Arty also loves talking about art. Who is Arty though? 
           Arty is just a very powerful and elegantly built language model.{" "} For more information about who created Arty, please 
           check out the following page <Link href="/about">About</Link>. You can also check out the <Link href="/about">GitHub Repo</Link> for more details. 
        </p>
      </div>
    </>
  );
}
