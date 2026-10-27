const config=window.E360_CONFIG;
let session=JSON.parse(sessionStorage.getItem('e360_session')||'null');
function validConfig(){return config&&/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url)&&config.publishableKey}
async function request(path,options={}){
 if(!validConfig()) throw new Error('Configure la URL y la clave publicable de Supabase en config.js.');
 const headers={'apikey':config.publishableKey,'Content-Type':'application/json',...options.headers};
 const response=await fetch(config.url+path,{...options,headers}); const body=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(body.message||body.msg||body.error_description||body.error||'No se pudo completar la operación.'); return body;
}
async function signIn(email,password){session=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});sessionStorage.setItem('e360_session',JSON.stringify(session));}
async function refreshSession(){if(!session?.refresh_token)throw new Error('Inicie sesión de nuevo.');session=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})});sessionStorage.setItem('e360_session',JSON.stringify(session));}
async function rpc(name,args){
 const funcs={iniciar:['e360_iniciar',()=>({})],vistaPrevia:['e360_vista_previa',()=>({p_input:args[0]})],guardarCampana:['e360_guardar_campana',()=>({p_input:args[0]})],eliminarCampana:['e360_eliminar_campana',()=>({p_id:args[0]})],baseCampana:['e360_base_campana',()=>({p_id:args[0]})],guardarGestion:['e360_guardar_gestion',()=>({p_input:args[0]})],evaluarPostEvento:['e360_evaluar_post_evento',()=>({p_id:args[0]})]};
 if(!session)throw new Error('Inicie sesión.'); const [fn,params]=funcs[name];
 const run=()=>request('/rest/v1/rpc/'+fn,{method:'POST',headers:{Authorization:'Bearer '+session.access_token},body:JSON.stringify(params())});
 try{return await run()}catch(e){if(/jwt|token|expir/i.test(e.message)){await refreshSession();return run()}throw e}
}
function signOut(){sessionStorage.removeItem('e360_session');session=null;location.reload()}
function start(){
 const login=document.getElementById('login'), app=document.getElementById('application');
 document.getElementById('login-form').onsubmit=async e=>{e.preventDefault();try{await signIn(document.getElementById('email').value,document.getElementById('password').value);login.hidden=true;app.hidden=false;refresh()}catch(err){document.getElementById('login-error').textContent=err.message}};
 if(session){login.hidden=true;app.hidden=false;refresh()}else if(!validConfig())document.getElementById('login-error').textContent='Configure Supabase para iniciar.';
}
