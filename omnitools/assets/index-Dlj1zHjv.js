import{a as f,r as d,j as i}from"./index-C_g83nc7.js";import{c as j,a as m,b as g}from"./index.esm-BXeXpCuG.js";import{T as x}from"./ToolTextInput-CF8OsBTK.js";import{T as k}from"./ToolTextResult-h-NChVzd.js";import{T as C}from"./ToolContent-CPG3NUPt.js";import{T as b}from"./TextFieldWithDesc-PPwE1_13.js";import{C as y}from"./CheckboxWithDesc-wy5nrFmd.js";import"./ContentPaste-CjGTXkhv.js";import"./InputFooter-BEiN93nS.js";import"./TextField-BB1W8KIt.js";import"./ResultFooter-BsMB-Y2y.js";import"./FormControlLabel-BYSc6Di4.js";import"./Checkbox-eIAKSjSC.js";import"./SwitchBase-BBer0tk-.js";function w(c,e=!0,r=!0,n=""){let o=c.split(`
`);return r&&(o=o.map(a=>a.trimEnd())),e&&(o=o.filter(a=>a.trim())),o.join(n)}const D={joinCharacter:"",deleteBlank:!0,deleteTrailing:!0};j().shape({joinCharacter:g().required("Join character is required"),deleteBlank:m().required("Delete blank is required"),deleteTrailing:m().required("Delete trailing is required")});const v={accessor:"joinCharacter"},B=[{title:"Delete Blank Lines",description:`Delete lines that don't have
 text symbols.
`,accessor:"deleteBlank"},{title:"Delete Trailing Spaces",description:`Remove spaces and tabs at
 the end of the lines.
`,accessor:"deleteTrailing"}],I=[{title:"Merge a To-Do List",description:"In this example, we merge a bullet point list into one sentence, separating each item by the word 'and'. We also remove all empty lines and trailing spaces. If we didn't remove the empty lines, then they'd be joined with the separator word, making the separator word appear multiple times. If we didn't remove the trailing tabs and spaces, then they'd create extra spacing in the joined text and it wouldn't look nice.",sampleText:`clean the house

go shopping
feed the cat

make dinner
build a rocket ship and fly away`,sampleResult:"clean the house and go shopping and feed the cat and make dinner and build a rocket ship and fly away",sampleOptions:{joinCharacter:"and",deleteBlank:!0,deleteTrailing:!0}},{title:"Comma Separated List",description:"This example joins a column of words into a comma separated list of words.",sampleText:`computer
memory
processor
mouse
keyboard`,sampleResult:"computer, memory, processor, mouse, keyboard",sampleOptions:{joinCharacter:",",deleteBlank:!1,deleteTrailing:!1}},{title:"Vertical Word to Horizontal",description:"This example rotates words from a vertical position to horizontal. An empty separator is used for this purpose.",sampleText:`T
e
x
t
a
b
u
l
o
u
s
!`,sampleResult:"Textabulous!",sampleOptions:{joinCharacter:"",deleteBlank:!1,deleteTrailing:!1}}];function H({title:c}){const{t:e}=f("string"),[r,n]=d.useState(""),[o,a]=d.useState(""),u=(s,l)=>{const{joinCharacter:t,deleteBlank:p,deleteTrailing:T}=s;a(w(l,p,T,t))},h=({values:s,updateField:l})=>[{title:e("join.textMergedOptions"),component:i.jsx(b,{placeholder:e("join.joinCharacterPlaceholder"),value:s.joinCharacter,onOwnChange:t=>l(v.accessor,t),description:e("join.joinCharacterDescription")})},{title:e("join.blankLinesAndTrailingSpaces"),component:B.map(t=>i.jsx(y,{title:e(`join.${t.accessor}Title`),checked:!!s[t.accessor],onChange:p=>l(t.accessor,p),description:e(`join.${t.accessor}Description`)},t.accessor))}];return i.jsx(C,{title:c,initialValues:D,compute:u,input:r,setInput:n,inputComponent:i.jsx(x,{title:e("join.inputTitle"),value:r,onChange:n}),resultComponent:i.jsx(k,{title:e("join.resultTitle"),value:o}),getGroups:h,toolInfo:{title:e("join.toolInfo.title"),description:e("join.toolInfo.description")},exampleCards:I})}export{H as default};
