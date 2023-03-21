import './App.css';
import WaveSurfer from 'wavesurfer.js';
import {useRef, useState} from 'react';

const App = () => {
  var context = null;
  const waveformRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const waveformRef1 = useRef(null);
  const waveformRef2 = useRef(null);
  const waveformRef3 = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing)
    waveformRef.current.playPause();
    console.log("handlePlayPause")
  }

  const handleChangeFile = async (e) => {
    if (context == null) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();

      waveformRef.current = WaveSurfer.create({
        container: waveformRef.current,
        audioContext: context,
      });

      waveformRef1.current = WaveSurfer.create({
        container: waveformRef1.current,
      });
      waveformRef2.current = WaveSurfer.create({
        container: waveformRef2.current,
      });
      waveformRef3.current = WaveSurfer.create({
        container: waveformRef3.current,
      });
    }

    const file = e.target.files[0]
    let audioArray = null;
    if (file) {
      try {
        // get peaks (must use a new, undetached array buffer from same file)
        // newArrBuff: waveform data array
        const newArrBuff = await file.arrayBuffer();
        console.log(newArrBuff);
        audioArray = [new Uint8Array(newArrBuff)]
        console.log(audioArray);
        let blob = new Blob(audioArray, {
          type: file.type
        });
        console.log(blob);

        // load url, filepath or blob
        waveformRef.current.loadBlob(blob);
      } catch (e) {
        console.log(e);
      }

      const array1 = waveletTransform(audioArray);
      let blob1 = new Blob(array1, {
        type: file.type
      });
      waveformRef1.current.loadBlob(blob1);

      const array2 = waveletTransform(array1);
      let blob2 = new Blob(array2, {
        type: file.type
      });
      waveformRef2.current.loadBlob(blob2);

      const array3 = waveletTransform(array2);
      let blob3 = new Blob(array3, {
        type: file.type
      });
      waveformRef3.current.loadBlob(blob3);


      // waveformRef1.current.load({
      //   peaks: array1
      // });
      // waveformRef2.current.load({
      //   peaks: array2
      // });
      // waveformRef3.current.load({
      //   peaks: array3
      // });
    }
  }

  const waveletTransform = (array) => {
    // Call wasm to perform wavelet transform
    
    const wasm = './target/wasm32-unknown-unknown/release/wasm_dev_book_hello_wasm.wasm'  // wasm file path
    fetch(wasm)                                                                           // load wasm files using the Fetch API
      .then(response => response.arrayBuffer())                                           // Converts data from a file to a binary array using response.arrayBuffer
      .then(bytes => WebAssembly.instantiate(bytes, {}))                                  // Compile and instantiate binary arrays as WebAssembly code with WebAssembly.instantiate
      .then(results => {                                                                  // Accessing and calling 'wasmWaveletTransform'function from a WebAssembly instance
        const result = results.instance.exports.wasmWaveletTransform(array)
        console.log(result)
        return result
      })

    // return array;
  }

  return ( 
    <div className = 'App'>
      <p> raw data </p> 
      <div ref = {waveformRef}/> 
      <input 
        type = "file"
        accept = 'audio/*'
        onChange = { (e) => handleChangeFile(e)}
      /> 
      <button onClick={handlePlayPause}> {playing ? "Pause" : "Play"} </button> 
      <p>n = 1</p> 
      <div ref={waveformRef1}/> 
      <p>n = 2</p> 
      <div ref={waveformRef2}/> 
      <p>n = 3</p> 
      <div ref={waveformRef3}/> 
    </div>
  );
}

export default App;