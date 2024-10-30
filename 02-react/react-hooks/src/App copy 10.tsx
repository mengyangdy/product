import { memo, useEffect, useState } from "react";

function App(){
  const [,setNum]=useState(1)
  useEffect(()=>{
    setInterval(()=>{
      setNum(Math.random())
    },2000)
  },[])

  return <div>
    <MemoBbb count={2}></MemoBbb>
  </div>
}

interface BooProps{
  count:number
}

function Bbb(props:BooProps){
  console.log('bbb render');

  return <h2>{props.count}</h2>
  
}

const MemoBbb=memo(Bbb)

export default App