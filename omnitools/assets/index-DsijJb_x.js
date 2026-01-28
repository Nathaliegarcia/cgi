import{a as f,r as d,j as p}from"./index-C_g83nc7.js";import{T as g}from"./ToolTextInput-CF8OsBTK.js";import{T as S}from"./ToolTextResult-h-NChVzd.js";import{R}from"./RadioWithTextField-Bm6TuXCT.js";import{S as b}from"./SimpleRadio-kuqVngOy.js";import{C as y}from"./CheckboxWithDesc-wy5nrFmd.js";import{T as w}from"./ToolContent-CPG3NUPt.js";import"./ContentPaste-CjGTXkhv.js";import"./InputFooter-BEiN93nS.js";import"./TextField-BB1W8KIt.js";import"./ResultFooter-BsMB-Y2y.js";import"./TextFieldWithDesc-PPwE1_13.js";import"./Radio-UAGSoQ3a.js";import"./SwitchBase-BBer0tk-.js";import"./FormControlLabel-BYSc6Di4.js";import"./Checkbox-eIAKSjSC.js";function C(o){const t=/\d+/g,r=o.match(t);return r?r.map(Number):[]}const k=(o,t,r,l)=>{let a=[];if(t==="smart"?a=C(o):a=o.split(l).filter(n=>!isNaN(Number(n))&&n.trim()!=="").map(Number),r){let i="",n=0;for(const s of a)n=n+s,i=i+n+`
`;return i}else return a.reduce((i,n)=>i+n,0).toString()},N={extractionType:"smart",separator:"\\n",printRunningSum:!1},I=[{title:"Smart sum",description:"Auto detect numbers in the input.",type:"smart",withTextField:!1},{title:"Number Delimiter",type:"delimiter",description:"Input SeparatorCustomize the number separator here. (By default a line break.)",withTextField:!0,textValueAccessor:"separator"}],v=[{title:"Sum of Ten Positive Numbers",description:"In this example, we calculate the sum of ten positive integers. These integers are listed as a column and their total sum equals 19494.",sampleText:`0
1
20
33
400
505
660
777
8008
9090`,sampleResult:"19494",sampleOptions:{extractionType:"delimiter",separator:"\\n",printRunningSum:!1}},{title:"Count Trees in the Park",description:`This example reverses a column of twenty three-syllable nouns and prints all the words from the bottom to top. To separate the list items, it uses the 
 character as input item separator, which means that each item is on its own line..`,sampleText:"This year gardeners have planted 20 red maples, 35 sweetgum, 13 quaking aspen, and 7 white oaks in the central park of the city.",sampleResult:"75",sampleOptions:{extractionType:"smart",separator:"\\n",printRunningSum:!1}},{title:"Sum of Integers and Decimals",description:"In this example, we add together ninety different values – positive numbers, negative numbers, integers and decimal fractions. We set the input separator to a comma and after adding all of them together, we get 0 as output.",sampleText:"1, 2, 3, 4, 5, 6, 7, 8, 9, -1.1, -2.1, -3.1, -4.1, -5.1, -6.1, -7.1, -8.1, -9.1, 10, 20, 30, 40, 50, 60, 70, 80, 90, -10.2, -20.2, -30.2, -40.2, -50.2, -60.2, -70.2, -80.2, -90.2, 100, 200, 300, 400, 500, 600, 700, 800, 900, -100.3, -200.3, -300.3, -400.3, -500.3, -600.3, -700.3, -800.3, -900.3, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, -1000.4, -2000.4, -3000.4, -4000.4, -5000.4, -6000.4, -7000.4, -8000.4, -9000.4, 10001, 20001, 30001, 40001, 50001, 60001, 70001, 80001, 90001, -10000, -20000, -30000, -40000, -50000, -60000, -70000, -80000, -90000",sampleResult:"0",sampleOptions:{extractionType:"delimiter",separator:", ",printRunningSum:!1}},{title:"Running Sum of Numbers",description:'In this example, we calculate the sum of all ten digits and enable the option "Print Running Sum". We get the intermediate values of the sum in the process of addition. Thus, we have the following sequence in the output: 0, 1 (0 + 1), 3 (0 + 1 + 2), 6 (0 + 1 + 2 + 3), 10 (0 + 1 + 2 + 3 + 4), and so on.',sampleText:`0
1
2
3
4
5
6
7
8
9`,sampleResult:`0
1
3
6
10
15
21
28
36
45`,sampleOptions:{extractionType:"delimiter",separator:"\\n",printRunningSum:!0}}];function L({title:o}){const{t}=f("number"),[r,l]=d.useState(""),[a,i]=d.useState(""),n=({values:s,updateField:m})=>[{title:t("sum.numberExtraction"),component:I.map(({title:u,description:h,type:e,withTextField:x,textValueAccessor:c})=>x?p.jsx(R,{checked:e===s.extractionType,title:t(`sum.extractionTypes.${e}.title`),fieldName:"extractionType",description:t(`sum.extractionTypes.${e}.description`),value:c?s[c].toString():"",onRadioClick:()=>m("extractionType",e),onTextChange:T=>c?m(c,T):null},e):p.jsx(b,{onClick:()=>m("extractionType",e),checked:s.extractionType===e,description:t(`sum.extractionTypes.${e}.description`),title:t(`sum.extractionTypes.${e}.title`)},u))},{title:t("sum.runningSum"),component:p.jsx(y,{title:t("sum.printRunningSum"),description:t("sum.printRunningSumDescription"),checked:s.printRunningSum,onChange:u=>m("printRunningSum",u)})}];return p.jsx(w,{title:o,input:r,inputComponent:p.jsx(g,{title:t("sum.inputTitle"),value:r,onChange:l}),resultComponent:p.jsx(S,{title:t("sum.resultTitle"),value:a}),initialValues:N,getGroups:n,compute:(s,m)=>{const{extractionType:u,printRunningSum:h,separator:e}=s;i(k(m,u,h,e))},setInput:l,toolInfo:{title:t("sum.toolInfo.title"),description:t("sum.toolInfo.description")},exampleCards:v})}export{L as default};
