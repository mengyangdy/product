import { defineStore } from "pinia";

export const useMainStore=defineStore('main',{
  state:()=>{
    return {
      routeData:null,
      loading:false,
      judgeValue:20
    }
  },
  getters:{

  },
  actions:{

  }
})