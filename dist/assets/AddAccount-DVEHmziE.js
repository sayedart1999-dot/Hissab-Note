import{u as j,a as l,j as e,C as m,S as f}from"./index-LF0qJdOy.js";import{C as N}from"./circle-check-big-UsOlufWJ.js";import{T as y}from"./trash-2-TA86Ar1c.js";import{S as w}from"./save-Bs2ayNZI.js";const z=()=>{const u=j(),[o,p]=l.useState(new Date().toISOString().split("T")[0]),[x,h]=l.useState(!1),[d,c]=l.useState(()=>[{id:Date.now().toString(),name:"",description:"",quantity:0,rate:0,paid:0}]),g=()=>{c([...d,{id:Date.now().toString(),name:"",description:"",quantity:0,rate:0,paid:0}])},b=a=>{d.length>1&&window.confirm("আপনি কি এই লাইনটি ডিলিট করতে নিশ্চিত?")&&c(d.filter(s=>s.id!==a))},n=(a,s,t)=>{c(d.map(i=>i.id===a?{...i,[s]:t}:i))},v=a=>{a.preventDefault();const s=d.filter(t=>t.name&&t.quantity*t.rate>0);if(s.length===0){alert("অন্তত একটি সঠিক হিসাব প্রদান করুন।");return}s.forEach(t=>{const i=t.quantity*t.rate;f.saveAccount({id:`${Date.now()}-${Math.random()}`,name:t.name,description:t.description,total:i,paid:t.paid,due:i-t.paid,date:o})}),h(!0),setTimeout(()=>{u("/history")},2e3)};return x?e.jsx("div",{className:"container max-w-4xl py-20 px-6",children:e.jsxs("div",{className:"card text-center py-16",children:[e.jsx("div",{className:"success-icon-container",children:e.jsx(N,{size:80,className:"text-success animate-bounce-subtle"})}),e.jsx("h2",{className:"text-2xl font-bold mt-6",children:"সফলভাবে সংরক্ষিত হয়েছে!"}),e.jsx("p",{className:"text-muted mt-2",children:"আপনাকে হিসাবের ইতিহাস পাতায় নিয়ে যাওয়া হচ্ছে..."})]})}):e.jsxs("div",{className:"add-account-container",children:[e.jsxs("div",{className:"page-header flex justify-between items-center mb-8",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"flex items-center text-3xl font-bold text-slate-800",children:[e.jsx("span",{className:"header-icon-container",children:e.jsx(m,{size:18})}),"নতুন হিসাব যোগ করুন"]}),e.jsx("p",{className:"text-muted mt-1",children:"কাস্টমারের নতুন লেনদেনের তথ্য প্রদান করুন"})]}),e.jsx("div",{className:"date-picker-mini",children:e.jsx("input",{type:"date",className:"input-mini-date",value:o,onChange:a=>p(a.target.value),required:!0})})]}),e.jsxs("form",{onSubmit:v,className:"space-y-6",children:[e.jsxs("div",{className:"card details-card p-0 overflow-hidden",children:[e.jsxs("div",{className:"details-header bg-slate-50 border-b",children:[e.jsx("div",{className:"header-col col-sn",children:"#"}),e.jsx("div",{className:"header-col col-name",children:"কাস্টমারের নাম"}),e.jsx("div",{className:"header-col col-desc",children:"কাজের বিবরণ"}),e.jsx("div",{className:"header-col col-qty",children:"পরিমাণ"}),e.jsx("div",{className:"header-col col-rate",children:"দর"}),e.jsx("div",{className:"header-col col-paid",children:"জমা"}),e.jsx("div",{className:"header-col col-summary",children:"সারসংক্ষেপ (বাকি)"}),e.jsx("div",{className:"header-col col-action",children:"অ্যাকশন"})]}),e.jsx("div",{className:"rows-container",children:d.map((a,s)=>{const t=a.quantity*a.rate,i=t-a.paid;return e.jsxs("div",{className:"detail-row border-b last:border-0",children:[e.jsx("div",{className:"row-col col-sn",children:e.jsx("span",{className:"sn-badge",children:s+1})}),e.jsx("div",{className:"row-col col-name",children:e.jsx("input",{type:"text",className:"row-input",placeholder:"নাম",value:a.name,onChange:r=>n(a.id,"name",r.target.value),required:!0})}),e.jsx("div",{className:"row-col col-desc",children:e.jsx("input",{type:"text",className:"row-input",placeholder:"বিবরণ",value:a.description,onChange:r=>n(a.id,"description",r.target.value)})}),e.jsx("div",{className:"row-col col-qty",children:e.jsx("input",{type:"number",className:"row-input text-center",placeholder:"0",value:a.quantity||"",onChange:r=>n(a.id,"quantity",Number(r.target.value)),required:!0})}),e.jsx("div",{className:"row-col col-rate",children:e.jsx("input",{type:"number",className:"row-input text-center",placeholder:"0",value:a.rate||"",onChange:r=>n(a.id,"rate",Number(r.target.value)),required:!0})}),e.jsx("div",{className:"row-col col-paid",children:e.jsx("input",{type:"number",className:"row-input text-center",placeholder:"0",value:a.paid||"",onChange:r=>n(a.id,"paid",Number(r.target.value)),required:!0})}),e.jsx("div",{className:"row-col col-summary",children:e.jsxs("div",{className:"row-summary-box",children:[e.jsxs("div",{className:"summary-item",children:["মোট: ৳",t.toLocaleString()]}),e.jsxs("div",{className:"summary-item due-text",children:["বাকি: ৳",i.toLocaleString()]})]})}),e.jsx("div",{className:"row-col col-action",children:e.jsx("button",{type:"button",className:"delete-row-btn",onClick:()=>b(a.id),disabled:d.length===1,children:e.jsx(y,{size:16})})})]},a.id)})}),e.jsx("button",{type:"button",className:"add-row-trigger",onClick:g,children:e.jsxs("div",{className:"add-row-inner",children:[e.jsx(m,{size:20,className:"mr-2"}),"নতুন লাইন যোগ করুন"]})})]}),e.jsx("div",{className:"save-container",children:e.jsxs("button",{type:"submit",className:"btn btn-primary w-full h-14 text-lg",children:[e.jsx(w,{size:20,className:"mr-2"}),"সবগুলো হিসাব সংরক্ষণ করুন"]})})]}),e.jsx("style",{children:`
                .add-account-container {
                    max-width: 85rem;
                    margin: 2rem auto;
                    padding: 0 2rem;
                }

                .input-mini-date {
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    background: #fcfdfe;
                    color: var(--text);
                    font-family: inherit;
                    font-size: 0.9375rem;
                    outline: none;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .input-mini-date:focus {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
                }

                .details-header {
                    display: grid;
                    grid-template-columns: 50px 1.5fr 1.5fr 80px 100px 100px 1.2fr 60px;
                    padding: 0.75rem 1.5rem;
                    font-weight: 700;
                    color: var(--secondary);
                }

                .detail-row {
                    display: grid;
                    grid-template-columns: 50px 1.5fr 1.5fr 80px 100px 100px 1.2fr 60px;
                    padding: 1rem 1.5rem;
                    gap: 0.75rem;
                    align-items: center;
                }

                .row-input {
                    width: 100%;
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    padding: 0.5rem 0.75rem;
                }

                .sn-badge {
                    width: 24px;
                    height: 24px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .row-summary-box {
                    padding: 0.5rem;
                    background: #f8fafc;
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                }
                .due-text { color: var(--danger); font-weight: 700; }

                .delete-row-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.5rem;
                    color: var(--danger);
                    background: white;
                    border: 1px solid #fee2e2;
                }
                .delete-row-btn:hover:not(:disabled) { background: var(--danger); color: white; }
                .delete-row-btn:disabled { opacity: 0.3; }

                .add-row-trigger {
                    width: 100%;
                    padding: 1.5rem;
                    background: white;
                    border: none;
                }
                .add-row-inner {
                    padding: 1rem;
                    border: 2px dashed var(--border);
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    font-weight: 700;
                }

                .success-icon-container {
                    background: #f0fdf4;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin: 0 auto;
                }
            `})]})};export{z as default};
