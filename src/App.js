import './App.css';
import WaveSurfer from 'wavesurfer.js';
import { useRef, useState } from 'react';
// import { analyze } from "web-audio-beat-detector";

const App = () => {
  var context = null;
  const waveformRef = useRef(null);
  const waveformRef1 = useRef(null);
  const waveformRef2 = useRef(null);
  const waveformRef3 = useRef(null);
  // const [array, setArray] = useState([]);
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [array3, setArray3] = useState([]);

  const [playing, setPlaying] = useState(false);


  // const bpm = useRef();

  const handleChangeFile = async (e) => {
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
      // try {
      //   // also create webaudio from array buffer (not needed here)
      //   const arrayBuffer = await file.arrayBuffer();
      //   const audioBuffer = await context.decodeAudioData(arrayBuffer);
      //   bpm.current = await analyze(audioBuffer);
      // } catch (e) {
      //   // console.log(e.message);
      //   if (
      //     e.message ===
      //     "The given channelData does not contain any detectable beats."
      //   ) {
      //     console.log(e.message);
      //     bpm.current = "-";
      //   }
      // }

      // try {
      //   // get peaks (must use a new, undetached array buffer from same file)
      //   const newArrBuff = await file.arrayBuffer();
      //   let blob = new Blob([new Uint8Array(newArrBuff)], { type: file.type });
      //   console.log(blob);

      //   // load url, filepath or blob
      //   // ws.current.load("/out.mp3");
      //   waveformRef.current.loadBlob(blob);
      // } catch (e) {
      //   console.log(e);
      // }
    
  // //
  //       const fileReader = new FileReader()
  //       fileReader.onload = () => {
  //         // fileReader.resultにデータが入る
  //         console.log(fileReader.result);
  //       }
  //       //set the raw value to array
  //       setArray(fileReader.readAsArrayBuffer(file));
      
  //       //show the raw audio waveform
  //       waveformRef.current.load({peaks: array});
  // //

      const fileUrl = URL.createObjectURL(file);
      waveformRef.current.load(fileUrl);

      //set the calculated value to array1-3
      setArray1(waveletTransform());
      setArray2(waveletTransform());
      setArray3(waveletTransform());
    
      //show the result of wavelet transform
      waveformRef1.current = WaveSurfer.create({
        container: waveformRef1.current,
      });
      waveformRef2.current = WaveSurfer.create({
        container: waveformRef2.current,
      });
      waveformRef3.current = WaveSurfer.create({
        container: waveformRef3.current,
      });
      waveformRef1.current.load({peaks: array1});
      waveformRef2.current.load({peaks: array2});
      waveformRef3.current.load({peaks: array3});
    }
  }

  const waveletTransform = () => {
    //Call wasm to perform wavelet transform
    return [];
  }

  const handlePlayPause = () => {
    setPlaying(!playing)
    waveformRef.current.playPause();
    console.log("handlePlayPause")
  }

  return (
      <div className='App'>
        <p>raw data</p>
        <div ref={waveformRef} />
        <input type="file" accept='audio/*' onChange={(e) => handleChangeFile(e)}/>
        <button onClick={handlePlayPause}> {playing? "Pause" : "Play"} </button>

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
