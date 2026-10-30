(()=>{
  const nav=document.getElementById('site-nav'),menu=document.querySelector('.menu-toggle');
  if(nav&&menu){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

  /* Contact form.
     - data-form-endpoint: if set (e.g. a Formspree or Netlify Forms URL), the form posts there directly.
     - data-contact-email: used as the fallback (opens the visitor's email app) and in error messages. */
  const form=document.getElementById('contact-form');
  if(!form)return;
  const status=document.getElementById('form-feedback');
  const button=form.querySelector('button[type="submit"]');
  const to=(form.dataset.contactEmail||'').trim();
  const endpoint=(form.dataset.formEndpoint||'').trim();
  const configured=v=>v&&!v.startsWith('__');
  const say=(msg,kind)=>{status.textContent=msg;status.dataset.state=kind||'';};

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(form);
    if((fd.get('website')||'').trim())return; // spam trap
    if(configured(endpoint)){
      button.disabled=true;say('Sending your enquiry…');
      fd.delete('website');
      fetch(endpoint,{method:'POST',body:fd,headers:{Accept:'application/json'}})
        .then(r=>{if(!r.ok)throw new Error(r.status);form.reset();say('Thank you. Your enquiry has been sent and we will be in touch shortly.','ok');})
        .catch(()=>say(configured(to)?'Sorry, the form could not be sent. Please email us at '+to+'.':'Sorry, the form could not be sent. Please try again later.','error'))
        .finally(()=>{button.disabled=false;});
      return;
    }
    if(!configured(to)){say('Contact address has not yet been configured. Please add it before launch.','error');return;}
    const subject=encodeURIComponent('ClarioServ enquiry — '+(fd.get('company')||fd.get('name')));
    const body=encodeURIComponent('Name: '+fd.get('name')+'\nEmail: '+fd.get('email')+'\nCompany: '+(fd.get('company')||'')+'\n\nRequirement:\n'+fd.get('need'));
    location.href='mailto:'+to+'?subject='+subject+'&body='+body;
    say('Your email app should open with your enquiry ready to send. If nothing happens, email us at '+to+'.','ok');
  });
})();
