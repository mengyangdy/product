import React, { useEffect, useRef } from "react"

const Child:React.ForwardRefRenderFunction<HTMLInputElement>=(props,ref)=>{
  return (
    <div>
      <input type="text" ref={ref} />
    </div>
  )
}

const WrapChild=React.forwardRef(Child)


function App(){
  const ref=useRef<HTMLInputElement>(null)

  useEffect(()=>{
    console.log(ref.current,'ref');
    ref.current?.focus()
    
  })

  return (
    <div>
      <WrapChild ref={ref} />
    </div>
  )
}


export default App