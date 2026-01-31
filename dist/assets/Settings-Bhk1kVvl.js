import{a as n,S as a,u as v,j as e,e as N,f as w,h as y}from"./index-LF0qJdOy.js";import{U as S}from"./user-C7YofTWF.js";import{C as x}from"./circle-check-big-UsOlufWJ.js";import{L as C}from"./lock-C7WF2ORS.js";const P=()=>{const[r,d]=n.useState(()=>a.getUser()),[m,u]=n.useState(""),[t,i]=n.useState({current:"",new:""}),[g,l]=n.useState(""),[p,o]=n.useState(""),h=v(),j=s=>{if(s.preventDefault(),r){a.setUser(r);const c=a.getCredentials();a.updateCredentials(c.password,r.email),u("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!"),setTimeout(()=>u(""),3e3)}},b=s=>{s.preventDefault(),l(""),o("");const c=a.getCredentials();if(t.current!==c.password){l("বর্তমান পাসওয়ার্ড সঠিক নয়");return}if(t.new.length<4){l("নতুন পাসওয়ার্ড কমপক্ষে ৪টি অক্ষরের হতে হবে");return}a.updateCredentials(t.new),o("পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!"),i({current:"",new:""}),setTimeout(()=>o(""),3e3)},f=()=>{a.logout(),h("/login")};return e.jsxs("div",{className:"settings-page",children:[e.jsxs("div",{className:"page-header mb-8",children:[e.jsxs("h1",{className:"flex items-center",children:[e.jsx("span",{className:"header-icon-container",children:e.jsx(N,{size:18})}),"সেটিংস"]}),e.jsx("p",{className:"text-muted mt-1",children:"আপনার প্রোফাইল এবং নিরাপত্তা ব্যবস্থাপনা"})]}),e.jsxs("div",{className:"settings-grid",children:[e.jsxs("div",{className:"card settings-card",children:[e.jsxs("div",{className:"section-title",children:[e.jsx(S,{size:20}),e.jsx("h3",{children:"ব্যক্তিগত তথ্য"})]}),e.jsxs("form",{onSubmit:j,children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label",children:"আপনার নাম"}),e.jsx("input",{type:"text",className:"input",value:r?.name||"",onChange:s=>r&&d({...r,name:s.target.value})})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label",children:"ইমেইল ঠিকানা"}),e.jsx("input",{type:"email",className:"input",value:r?.email||"",onChange:s=>r&&d({...r,email:s.target.value})})]}),m&&e.jsxs("div",{className:"success-msg",children:[e.jsx(x,{size:16})," ",m]}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"তথ্য আপডেট করুন"})]})]}),e.jsxs("div",{className:"card settings-card",children:[e.jsxs("div",{className:"section-title",children:[e.jsx(C,{size:20}),e.jsx("h3",{children:"পাসওয়ার্ড পরিবর্তন"})]}),e.jsxs("form",{onSubmit:b,children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label",children:"বর্তমান পাসওয়ার্ড"}),e.jsx("input",{type:"password",className:"input",placeholder:"••••••••",value:t.current,onChange:s=>i({...t,current:s.target.value}),required:!0})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label",children:"নতুন পাসওয়ার্ড"}),e.jsx("input",{type:"password",className:"input",placeholder:"••••••••",value:t.new,onChange:s=>i({...t,new:s.target.value}),required:!0})]}),g&&e.jsx("div",{className:"error-msg",children:g}),p&&e.jsxs("div",{className:"success-msg",children:[e.jsx(x,{size:16})," ",p]}),e.jsxs("div",{className:"flex justify-between items-center mt-2",children:[e.jsx("button",{type:"submit",className:"btn btn-secondary",children:"পাসওয়ার্ড আপডেট করুন"}),e.jsx(w,{to:"/forgot-password",className:"forgot-password-link",children:"পাসওয়ার্ড ভুলে গেছেন?"})]})]})]}),e.jsxs("div",{className:"card settings-card danger-zone",children:[e.jsxs("div",{className:"section-title",children:[e.jsx(y,{size:20}),e.jsx("h3",{children:"অ্যাকাউন্ট"})]}),e.jsx("p",{children:"আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে পারেন।"}),e.jsx("button",{onClick:f,className:"btn btn-danger w-full mt-4",children:"লগআউট করুন"})]})]}),e.jsx("style",{children:`
        .settings-page { max-width: 900px; margin: 0 auto; }
        .settings-grid { display: flex; flex-direction: column; gap: 2rem; }
        
        .settings-card { padding: 2rem; }
        .section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .section-title h3 { font-size: 1.125rem; }

        .success-msg { 
          display: flex; align-items: center; gap: 0.5rem; 
          background: #d1fae5; color: #065f46; 
          padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .error-msg { 
          background: #fee2e2; color: #991b1b; 
          padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .danger-zone { border-color: #fee2e2; }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }

        .forgot-password-link {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          transition: color 0.2s;
        }
        .forgot-password-link:hover {
          color: var(--primary-hover);
        }
      `})]})};export{P as default};
