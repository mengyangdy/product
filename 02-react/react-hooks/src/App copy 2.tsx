import { useState,useEffect } from 'react';

async function queryData(){
  const data=await new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(666)
    },1000)
  })
  return data
}

const App = () => {
  const[num,setNum]=useState(0)
  
  useEffect(()=>{
    console.log('xxxx');
    
    queryData().then(res=>{
      setNum(res)
    })
  },[])

  
  return (
    <div onClick={()=>setNum((prevNum)=>prevNum+1)}>{num}</div>
  )
};

export default App;
