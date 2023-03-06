import './App.css';
import WaveSurfer from 'wavesurfer.js';
import { useRef, useState } from 'react';
// import { render } from "react-dom";
// import { ReactDOM } from 'react';

const App = () => {
  var context = null;
  const waveformRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const waveformRef1 = useRef(null);
  const waveformRef2 = useRef(null);
  const waveformRef3 = useRef(null);
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [array3, setArray3] = useState([]);

  const handlePlayPause = () => {
    setPlaying(!playing)
    waveformRef.current.playPause();
    console.log("handlePlayPause")
  }
  
  const handleChangeFile = (e) => {
    if (context == null) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();

      waveformRef.current = WaveSurfer.create({
         container: waveformRef.current,
         audioContext: context,
      });
    }
    const file = e.target.files[0]
    if (file) {
        const fileUrl = URL.createObjectURL(file)

        //show the raw audio waveform
        waveformRef.current.load(fileUrl);

        //set the calculated value to array1-3
        setArray1(waveletTransform());
        setArray2(waveletTransform());
        setArray3(waveletTransform());
    
        waveformRef1.current = WaveSurfer.create({
          container: waveformRef1.current,
        });
        waveformRef2.current = WaveSurfer.create({
          container: waveformRef2.current,
        });
        waveformRef3.current = WaveSurfer.create({
          container: waveformRef3.current,
        });

        //show the result of wavelet transform
        waveformRef1.current.load({peaks: array1});
        waveformRef2.current.load({peaks: array2});
        waveformRef3.current.load({peaks: array3});
    }
  }

  const waveletTransform = () => {
    //Call wasm to perform wavelet transform
    return [];
  }

  // const startCalc = () => {
  //   setArray1(waveletTransformation());
  //   setArray2(waveletTransformation());
  //   setArray3(waveletTransformation());

  //   waveformRef1.current = WaveSurfer.create({
  //     container: waveformRef1.current,
  //   });
  //   waveformRef2.current = WaveSurfer.create({
  //     container: waveformRef2.current,
  //   });
  //   waveformRef3.current = WaveSurfer.create({
  //     container: waveformRef3.current,
  //   });
  //   waveformRef1.current.load({peaks: array1});
  //   waveformRef2.current.load({peaks: array2});
  //   waveformRef3.current.load({peaks: array3});
  // }

  return (
      <div className='App'>
        <p>raw data</p>
        <div ref={waveformRef} />
        <input type="file" accept='audio/*' onChange={(e) => handleChangeFile(e)}/>
        <button onClick={handlePlayPause}> {playing? "Pause" : "Play"} </button>
        {/* <button onClick={startCalc}>calc</button> */}

        <p>n=1</p>
        <div ref={waveformRef1}/>
        <p>n=2</p>
        <div ref={waveformRef2}/>
        <p>n=3</p>
        <div ref={waveformRef3}/>
      </div>
  );
}

export default App;
