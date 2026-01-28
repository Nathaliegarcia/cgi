const i=(t,r,e)=>{let n;try{n=JSON.parse(t)}catch{throw new Error("Invalid JSON string")}return JSON.stringify(n,null,r==="tab"?"	":e)};export{i as b};
