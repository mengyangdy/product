import { memo, useCallback, useEffect, useMemo, useState } from "react";

function App() {
  const [, setNum] = useState(1);

  const [count,setCount]=useState(2)
  useEffect(() => {
    setInterval(() => {
      setNum(Math.random());
    }, 2000);
  }, []);

  useEffect(()=>{
    setTimeout(()=>{
      setCount(Math.random())
    },2000)
  },[])

  const bbbCallback=useCallback(function(){

  },[])

  const count2=useMemo(()=>{
    return count*10
  },[count])

  return (
    <div>
      <MemoBbb count={count2} callback={bbbCallback}></MemoBbb>
    </div>
  );
}

interface BooProps {
  count: number;
}

function Bbb(props: BooProps) {
  console.log("bbb render");

  return <h2>{props.count}</h2>;
}

const MemoBbb = memo(Bbb);

export default App;
