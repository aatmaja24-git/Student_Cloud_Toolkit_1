let editIndex = -1;

// CREATE / UPDATE
function addAssignment(){

const title = document.getElementById("assignmentTitle").value;
const deadline = document.getElementById("deadline").value;
const country = document.getElementById("country").value;

if(!title || !deadline){
alert("Enter assignment details");
return;
}

let list = JSON.parse(localStorage.getItem("assignments")) || [];

if(editIndex === -1){
// CREATE
list.push({title, deadline, country});
}else{
// UPDATE
list[editIndex] = {title, deadline, country};
editIndex = -1;
}

localStorage.setItem("assignments", JSON.stringify(list));

clearInputs();
displayAssignments();
}

// READ
function displayAssignments(){

const list = JSON.parse(localStorage.getItem("assignments")) || [];

// Sort by deadline
list.sort((a,b)=> new Date(a.deadline) - new Date(b.deadline));

let html = "";

list.forEach((a, index)=>{

const daysLeft = getDaysLeft(a.deadline);

let statusText = "";
let statusClass = "";

if(daysLeft < 0){
statusText = "❌ Overdue";
statusClass = "overdue";
}else if(daysLeft <= 2){
statusText = "⚠️ Due Soon";
statusClass = "soon";
}else{
statusText = "✅ On Track";
statusClass = "ok";
}

html += `
<div class="assignment-card">
<h3>${a.title}</h3>
<p>📅 ${a.deadline}</p>
<p>🌍 ${a.country}</p>
<p class="status ${statusClass}">${statusText}</p>

<div class="actions">
<button onclick="editAssignment(${index})" class="edit-btn">
<i class="fa-solid fa-pen"></i>
</button>

<button onclick="deleteAssignment(${index})" class="delete-btn">
<i class="fa-solid fa-trash"></i>
</button>
</div>
</div>
`;
});

document.getElementById("plannerResult").innerHTML = html;
}
// DELETE
function deleteAssignment(index){

let list = JSON.parse(localStorage.getItem("assignments")) || [];

list.splice(index,1);

localStorage.setItem("assignments", JSON.stringify(list));

displayAssignments();
}

// UPDATE (fill form)
function editAssignment(index){

let list = JSON.parse(localStorage.getItem("assignments")) || [];

document.getElementById("assignmentTitle").value = list[index].title;
document.getElementById("deadline").value = list[index].deadline;
document.getElementById("country").value = list[index].country;

editIndex = index;
}

// Helper
function getDaysLeft(deadline){
const today = new Date();
const due = new Date(deadline);
return Math.ceil((due - today)/(1000*60*60*24));
}

// Clear inputs
function clearInputs(){
document.getElementById("assignmentTitle").value = "";
document.getElementById("deadline").value = "";
}

// Initial load
displayAssignments();