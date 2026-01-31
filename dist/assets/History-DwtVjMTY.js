import{c as N,a as n,S as o,j as e,H as D,X as A,C as M}from"./index-LF0qJdOy.js";import{P as L}from"./pen-DFjvzB85.js";import{T as v}from"./trash-2-TA86Ar1c.js";import{S as R}from"./save-Bs2ayNZI.js";const $=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],y=N("search",$);const T=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],_=N("triangle-alert",T),F=()=>{const[c,g]=n.useState(()=>o.getAccounts()),[x,w]=n.useState(""),[k,m]=n.useState(!1),[i,p]=n.useState([]),[b,f]=n.useState(""),[h,u]=n.useState(null),j=n.useMemo(()=>{const a=c.filter(r=>r.name.toLowerCase().includes(x.toLowerCase())),t={};return a.forEach(r=>{t[r.date]||(t[r.date]=[]),t[r.date].push(r)}),Object.keys(t).sort((r,d)=>d.localeCompare(r)).map(r=>({date:r,accounts:t[r]}))},[c,x]),C=a=>{const t=c.filter(s=>s.date===a);f(a),p(t.map(s=>({id:s.id,isExisting:!0,name:s.name,description:s.description||"",quantity:1,rate:s.total,paid:s.paid}))),m(!0)},z=()=>{p([...i,{id:`new-${Date.now()}-${Math.random()}`,isExisting:!1,name:i[0]?.name||"",description:"",quantity:1,rate:0,paid:0}])},S=a=>{i.length>1&&p(i.filter(t=>t.id!==a))},l=(a,t,s)=>{p(i.map(r=>r.id===a?{...r,[t]:s}:r))},E=a=>{a.preventDefault(),i.forEach(t=>{const s=(t.quantity||1)*t.rate;o.saveAccount({id:t.id.startsWith("new-")?`${Date.now()}-${Math.random()}`:t.id,name:t.name,description:t.description,total:s,paid:t.paid,due:s-t.paid,date:b})}),g(o.getAccounts()),m(!1)},q=()=>{h&&(c.filter(t=>t.date===h).forEach(t=>{o.deleteAccount(t.id)}),g(o.getAccounts()),u(null))};return e.jsxs("div",{className:"history-page",children:[e.jsxs("div",{className:"page-header flex justify-between items-center mb-8",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"flex items-center",children:[e.jsx("span",{className:"header-icon-container",children:e.jsx(D,{size:18})}),"হিসাবের ইতিহাস"]}),e.jsx("p",{className:"text-muted mt-1",children:"সব লেনদেনের বিস্তারিত তালিকা"})]}),e.jsxs("div",{className:"search-box",children:[e.jsx(y,{size:20,className:"search-icon"}),e.jsx("input",{type:"text",placeholder:"কাস্টমারের নাম দিয়ে খুঁজুন...",value:x,onChange:a=>w(a.target.value)})]})]}),j.length===0?e.jsx("div",{className:"card table-card",children:e.jsxs("div",{className:"empty-state",children:[e.jsx(y,{size:24,style:{opacity:.2,marginRight:"1rem"}}),e.jsx("h3",{style:{margin:0,fontSize:"1.125rem"},children:"কোন ফলাফল পাওয়া যায়নি"})]})}):e.jsx("div",{className:"date-groups",children:j.map(({date:a,accounts:t})=>e.jsxs("div",{className:"date-group card",children:[e.jsxs("div",{className:"date-header",children:[e.jsxs("div",{className:"date-header-left",children:["📅 ",e.jsx("span",{className:"date-text",children:a})]}),e.jsxs("div",{className:"date-header-actions",children:[e.jsx("button",{className:"action-btn edit",onClick:()=>C(a),title:"এই তারিখের সব এন্ট্রি এডিট করুন",children:e.jsx(L,{size:16})}),e.jsx("button",{className:"action-btn delete",onClick:()=>u(a),title:"এই তারিখের সব এন্ট্রি ডিলিট করুন",children:e.jsx(v,{size:16})})]})]}),e.jsx("div",{className:"table-container",children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"নাম"}),e.jsx("th",{children:"বিবরণ"}),e.jsx("th",{children:"মোট"}),e.jsx("th",{children:"জমা"}),e.jsx("th",{children:"বাকি"})]})}),e.jsx("tbody",{children:t.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:s.name})}),e.jsx("td",{children:s.description}),e.jsxs("td",{children:["৳ ",s.total.toLocaleString()]}),e.jsxs("td",{className:"text-success",children:["৳ ",s.paid.toLocaleString()]}),e.jsxs("td",{className:"text-danger",children:["৳ ",s.due.toLocaleString()]})]},s.id))})]})})]},a))}),k&&e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"edit-modal-content card",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h2",{children:"হিসাব আপডেট করুন"}),e.jsx("button",{className:"close-btn",onClick:()=>m(!1),children:e.jsx(A,{size:24})})]}),e.jsxs("form",{onSubmit:E,className:"modal-body",children:[e.jsxs("div",{className:"modal-date-section mb-6",children:[e.jsx("label",{className:"label",children:"তারিখ"}),e.jsx("input",{type:"date",className:"input date-input",value:b,onChange:a=>f(a.target.value),required:!0})]}),e.jsxs("div",{className:"modal-table-container",children:[e.jsxs("div",{className:"modal-table-header bg-slate-50",children:[e.jsx("div",{className:"m-header-col col-sn",children:"#"}),e.jsx("div",{className:"m-header-col col-name",children:"নাম"}),e.jsx("div",{className:"m-header-col col-desc",children:"বিবরণ"}),e.jsx("div",{className:"m-header-col col-qty",children:"পরিমাণ"}),e.jsx("div",{className:"m-header-col col-rate",children:"দর"}),e.jsx("div",{className:"m-header-col col-paid",children:"জমা"}),e.jsx("div",{className:"m-header-col col-total",children:"মোট ও বাকি"}),e.jsx("div",{className:"m-header-col col-action"})]}),e.jsx("div",{className:"modal-rows-container",children:i.map((a,t)=>{const s=(a.quantity||1)*a.rate,r=s-a.paid;return e.jsxs("div",{className:"modal-row border-b",children:[e.jsx("div",{className:"m-row-col col-sn",children:t+1}),e.jsx("div",{className:"m-row-col col-name",children:e.jsx("input",{type:"text",className:"input sm",value:a.name,onChange:d=>l(a.id,"name",d.target.value),required:!0})}),e.jsx("div",{className:"m-row-col col-desc",children:e.jsx("input",{type:"text",className:"input sm",value:a.description,onChange:d=>l(a.id,"description",d.target.value)})}),e.jsx("div",{className:"m-row-col col-qty",children:e.jsx("input",{type:"number",className:"input sm text-center",value:a.quantity||"",onChange:d=>l(a.id,"quantity",Number(d.target.value)),required:!0})}),e.jsx("div",{className:"m-row-col col-rate",children:e.jsx("input",{type:"number",className:"input sm text-center",value:a.rate||"",onChange:d=>l(a.id,"rate",Number(d.target.value)),required:!0})}),e.jsx("div",{className:"m-row-col col-paid",children:e.jsx("input",{type:"number",className:"input sm text-center",value:a.paid||"",onChange:d=>l(a.id,"paid",Number(d.target.value)),required:!0})}),e.jsx("div",{className:"m-row-col col-total",children:e.jsxs("div",{className:"modal-summary",children:[e.jsxs("span",{children:["মোট: ",s]}),e.jsxs("span",{className:"text-danger font-bold",children:["বাকি: ",r]})]})}),e.jsx("div",{className:"m-row-col col-action",children:e.jsx("button",{type:"button",className:"btn-icon danger",onClick:()=>S(a.id),disabled:i.length===1,children:e.jsx(v,{size:16})})})]},a.id)})})]}),e.jsxs("button",{type:"button",className:"add-row-btn-modal",onClick:z,children:[e.jsx(M,{size:18,className:"mr-2"}),"নতুন লাইন যোগ করুন"]}),e.jsxs("div",{className:"modal-footer mt-8",children:[e.jsx("button",{type:"button",className:"btn btn-secondary",onClick:()=>m(!1),children:"বাতিল"}),e.jsxs("button",{type:"submit",className:"btn btn-primary lg",children:[e.jsx(R,{size:20,className:"mr-2"}),"পরিবর্তন সংরক্ষণ করুন"]})]})]})]})}),h&&e.jsx("div",{className:"overlay mini",children:e.jsxs("div",{className:"overlay-content confirm-dialog card",children:[e.jsx(_,{size:48,color:"var(--danger)"}),e.jsx("h3",{children:"আপনি কি নিশ্চিত?"}),e.jsx("p",{children:"এই তারিখের সব এন্ট্রি ডিলিট হয়ে যাবে এবং আর ফিরে পাওয়া যাবে না।"}),e.jsxs("div",{className:"overlay-footer",children:[e.jsx("button",{className:"btn btn-secondary",onClick:()=>u(null),children:"না, থাক"}),e.jsx("button",{className:"btn btn-danger",onClick:q,children:"হ্যাঁ, ডিলিট করুন"})]})]})}),e.jsx("style",{children:`
                .history-page { width: 100%; }
                .history-page .empty-state { display: flex; align-items: center; justify-content: center; padding: 4rem 2rem; color: var(--text-muted); }

                .date-groups { display: flex; flex-direction: column; gap: 1.25rem; }
                .date-group { padding: 0; overflow: hidden; }
                .date-header { 
                  padding: 1rem 1.5rem; 
                  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                  border-bottom: 2px solid #e2e8f0;
                  font-size: 1.125rem;
                  font-weight: 700;
                  color: var(--secondary);
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }
                .date-header-left { display: flex; align-items: center; gap: 0.5rem; }
                .date-header-actions { display: flex; gap: 0.5rem; }
                .date-text { color: var(--primary); }

                .search-box {
                  position: relative;
                  width: 350px;
                  height: 40px;
                }
                .search-icon {
                  position: absolute;
                  left: 12px;
                  top: 50%;
                  transform: translateY(-50%);
                  color: var(--secondary);
                  opacity: 0.6;
                  pointer-events: none;
                }
                .search-box input {
                  width: 100%;
                  height: 100%;
                  padding: 0 12px 0 40px;
                  border: 1px solid var(--border);
                  background: #fcfdfe;
                  border-radius: 8px;
                  font-size: 0.9375rem;
                  transition: all 0.2s;
                }
                .search-box input:focus {
                  outline: none;
                  border-color: var(--primary);
                  background: white;
                  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
                }

                .table-card { padding: 0; overflow: hidden; }
                .text-success { color: var(--success); }
                .text-danger { color: var(--danger); }
                .action-btns { display: flex; gap: 0.5rem; }
                .action-btn { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: white; color: var(--secondary); transition: all 0.2s; }
                .action-btn.edit:hover { background: #eff6ff; color: var(--primary); border-color: var(--primary); }
                .action-btn.delete:hover { background: #fef2f2; color: var(--danger); border-color: var(--danger); }

                /* Large Edit Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
                .edit-modal-content { width: 100%; max-width: 85rem; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
                .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: white; }
                .modal-body { padding: 2rem; overflow-y: auto; flex: 1; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border); padding-top: 2rem; }
                
                .modal-table-header { display: grid; grid-template-columns: 40px 1.2fr 1.2fr 80px 100px 100px 1.2fr 40px; padding: 1rem; font-weight: 700; border-radius: 0.5rem 0.5rem 0 0; border: 1px solid var(--border); }
                .modal-row { display: grid; grid-template-columns: 40px 1.2fr 1.2fr 80px 100px 100px 1.2fr 40px; padding: 1rem; gap: 0.75rem; align-items: center; border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
                
                .modal-summary { font-size: 0.75rem; display: flex; flex-direction: column; background: #f8fafc; padding: 0.5rem; border-radius: 0.5rem; }
                
                .add-row-btn-modal { width: 100%; padding: 1.25rem; background: #f8fafc; border: 2px dashed var(--border); border-radius: 0 0 0.5rem 0.5rem; color: var(--primary); font-weight: 700; display: flex; align-items: center; justify-content: center; border-top: none; }
                .add-row-btn-modal:hover { background: #eff6ff; }

                .input.sm { padding: 0.4rem 0.6rem; font-size: 0.875rem; }
                .btn-icon { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: white; }
                .btn-icon.danger { color: var(--danger); border-color: #fee2e2; }
                .btn-icon.danger:hover { background: var(--danger); color: white; }

                .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 3000; }
                .confirm-dialog { max-width: 400px; text-align: center; display: flex; flex-direction: column; align-items: center; padding: 2.5rem; }
                .overlay-footer { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }

                @media (max-width: 640px) {
                  .page-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.5rem;
                  }
                  .search-box {
                    width: 100%;
                  }
                }
            `})]})};export{F as default};
