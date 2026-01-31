import{c as b,a,u as j,j as e,f as l,S as c}from"./index-LF0qJdOy.js";import{M as w}from"./mail-BX54_Bd-.js";import{L as v}from"./lock-C7WF2ORS.js";import{E as y}from"./eye-CtS1mcc7.js";const N=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],k=b("eye-off",N),C=()=>{const[i,d]=a.useState(""),[o,m]=a.useState(""),[s,u]=a.useState(!1),[n,h]=a.useState(""),p=j(),g=t=>{t.preventDefault();const r=c.getCredentials(),x=i.trim().toLowerCase(),f=r.email.trim().toLowerCase();x===f&&o===r.password?(c.setUser({name:"Admin User",email:r.email}),p("/")):h("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়")};return e.jsxs("div",{className:"auth-page",children:[e.jsxs("div",{className:"auth-card card",children:[e.jsxs("div",{className:"auth-header",children:[e.jsx("img",{src:"/logo.png",alt:"Hissab Note",className:"logo-icon large"}),e.jsx("h1",{children:"স্বাগতম"}),e.jsx("p",{children:"আপনার অ্যাকাউন্টে লগইন করুন"})]}),e.jsxs("form",{onSubmit:g,children:[n&&e.jsx("div",{className:"error-badge",children:n}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label",children:"ইমেইল"}),e.jsxs("div",{className:"input-with-icon",children:[e.jsx(w,{size:18,className:"icon"}),e.jsx("input",{type:"email",className:"input",placeholder:"email@example.com",value:i,onChange:t=>d(t.target.value),required:!0})]})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{className:"label",children:"পাসওয়ার্ড"}),e.jsxs("div",{className:"input-with-icon",children:[e.jsx(v,{size:18,className:"icon"}),e.jsx("input",{type:s?"text":"password",className:"input",placeholder:"••••••••",value:o,onChange:t=>m(t.target.value),required:!0}),e.jsx("button",{type:"button",className:"password-toggle",onClick:()=>u(!s),children:s?e.jsx(k,{size:18}):e.jsx(y,{size:18})})]})]}),e.jsx("div",{className:"auth-actions",children:e.jsx(l,{to:"/forgot-password",children:"পাসওয়ার্ড ভুলে গেছেন?"})}),e.jsx("button",{type:"submit",className:"btn btn-primary w-full shadow-lg",children:"লগইন করুন"})]}),e.jsxs("div",{className:"auth-footer",children:["অ্যাকাউন্ট নেই? ",e.jsx(l,{to:"/signup",children:"নতুন অ্যাকাউন্ট খুলুন"})]})]}),e.jsx("style",{children:`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 1rem;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-icon.large {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: contain;
        }

        .auth-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: var(--text-muted);
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon .icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-with-icon .input {
          padding-left: 2.75rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          color: var(--text-muted);
        }

        .auth-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: var(--primary);
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-footer a {
          color: var(--primary);
          font-weight: 700;
        }

        .error-badge {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }

        .w-full { width: 100%; }
      `})]})};export{C as default};
