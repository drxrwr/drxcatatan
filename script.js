let data = JSON.parse(localStorage.getItem("bayar")) || [];
let editIndex = null;
let sortMode = "new";
let colorFilter = "all";
let keyword = "";
let tapTimer = null;

function daysDiff(date){
  return Math.floor((new Date() - new Date(date)) / (1000*60*60*24));
}

function getColor(day){
  if(day<=2) return {bg:"#7adf9a",key:"green"};
  if(day<=6) return {bg:"#6fd3c3",key:"lblue"};
  if(day<=15) return {bg:"#7db0dd",key:"dblue"};
  if(day<=30) return {bg:"#b88be2",key:"purple"};
  return {bg:"#e18b8b",key:"red"};
}

function cardTap(id){
  if(tapTimer){
    clearTimeout(tapTimer);
    tapTimer=null;
    edit(id);
  }else{
    tapTimer=setTimeout(()=>tapTimer=null,300);
  }
}

function render(){
  let list=[...data];

  if(keyword) list=list.filter(d=>d.username.toLowerCase().includes(keyword));
  if(colorFilter!=="all")
    list=list.filter(d=>getColor(daysDiff(d.date)).key===colorFilter);

  list.sort((a,b)=>sortMode==="new"
    ? new Date(b.date)-new Date(a.date)
    : new Date(a.date)-new Date(b.date)
  );

  const el=document.getElementById("list");
  el.innerHTML="";

  list.forEach(d=>{
    const day=daysDiff(d.date);
    const color=getColor(day);
    el.innerHTML+=`
      <div class="card" style="background:${color.bg}"
        ontouchend="cardTap('${d.id}')" ondblclick="edit('${d.id}')">
        <a href="https://t.me/${d.username.replace('@','')}" target="_blank">${d.username}</a>
        <small>${d.amount||""} ${d.note||""}</small>
        <small>${new Date(d.date).toLocaleDateString("id-ID")} • ${day} hari</small>
        <span class="edit" data-id="${d.id}">✏️</span>
      </div>
    `;
  });

  document.querySelectorAll('.edit').forEach(e=>{
    const id=e.dataset.id;
    e.onclick=(x)=>{x.stopPropagation();edit(id)};
    e.ontouchend=(x)=>{x.stopPropagation();edit(id)};
  });

  localStorage.setItem("bayar", JSON.stringify(data));
}

function openAdd(){
  editIndex=null;
  modalTitle.innerText="Tambah";
  deleteBtn.style.display="none";
  username.value="";
  amount.value="";
  note.value="";
  modal.style.display="flex";
}

function edit(id){
  editIndex=data.findIndex(d=>d.id===id);
  const d=data[editIndex];
  modalTitle.innerText="Edit";
  deleteBtn.style.display="block";
  username.value=d.username;
  amount.value=d.amount;
  note.value=d.note;
  modal.style.display="flex";
}

function save(){
  if(!username.value.trim().startsWith("@"))
    return alert("Username harus diawali @");

  const obj={
    id: editIndex===null?Date.now():data[editIndex].id,
    username: username.value.trim(),
    amount: amount.value.trim(),
    note: note.value.trim(),
    date: editIndex===null?new Date():data[editIndex].date
  };

  if(editIndex===null) data.unshift(obj);
  else data[editIndex]=obj;

  modal.style.display="none";
  render();
}

function remove(){
  if(confirm("Yakin hapus catatan ini?")){
    data.splice(editIndex,1);
    modal.style.display="none";
    render();
  }
}

function toggleMenu(){
  menu.style.display=menu.style.display==="block"?"none":"block";
}

function setSort(v){sortMode=v;menu.style.display="none";render()}
function setColor(v){colorFilter=v;menu.style.display="none";render()}
function search(v){keyword=v.toLowerCase();render()}

render();
