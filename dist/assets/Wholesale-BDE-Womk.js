import{c as C,a as m,S as g,j as e,T as S,X as q}from"./index-LF0qJdOy.js";import{P as j}from"./plus-u6twbfTO.js";import{P as D}from"./pen-DFjvzB85.js";import{E as W}from"./eye-CtS1mcc7.js";import{T as F}from"./trash-2-TA86Ar1c.js";const O=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],_=C("calculator",O);const X=[["path",{d:"M5 12h14",key:"1ays0h"}]],$=C("minus",X),G=()=>{const[d,y]=m.useState(()=>g.getWholesale()),[N,h]=m.useState(!1),[c,x]=m.useState(null),[b,A]=m.useState(null),[n,u]=m.useState({customerName:"",previousDue:0,newAmount:0,paidNow:0,description:"",note:""}),[l,p]=m.useState([]),f=m.useMemo(()=>{const r={};d.forEach(t=>{r[t.customerName]=t.remainingDue});const a=Object.values(r).reduce((t,i)=>t+i,0),s=d.reduce((t,i)=>t+i.paidNow,0),o=d.reduce((t,i)=>t+i.newAmount,0);return{outstanding:a,totalPaid:s,totalNew:o}},[d]),E=r=>{r.preventDefault();let a=n.newAmount;l.length>0&&(a=l.reduce((t,i)=>t+i.qty*i.rate,0));const s=n.previousDue+a-n.paidNow,o={...n,newAmount:a,items:l,id:c||Date.now().toString(),remainingDue:s,date:c?d.find(t=>t.id===c).date:new Date().toISOString().split("T")[0]};g.saveWholesale(o),y(g.getWholesale()),h(!1),x(null),u({customerName:"",previousDue:0,newAmount:0,paidNow:0,description:"",note:""}),p([])},L=r=>{u({customerName:r.customerName,previousDue:r.previousDue,newAmount:r.newAmount,paidNow:r.paidNow,description:r.description||"",note:r.note||""}),p(r.items||[]),x(r.id),h(!0)},I=r=>{window.confirm("আপনি কি এই এন্ট্রিটি ডিলিট করতে নিশ্চিত?")&&(g.deleteWholesale(r),y(g.getWholesale()))},M=r=>{const a=d.filter(s=>s.customerName===r);return a.length===0?0:a[a.length-1].remainingDue},w=m.useMemo(()=>{const r={};return d.forEach(a=>{r[a.customerName]||(r[a.customerName]=[]),r[a.customerName].push(a)}),Object.keys(r).sort().map(a=>{const s=r[a].sort((t,i)=>{const z=i.date.localeCompare(t.date);return z!==0?z:i.id.localeCompare(t.id)}),o=[...s].reverse();return{customerName:a,latestEntry:s[0],allEntries:s,summary:{date:s[0].date,initialDue:o[0].previousDue,totalNew:s.reduce((t,i)=>t+i.newAmount,0),totalPaid:s.reduce((t,i)=>t+i.paidNow,0),currentDue:s[0].remainingDue}}})},[d]),P=()=>p([...l,{name:"",qty:1,rate:0}]),v=(r,a,s)=>{const o=[...l];o[r]={...o[r],[a]:s},p(o)},T=r=>p(l.filter((a,s)=>s!==r)),k=l.length>0?l.reduce((r,a)=>r+a.qty*a.rate,0):n.newAmount;return e.jsxs("div",{className:"wholesale-page",children:[e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap",rel:"stylesheet"}),e.jsxs("div",{className:"page-header flex justify-between items-center mb-8",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"flex items-center",children:[e.jsx("span",{className:"header-icon-container",children:e.jsx(S,{size:18})}),"পাইকারী হিসাব"]}),e.jsx("p",{className:"text-muted mt-1",children:"পাইকারী কাস্টমারদের লেনদেন ব্যবস্থাপনা"})]}),!N&&e.jsxs("button",{className:"btn btn-primary",onClick:()=>{h(!0),x(null),u({customerName:"",previousDue:0,newAmount:0,paidNow:0,description:"",note:""}),p([])},children:[e.jsx(j,{size:20})," নতুন এন্ট্রি যোগ করুন"]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-6 mb-8",children:[e.jsxs("div",{className:"card summary-card",children:[e.jsx("div",{className:"summary-header",children:e.jsx("span",{className:"summary-label",children:"মোট পাওনা (আউটস্ট্যান্ডিং)"})}),e.jsxs("div",{className:"summary-body",children:[e.jsxs("h3",{className:"amount-danger",children:["৳ ",f.outstanding.toLocaleString()]}),e.jsx("p",{children:"সর্বমোট পাওনা"})]})]}),e.jsxs("div",{className:"card summary-card",children:[e.jsx("div",{className:"summary-header",children:e.jsx("span",{className:"summary-label",children:"সর্বমোট আদায়"})}),e.jsxs("div",{className:"summary-body",children:[e.jsxs("h3",{className:"amount-success",children:["৳ ",f.totalPaid.toLocaleString()]}),e.jsx("p",{children:"মোট ক্যাশ জমা"})]})]}),e.jsxs("div",{className:"card summary-card",children:[e.jsx("div",{className:"summary-header",children:e.jsx("span",{className:"summary-label",children:"সর্বমোট নতুন মাল"})}),e.jsxs("div",{className:"summary-body",children:[e.jsxs("h3",{className:"amount-primary",children:["৳ ",f.totalNew.toLocaleString()]}),e.jsx("p",{children:"মোট বিক্রিত মাল"})]})]})]}),N&&e.jsxs("div",{className:"card mb-10 form-card-container",children:[e.jsxs("div",{className:"form-header-premium",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"form-icon-pill",children:c?e.jsx(D,{size:18}):e.jsx(j,{size:18})}),e.jsx("h3",{className:"font-bold text-lg",children:c?"এন্ট্রি আপডেট করুন":"নতুন এন্ট্রি যোগ করুন"})]}),e.jsx("button",{className:"btn-close-subtle",onClick:()=>h(!1),title:"বন্ধ করুন",children:e.jsx(q,{size:20})})]}),e.jsxs("form",{onSubmit:E,className:"wholesale-modern-form",children:[e.jsx("div",{className:"form-section",children:e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label-light",children:"কাস্টমারের নাম"}),e.jsx("input",{type:"text",className:"input input-bold",placeholder:"কাস্টমারের নাম লিখুন...",value:n.customerName,onChange:r=>{const a=r.target.value;u({...n,customerName:a,previousDue:M(a)})},required:!0})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label-light",children:"পূর্বের বাকি"}),e.jsxs("div",{className:"input-readonly",children:[e.jsx("span",{className:"currency-symbol",children:"৳"})," ",n.previousDue.toLocaleString()]})]})]})}),e.jsxs("div",{className:"form-section bg-subtle",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("h4",{className:"section-title",children:[e.jsx(_,{size:16})," মালের বিবরণ (ঐচ্ছিক)"]}),e.jsxs("button",{type:"button",className:"btn btn-secondary btn-sm",onClick:P,children:[e.jsx(j,{size:14})," আইটেম যোগ করুন"]})]}),e.jsxs("div",{className:"items-list-container",children:[l.length===0?e.jsx("div",{className:"empty-items-placeholder",children:"কোন আইটেম যোগ করা হয়নি"}):e.jsxs("div",{className:"items-table-header grid grid-cols-12 gap-3 mb-2 px-2",children:[e.jsx("div",{className:"col-span-6 label-xs",children:"আইটেমের নাম"}),e.jsx("div",{className:"col-span-2 label-xs text-center",children:"পরিমাণ"}),e.jsx("div",{className:"col-span-3 label-xs text-center",children:"দর (টাকা)"}),e.jsx("div",{className:"col-span-1"})]}),l.map((r,a)=>e.jsxs("div",{className:"item-row-modern-container animate-slide-in",children:[e.jsx("span",{className:"item-row-date",children:c?d.find(s=>s.id===c)?.date:new Date().toISOString().split("T")[0]}),e.jsxs("div",{className:"item-row-modern grid grid-cols-12 gap-3",children:[e.jsx("div",{className:"col-span-6",children:e.jsx("input",{type:"text",className:"input input-sm",placeholder:"আইটেম...",value:r.name,onChange:s=>v(a,"name",s.target.value)})}),e.jsx("div",{className:"col-span-2",children:e.jsx("input",{type:"number",className:"input input-sm text-center",placeholder:"0",value:r.qty,onChange:s=>v(a,"qty",Number(s.target.value))})}),e.jsx("div",{className:"col-span-3",children:e.jsx("input",{type:"number",className:"input input-sm text-center",placeholder:"0.00",value:r.rate,onChange:s=>v(a,"rate",Number(s.target.value))})}),e.jsx("div",{className:"col-span-1 flex justify-center items-center",children:e.jsx("button",{type:"button",className:"btn-remove-item",onClick:()=>T(a),title:"মুছে ফেলুন",children:e.jsx($,{size:14})})})]})]},a))]})]}),e.jsx("div",{className:"form-section",children:e.jsxs("div",{className:"billing-grid",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label-light",children:"নতুন মাল (মোট টাকা)"}),e.jsx("input",{type:"number",className:`input input-bold ${l.length>0?"input-readonly-style":"input-active"}`,value:k,onChange:r=>u({...n,newAmount:Number(r.target.value)}),readOnly:l.length>0,required:!0}),l.length>0&&e.jsx("span",{className:"helper-text",children:"* আইটেম লিস্ট থেকে হিসাব করা"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label-light",children:"আজকের জমা"}),e.jsx("input",{type:"number",className:"input input-bold input-success-focus",placeholder:"0.00",value:n.paidNow,onChange:r=>u({...n,paidNow:Number(r.target.value)}),required:!0})]}),e.jsxs("div",{className:"input-group due-field-compact",children:[e.jsx("label",{className:"label-light text-right",children:"বর্তমান পাওনা"}),e.jsxs("div",{className:"input-total-due",children:[e.jsx("span",{className:"currency-symbol",children:"৳"})," ",(n.previousDue+k-n.paidNow).toLocaleString()]})]})]})}),e.jsxs("div",{className:"form-actions-premium",children:[e.jsx("button",{type:"button",className:"btn btn-secondary-modern",onClick:()=>h(!1),children:"বাতিল করুন"}),e.jsx("button",{type:"submit",className:"btn btn-primary-modern",children:c?"হিসাব আপডেট করুন":"হিসাব সংরক্ষণ করুন"})]})]})]}),e.jsx("div",{className:"wholesale-list",children:w.length===0?e.jsxs("div",{className:"card empty-state-card",children:[e.jsx(S,{size:40,className:"empty-icon"}),e.jsx("p",{children:"এখনো কোন এন্ট্রি নেই。 নতুন এন্ট্রি যোগ করতে উপরের বাটনে ক্লিক করুন。"})]}):w.map(({customerName:r,allEntries:a,summary:s})=>e.jsxs("div",{className:"card customer-summary-card",children:[e.jsxs("div",{className:"customer-card-header",children:[e.jsxs("h4",{className:"customer-name",children:[e.jsx("div",{className:"avatar-small",children:"👤"})," ",r]}),e.jsxs("div",{className:"card-actions",children:[e.jsxs("div",{className:"header-due-badge",children:[e.jsx("span",{className:"due-label",children:"মোট বাকি:"}),e.jsxs("span",{className:"due-value",children:["৳",s.currentDue.toLocaleString()]})]}),e.jsx("button",{className:`action-btn-view ${b===r?"active":""}`,onClick:()=>A(b===r?null:r),title:"বিস্তারিত দেখুন",children:e.jsx(W,{size:16})})]})]}),b===r&&e.jsxs("div",{className:"customer-details-box animate-slide-in",children:[e.jsx("div",{className:"details-header",children:e.jsx("h5",{className:"details-title",children:"লেনদেনের ইতিহাস"})}),e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"summary-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"তারিখ"}),e.jsx("th",{children:"পূর্বের বাকি"}),e.jsx("th",{children:"নতুন মাল"}),e.jsx("th",{children:"জমা"}),e.jsx("th",{children:"বর্তমান বাকি"}),e.jsx("th",{style:{width:"80px"},children:"অ্যাকশন"})]})}),e.jsx("tbody",{children:a.map(o=>e.jsxs("tr",{children:[e.jsx("td",{className:"date-cell",children:o.date}),e.jsxs("td",{children:["৳ ",o.previousDue.toLocaleString()]}),e.jsxs("td",{className:"amount-new",children:["৳ ",o.newAmount.toLocaleString()]}),e.jsxs("td",{className:"amount-paid",children:["৳ ",o.paidNow.toLocaleString()]}),e.jsxs("td",{className:"amount-due",children:["৳ ",o.remainingDue.toLocaleString()]}),e.jsx("td",{className:"actions-cell",children:e.jsxs("div",{className:"flex gap-2 justify-center",children:[e.jsx("button",{className:"action-btn-sm",onClick:()=>L(o),title:"এডিট",children:e.jsx(D,{size:12})}),e.jsx("button",{className:"action-btn-sm-delete",onClick:()=>I(o.id),title:"ডিলিট",children:e.jsx(F,{size:12})})]})})]},o.id))})]})})]})]},r))}),e.jsx("style",{children:`
                .wholesale-page { width: 100%; max-width: 1100px; margin: 0 auto; padding-bottom: 3rem; font-family: 'Hind Siliguri', sans-serif; }
                
                /* Typography & Colors */
                .amount-primary { color: var(--primary); }
                .amount-success { color: var(--success); }
                .amount-danger { color: var(--danger); }
                .label-light { font-weight: 300; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; display: block; }
                .label-xs { font-size: 0.75rem; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.025em; }
                .input-bold { font-weight: 700; }
                
                /* Layout Components */
                /* Dashboard-style Summary Cards */
                .summary-card { padding: 1.5rem; }
                .summary-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .summary-label { font-size: 0.875rem; font-weight: 300; color: var(--text-muted); }
                .summary-body h3 { font-size: 1.75rem; margin-bottom: 0.25rem; font-weight: 700; }
                .summary-body p { font-size: 0.75rem; color: var(--text-muted); }
                
                .grid-cols-12 { display: grid; grid-template-columns: repeat(12, 1fr); }
                .col-span-6 { grid-column: span 6 / span 6; }
                .col-span-3 { grid-column: span 3 / span 3; }
                .col-span-2 { grid-column: span 2 / span 2; }
                .col-span-1 { grid-column: span 1 / span 1; }

                /* Premium Form Styling */
                .form-card-container { padding: 0; overflow: hidden; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid var(--border); background: white; margin-bottom: 3.5rem; }
                .form-header-premium { padding: 0.75rem 1.5rem; background: #fafafa; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .form-icon-pill { width: 36px; height: 36px; background: #eef2ff; color: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
                .btn-close-subtle { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0.4rem; border-radius: 0.5rem; transition: 0.2s; }
                .btn-close-subtle:hover { background: #fee2e2; color: var(--danger); }
                
                .wholesale-modern-form { padding: 0.25rem 1.5rem 1.25rem 1.5rem; }
                .form-section { border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem; margin-bottom: 1rem; }
                .form-section.bg-subtle { background: #f8fafc; margin: 0 -1.5rem 1rem -1.5rem; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0; }
                .form-section.no-border { border-bottom: none; margin-bottom: 0.5rem; padding-bottom: 0; }
                
                .section-title { font-size: 0.875rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .billing-grid { display: grid; grid-template-columns: 1fr 1fr 0.75fr; gap: 1.5rem; align-items: flex-start; }
                .due-field-compact { justify-self: end; width: 100%; max-width: 220px; }
                .text-right { text-align: right; }
                
                .item-row-modern-container { margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.15rem; }
                .item-row-date { font-size: 0.65rem; color: var(--text-muted); font-weight: 500; padding-left: 0.25rem; }
                
                .input-readonly { 
                    padding: 0.625rem 0.875rem; 
                    background: #f1f5f9; 
                    border: 1px solid #e2e8f0; 
                    border-radius: var(--radius); 
                    font-weight: 700; 
                    color: #64748b; 
                    cursor: not-allowed; 
                    display: flex; 
                    align-items: center; 
                    gap: 0.25rem; 
                }
                .currency-symbol { opacity: 0.5; font-weight: 300; }
                
                .input-readonly-style { background: #f8fafc !important; color: #94a3b8 !important; border-style: dashed !important; cursor: not-allowed; }
                .input-success-focus:focus { border-color: var(--success); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
                .input-total-due { 
                    background: #fff1f2; 
                    border: 1.5px solid #fecaca; 
                    padding: 0.5rem 0.875rem; 
                    border-radius: var(--radius); 
                    color: var(--danger); 
                    font-weight: 800; 
                    font-size: 1.15rem; 
                    height: 42px;
                    display: flex; 
                    align-items: center; 
                    justify-content: flex-end; 
                    gap: 0.5rem; 
                    line-height: 1;
                }
                
                .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
                .items-list-container { max-height: 300px; overflow-y: auto; padding-right: 0.5rem; }
                .empty-items-placeholder { text-align: center; padding: 2rem; color: #cbd5e1; border: 2px dashed #e2e8f0; border-radius: 0.75rem; font-style: italic; font-size: 0.875rem; }
                
                .btn-remove-item { background: #fff1f2; color: #f43f5e; border: 1px solid #fecaca; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
                .btn-remove-item:hover { background: var(--danger); color: white; border-color: var(--danger); transform: scale(1.1); }
                
                .helper-text { display: block; font-size: 0.7rem; color: #94a3b8; margin-top: 0.25rem; font-style: italic; }
                
                .form-actions-premium { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border); padding: 1rem 1.5rem; background: #fafafa; margin: 1rem -1.5rem -1.5rem -1.5rem; }
                .btn-primary-modern { background: var(--primary); color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2); }
                .btn-primary-modern:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3); }
                .btn-secondary-modern { background: white; border: 1px solid var(--border); padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 500; color: #64748b; cursor: pointer; transition: 0.2s; }
                .btn-secondary-modern:hover { background: #f8fafc; border-color: #cbd5e1; }

                /* List View Refinement */
                .empty-state-card { text-align: center; padding: 4rem 2rem; border: 2px dashed var(--border); background: none; box-shadow: none; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .empty-icon { opacity: 0.2; }
                
                .customer-summary-card { padding: 0; overflow: hidden; border-radius: 1rem; margin-bottom: 1.5rem; background: white; border: 1px solid var(--border); }
                .customer-card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: #f8fafc; border-bottom: 1px solid var(--border); }
                .customer-name { margin: 0; font-size: 1.1rem; color: var(--text); display: flex; align-items: center; gap: 0.75rem; font-weight: 700; }
                .avatar-small { width: 32px; height: 32px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                
                .card-actions { display: flex; align-items: center; gap: 1rem; }
                
                .header-due-badge { 
                    display: flex; 
                    align-items: center; 
                    gap: 0.5rem; 
                    background: #fff1f2; 
                    padding: 0.25rem 0.75rem; 
                    border-radius: 2rem; 
                    border: 1px solid #fecaca;
                    margin-right: 0.5rem;
                }
                .due-label { font-size: 0.75rem; color: #991b1b; font-weight: 500; }
                .due-value { font-size: 1rem; color: var(--danger); font-weight: 800; }
                
                .action-btn-edit, .action-btn-delete, .action-btn-view { background: white; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: 0.2s; }
                .action-btn-view:hover, .action-btn-view.active { color: var(--primary); border-color: var(--primary); background: #eff6ff; }
                .action-btn-edit:hover { color: var(--primary); border-color: var(--primary); background: #eff6ff; }
                .action-btn-delete:hover { color: var(--danger); border-color: var(--danger); background: #fef2f2; }
                
                .customer-details-box { border-top: 1px solid var(--border); background: #fafafa; }
                .details-header { padding: 0.75rem 1.25rem; border-bottom: 1px solid #f1f5f9; }
                .details-title { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
                
                .actions-cell { padding: 0.5rem !important; }
                .action-btn-sm, .action-btn-sm-delete { width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; background: white; cursor: pointer; color: #64748b; transition: 0.2s; }
                .action-btn-sm:hover { color: var(--primary); border-color: var(--primary); background: #eff6ff; }
                .action-btn-sm-delete:hover { color: var(--danger); border-color: var(--danger); background: #fef2f2; }
                
                .summary-table { width: 100%; border-collapse: collapse; }
                .summary-table th { background: #fff; padding: 0.75rem 1.25rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; border-bottom: 1px solid #f1f5f9; text-align: center; }
                .summary-table td { padding: 1rem 1.25rem; text-align: center; font-weight: 600; font-size: 1rem; }
                .summary-table .date-cell { font-size: 0.875rem; color: #64748b; font-weight: 400; }
                
                .amount-new { color: var(--primary); }
                .amount-paid { color: var(--success); }
                .amount-due { color: var(--danger); font-weight: 800; font-size: 1.1rem; }

                /* Animations */
                @keyframes slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
                
                @media (max-width: 768px) {
                    .grid-cols-3 { grid-template-columns: 1fr; gap: 1rem; }
                    .grid-cols-2 { grid-template-columns: 1fr; gap: 1rem; }
                    .item-row-modern { grid-template-columns: 1fr; gap: 0.5rem; padding: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
                    .items-table-header { display: none; }
                }
            `})]})};export{G as default};
