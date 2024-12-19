import sys
import io
from collections import deque
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Trạng thái (Wolf, Goat, Cabbage, Farmer)
# 0: Bờ trái, 1: Bờ phải
trang_thai = [(0, 0, 0, 0), (1, 1, 1, 1)]  # Trạng thái bắt đầu và kết thúc
ke = {}  # Sẽ được sinh tự động

check = {}  # Trạng thái đã duyệt
father = {}  # Lưu cha của trạng thái

# Hàm kiểm tra trạng thái hợp lệ
def is_valid_state(state):
    wolf, goat, cabbage, farmer = state
    if farmer != goat and (goat == wolf or goat == cabbage):  # Dê không an toàn
        return False
    return True

# Sinh trạng thái kề
def sinh_ke(state):
    wolf, goat, cabbage, farmer = state
    moves = [
        (0, 0, 0, 1),  # Chỉ người lái đò
        (1, 0, 0, 1),  # Người lái đò + Sói
        (0, 1, 0, 1),  # Người lái đò + Dê
        (0, 0, 1, 1)   # Người lái đò + Bắp cải
    ]
    neighbors = []
    for move in moves:
        new_state = (
            wolf ^ move[0],
            goat ^ move[1],
            cabbage ^ move[2],
            farmer ^ move[3],
        )
        if is_valid_state(new_state):
            neighbors.append(new_state)
    return neighbors

# DFS
def DFS(start, end):
    stack = [start]
    check[start] = True  # Đánh dấu trạng thái bắt đầu là đã thăm
    while stack:
        current = stack.pop()
        if current == end:
            return True
        for neighbor in sinh_ke(current):
            if neighbor not in check:
                check[neighbor] = True
                father[neighbor] = current
                stack.append(neighbor)
    return False

# Truy vết đường đi
def tim_duong_di(end):
    path = []
    while end is not None:
        path.append(end)
        end = father.get(end)
    path.reverse()
    return path

# Cài đặt bài toán
start = (0, 0, 0, 0)
end = (1, 1, 1, 1)
check[start] = False  # Khởi tạo check cho trạng thái bắt đầu
father[start] = None  # Trạng thái bắt đầu không có cha

if DFS(start, end):
    path = tim_duong_di(end)
    print("Lời giải:")
    for state in path:
        print(state)
else:
    print("Không có lời giải!")
