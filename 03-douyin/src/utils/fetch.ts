import { IS_DEV, IS_GITEE_PAGES } from "@/configs";
import { ArchiveReader, libarchiveWasm } from 'libarchive-wasm'

export async function fetchRequest(url:string):Promise<{ json(): Promise<any> } | Response> {
  if(IS_DEV || !IS_GITEE_PAGES){
    url=url.replace('.md','.json')
    return fetch(url)
  }else{
    return new Promise(async (resolve)=>{
      const r=await fetch(url)
      if(url.includes('.md')){
        const data=await r.arrayBuffer()
        const mod=await libarchiveWasm()
        const reader=new ArchiveReader(mod,new Int8Array(data))
        for(const entry of reader.entries()){
          if(entry.getPathname().endsWith('.json')){
            const data=new TextDecoder().decode(entry.readData())
            resolve({
              json(){
                return Promise.resolve(JSON.parse(data))
              }
            })
          }
        }
        reader.free()
      }
    })
  }
  
}