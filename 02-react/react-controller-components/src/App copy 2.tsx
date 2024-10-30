import {  useEffect, useRef } from "react";

function App() {
  const inputRef=useRef<HTMLInputElement>(null)

  useEffect(()=>{
    setTimeout(()=>{
      console.log(inputRef.current?.value);
      
    },2000)
  },[])
  return <input type="text" defaultValue={'my'} ref={inputRef} />

}

export default App;
