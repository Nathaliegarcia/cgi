import{a as m,r,j as o}from"./index-C_g83nc7.js";import{T as c}from"./ToolCodeInput-C4PPLNO_.js";import{T as J}from"./ToolTextResult-h-NChVzd.js";import{T as h}from"./ToolContent-CPG3NUPt.js";import"./ContentPaste-CjGTXkhv.js";import"./InputFooter-BEiN93nS.js";import"./ResultFooter-BsMB-Y2y.js";import"./TextField-BB1W8KIt.js";const v=t=>{try{return JSON.parse(t),{valid:!0}}catch(e){return e instanceof SyntaxError?{valid:!1,error:e.message}:{valid:!1,error:"Unknown error occurred"}}},g=[{title:"Valid JSON Object",description:"This example shows a correctly formatted JSON object. All property names and string values are enclosed in double quotes, and the overall structure is properly balanced with opening and closing braces.",sampleText:`{
  "name": "John",
  "age": 30,
  "city": "New York"
}`,sampleResult:"✅ Valid JSON",sampleOptions:{}},{title:"Invalid JSON Missing Quotes",description:"This example demonstrates an invalid JSON object where the property names are not enclosed in double quotes. According to the JSON standard, property names must always be enclosed in double quotes. Omitting the quotes will result in a syntax error.",sampleText:`{
  name: "John",
  age: 30,
  city: "New York"
}`,sampleResult:"❌ Error: Expected property name or '}' in JSON",sampleOptions:{}},{title:"Invalid JSON with Trailing Comma",description:"This example shows an invalid JSON object with a trailing comma after the last key-value pair. In JSON, trailing commas are not allowed because they create ambiguity when parsing the data structure.",sampleText:`{
  "name": "John",
  "age": 30,
  "city": "New York",
}`,sampleResult:"❌ Error: Expected double-quoted property name",sampleOptions:{}}];function j({title:t}){const{t:e}=m("json"),[a,s]=r.useState(""),[i,n]=r.useState(""),l=(x,p)=>{const{valid:u,error:d}=v(p);n(u?e("validateJson.validJson"):e("validateJson.invalidJson",{error:d}))};return o.jsx(h,{title:t,inputComponent:o.jsx(c,{title:e("validateJson.inputTitle"),value:a,onChange:s,language:"json"}),resultComponent:o.jsx(J,{title:e("validateJson.resultTitle"),value:i}),initialValues:{},getGroups:null,toolInfo:{title:e("validateJson.toolInfo.title"),description:e("validateJson.toolInfo.description")},exampleCards:g,input:a,setInput:s,compute:l})}export{j as default};
