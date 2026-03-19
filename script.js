document.addEventListener("DOMContentLoaded", () => {

const input = document.getElementById("input");
const addButton = document.getElementById("add");
const list = document.getElementById("list");

let schedules = JSON.parse(localStorage.getItem("schedules")) || [];
let editId = null;

function save() {
localStorage.setItem("schedules", JSON.stringify(schedules));
}

function render() {

list.innerHTML = "";

schedules.forEach(schedule => {

const li = document.createElement("li");

li.innerHTML = `
<span>${schedule.text}</span>
<div>
<button class="edit">編集</button>
<button class="delete">削除</button>
</div>
`;

li.querySelector(".delete").onclick = () => {

schedules = schedules.filter(s => s.id !== schedule.id);

save();
render();

};

li.querySelector(".edit").onclick = () => {

input.value = schedule.text;

editId = schedule.id;

addButton.textContent = "更新";

};

list.appendChild(li);

});

}

addButton.onclick = () => {

if (!input.value) return;

if (editId) {

schedules = schedules.map(s =>
s.id === editId
? { ...s, text: input.value }
: s
);

editId = null;
addButton.textContent = "追加";

} else {

schedules.push({
id: Date.now(),
text: input.value
});

}

save();

input.value = "";

render();

};

render();

});