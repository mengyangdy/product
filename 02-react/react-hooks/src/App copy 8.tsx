import React from "react"
import { useEffect, useImperativeHandle, useRef } from "react"

interface RefProps{
  aaa:()=>void
}

const Child:React.ForwardRefRenderFunction<RefProps>=(props,ref)=>{
  const inputRef=useRef<HTMLInputElement>(null)

  useImperativeHandle(ref,()=>{
    return {
      aaa(){
        inputRef.current?.focus()
      }
    }
  },[inputRef])

  return <div>
    <input type="text" ref={inputRef} />
  </div>
}

const WrapChild=React.forwardRef(Child)


function App(){
  const ref=useRef<RefProps>(null)

  useEffect(()=>{
    console.log(ref.current,'ref');
    ref.current?.aaa()
  },[])

  return (
    <div className="App">
      {/* <input type="text" ref={ref} /> */}
      <WrapChild ref={ref} />
    </div>
  )

}

export default App