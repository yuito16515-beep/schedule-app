document.addEventListener("DOMContentLoaded", () => {

  const addButton = document.getElementById("add");
  const list = document.getElementById("list");
  const calendarBody = document.getElementById("calendarBody");
  const monthLabel = document.getElementById("monthLabel");

  let schedules = JSON.parse(localStorage.getItem("schedules")) || [];
  let currentDate = new Date();

  function save() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }

  function renderList() {
    list.innerHTML = "";
    schedules.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.title}</strong><br>
        日付：${item.date}<br>
        メモ：${item.memo || ""}<br>
        <button data-index="${index}">削除</button>
      `;
      li.querySelector("button").onclick = () => {
        schedules.splice(index, 1);
        save();
        renderList();
        renderCalendar();
      };
      list.appendChild(li);
    });
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthLabel.textContent = `${year}年 ${month + 1}月`;
    calendarBody.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().slice(0, 10);

    let row = document.createElement("tr");

    for (let i = 0; i < firstDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    for (let day = 1; day <= lastDate; day++) {
      const cell = document.createElement("td");
      const dateStr =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      cell.textContent = day;

      if (dateStr === todayStr) {
        cell.classList.add("today");
      }

      schedules
        .filter(s => s.date === dateStr)
        .forEach(s => {
          const div = document.createElement("div");
          div.textContent = s.title;
          cell.appendChild(div);
        });

      row.appendChild(cell);

      if ((firstDay + day) % 7 === 0) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }
    }

    calendarBody.appendChild(row);
  }

  addButton.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const memo = document.getElementById("memo").value;

    if (!title || !date) return;

    schedules.push({ title, date, memo });
    save();
    renderList();
    renderCalendar();

    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    document.getElementById("memo").value = "";
  });

  document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  };

  document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  };

  renderList();
  renderCalendar();
});

