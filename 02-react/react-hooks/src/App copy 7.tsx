import { useEffect, useRef } from "react"

export default function(){
  const inputRef=useRef<HTMLInputElement>(null)
  useEffect(()=>{
    console.log(inputRef.current);
    
    inputRef.current?.focus()
  })
  return (
    <div>
      <input type="text" ref={inputRef} />
    </div>
  )
}