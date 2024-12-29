const bankA = document.getElementById("objects-a");
const bankB = document.getElementById("objects-b");
const moveButton = document.getElementById("move");
const statusText = document.getElementById("status");

// Trạng thái ban đầu: [Sói, Dê, Cải, Người]
let state = [0, 0, 0, 0];
let boatPosition = 0; // 0: bờ A, 1: bờ B
let selectedObjects = []; // Lưu các đối tượng được chọn

// Cập nhật giao diện theo trạng thái
function updateUI() {
  bankA.innerHTML = "";
  bankB.innerHTML = "";
  selectedObjects = []; // Reset danh sách đã chọn

  ["Sói", "Dê", "Cải", "Người"].forEach((obj, i) => {
    const element = document.createElement("div");
    element.textContent = obj;
    element.dataset.index = i;

    // Xử lý chọn đối tượng
    element.addEventListener("click", () => toggleSelection(element, i));

    // Thêm vào bờ tương ứng
    if (state[i] === 0) {
      bankA.appendChild(element);
    } else {
      bankB.appendChild(element);
    }
  });
}

// Bật/tắt trạng thái chọn đối tượng
function toggleSelection(element, index) {
  if (state[index] !== boatPosition) {
    statusText.textContent = "Chỉ chọn đối tượng ở cùng bờ với thuyền!";
    return;
  }

  if (selectedObjects.includes(index)) {
    // Bỏ chọn
    selectedObjects = selectedObjects.filter((i) => i !== index);
    element.classList.remove("selected");
  } else if (selectedObjects.length < 2) {
    // Chọn thêm
    selectedObjects.push(index);
    element.classList.add("selected");
  } else {
    statusText.textContent = "Thuyền chỉ chứa tối đa 2 đối tượng!";
  }
}

// Kiểm tra trạng thái hợp lệ
function isSafe() {
  // Sói và dê không thể ở cùng nhau mà không có người
  if (state[0] === state[1] && state[0] !== state[3]) return false;
  // Dê và cải không thể ở cùng nhau mà không có người
  if (state[1] === state[2] && state[1] !== state[3]) return false;
  return true;
}

// Kiểm tra thắng cuộc
function checkWin() {
  if (state.every((pos) => pos === 1)) {
    statusText.textContent = "Chúc mừng! Bạn đã hoàn thành trò chơi!";
    moveButton.disabled = true;
  }
}

// Di chuyển
moveButton.addEventListener("click", () => {
  if (!selectedObjects.includes(3)) {
    statusText.textContent = "Người phải đi kèm thuyền!";
    return;
  }

  // Di chuyển các đối tượng đã chọn
  selectedObjects.forEach((index) => {
    state[index] = 1 - state[index];
  });

  // Cập nhật vị trí thuyền
  boatPosition = 1 - boatPosition;

  // Kiểm tra an toàn
  if (!isSafe()) {
    statusText.textContent = "Trạng thái không hợp lệ! Sói ăn dê hoặc dê ăn cải!";
    // Hoàn tác di chuyển
    selectedObjects.forEach((index) => {
      state[index] = 1 - state[index];
    });
    boatPosition = 1 - boatPosition;
    return;
  }

  // Reset lựa chọn
  selectedObjects = [];
  statusText.textContent = "";

  // Cập nhật giao diện và kiểm tra thắng
  updateUI();
  checkWin();
});

// Khởi tạo
updateUI();
