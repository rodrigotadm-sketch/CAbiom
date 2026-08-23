
(async()=>{
const root=document.getElementById('app'), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let D;try{D=await fetch('cabiom.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()})}catch(e){root.innerHTML='<div class="empty">Não foi possível carregar os dados do CABIOM.</div>';return}
root.innerHTML=`<section class="hero"><div class="eyebrow">UFPR · CURSO DE BIOMEDICINA</div><h1>${esc(D.title)}</h1><p>${esc(D.subtitle)}</p></section><div class="intro">${esc(D.intro)}</div><div class="controls"><input id="q" type="search" placeholder="Buscar por ano, nome ou cargo"><select id="f"><option value="todas">Todas as gestões</option><option value="atualizar">Aguardando atualização</option><option value="historicas">Gestões históricas</option></select></div><div id="list"></div>`;
const q=document.getElementById('q'),f=document.getElementById('f'),list=document.getElementById('list');
function card(g){
 const placeholder=g.status!=='historica';
 const people=g.membros.map(x=>`<div class="person"><div class="role">${esc(x[0])}</div><div class="name">${esc(x[1])}</div></div>`).join('');
 const reps=g.representacao?.length?`<div class="rep"><h3>Representação discente</h3><div class="grid">${g.representacao.map(x=>`<div class="person"><div class="role">${esc(x[0])}</div><div class="name">${esc(x[1])}</div></div>`).join('')}</div></div>`:'';
 return `<article class="gestao ${placeholder?'placeholder':''}" data-year="${esc(g.ano)}"><div class="gestao-head"><div><div class="year">Gestão ${esc(g.ano)}</div>${g.nome_gestao?`<div>${esc(g.nome_gestao)}</div>`:''}</div><div style="display:flex;gap:8px;align-items:center">${placeholder?`<span class="badge">${g.status==='aguardando_atualizacao'?'EM ATUALIZAÇÃO':'SEM REGISTRO'}</span>`:''}<span class="toggle">+</span></div></div><div class="body">${g.observacoes?`<div class="note">${esc(g.observacoes)}</div>`:''}${people?`<div class="grid" style="margin-top:10px">${people}</div>`:''}${reps}</div></article>`;
}
function render(){
 const s=q.value.toLowerCase().trim(),fv=f.value;
 const arr=D.gestoes.filter(g=>{
   const filterOk=fv==='todas'||(fv==='atualizar'&&g.status!=='historica')||(fv==='historicas'&&g.status==='historica');
   const txt=[g.ano,g.nome_gestao,g.observacoes,...g.membros.flat(),...(g.representacao||[]).flat()].join(' ').toLowerCase();
   return filterOk&&(!s||txt.includes(s));
 });
 list.innerHTML=arr.length?arr.map(card).join(''):'<div class="empty">Nenhuma gestão encontrada.</div>';
 list.querySelectorAll('.gestao-head').forEach(h=>h.onclick=()=>{const a=h.parentElement;a.classList.toggle('open');h.querySelector('.toggle').textContent=a.classList.contains('open')?'−':'+'});
}
q.addEventListener('input',render);f.addEventListener('change',render);render();
})();
