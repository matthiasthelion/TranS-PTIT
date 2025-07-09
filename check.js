const checkStatusButton = document.getElementById('checkStatusButton');
const urlParams = new URLSearchParams(window.location.search);
const fullnameFromURL = urlParams.get('fullname');
const nameInput = document.querySelector('input[name="fullname"]'); // Lấy input name
var acount = 0;
const autocheckParam = parseInt(urlParams.get('autocheck'), 10);
const autocheckInterval = isNaN(autocheckParam) ? 0 : Math.max(autocheckParam, 0);

var rooms = {
    "room-01": "TBD",
    "room-02": "TBD",
    "room-03": "TBD",
    "room-04": "TBD",
    "room-05": "TBD",
    "room-06": "TBD",
    "room-07": "TBD",
    "room-08": "TBD",
    "room-09": "TBD",
    "room-10": "TBD",
    "room-11": "TBD",
    "room-12": "TBD",
    "room-13": "TBD",
    "room-14": "TBD",
    "room-15": "TBD",
    "room-16": "TBD",
    "room-17": "TBD",
    "room-18": "TBD",
    "room-19": "TBD",
    "room-20": "TBD",
    "room-21": "TBD",
    "room-22": "TBD",
    "room-23": "TBD",
    "room-24": "TBD",
    "room-25": "TBD",
    "room-26": "TBD",
    "room-27": "TBD",
    "room-28": "TBD",
    "room-29": "TBD",
    "room-30": "TBD"
};

function updateRoomStatus() {
    for (const roomId in rooms) {
        const roomElement = document.getElementById(roomId);
        roomElement.innerHTML = ``; // Clear previous content
        /*if (!navigator.onLine){
            roomElement.classList.remove("room-ok");
            roomElement.classList.add("room-not-ok");
            roomElement.innerHTML = `<div class="big-icon">❌</div>`;
            continue;
        }*/
        switch(rooms[roomId]){
            case "OK":
                roomElement.classList.add("room-ok");
                const accessButton = document.createElement("button");
                //accessButton.textContent = "▶️";
                accessButton.innerHTML = `<img src="./images/login2.png" alt="login" width="20">`;
                accessButton.classList.add("btn");
                accessButton.addEventListener("click", () => {
                    JoinRoom(roomId);
                });
                roomElement.appendChild(accessButton);
                break;
            case "NOSTART":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">🕒</div>`;
                roomElement.innerHTML = `<img src="./images/star-off.png" alt="closed" width="30">`;
                break;
            case "REQUIRED_LOGIN":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">🔒</div>`;
                roomElement.innerHTML = `<img src="./images/lock.png" alt="rqlogin" width="30">`;
                break;
            case "NOT_PARTICIPANT":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">⛔</div>`;
                roomElement.innerHTML = `<img src="./images/entry.png" alt="notpct" width="30">`;
                break;
            case "LOST_CONNECTION":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">❌</div>`;
                roomElement.innerHTML = `<img src="./images/no-internet.png" alt="noconn" width="30">`;
                break;
            default:
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">🔄</div>`;
                roomElement.innerHTML = `<img src="./images/circleloader.gif" alt="loading" width="30">`;
                break;
        }
    }
}

function showAlert(message) {
    const modalBody = document.querySelector('#alertModal .modal-body');
    modalBody.textContent = message;
    $('#alertModal').modal('show');
}

function showToast(message) {
    try {
        const $toast = $('#statusToast');

        $('#statusToast .toast-body').text(message);

        timest = document.getElementById("toasttime");
        timest.innerText = new Date().toLocaleTimeString();
        //$toast.toast('dispose'); // xoá config cũ
        $toast.toast({
            autohide: true,
            delay: 5000
        });
        $toast.toast('show');
    } catch (err) {
        console.error("Toast show error:", err);
    }
}




window.addEventListener('offline', () => {
    checkAll();
    showToast("Thiết bị của bạn đã mất kết nối Internet. Vui lòng kiểm tra lại mạng.");
    const roomCount = document.getElementById("active-rooms");
        roomCount.innerHTML = `<p>Mất kết nối Internet.</p>`;
    console.log("--- " + new Date().toLocaleTimeString() +" --- MẤT INTERNET ---");
});

window.addEventListener('online', () => {
    checkAll();
    showToast("Phục hồi kết nối Internet thành công.");
    console.log("--- " + new Date().toLocaleTimeString() +" --- PHỤC HỒI INTERNET ---");
});

// Initial update
if (fullnameFromURL) {
    nameInput.value = decodeURIComponent(fullnameFromURL); // Gán vào ô input luôn
    checkAll();
}
updateRoomStatus();
if (autocheckInterval > 0) {
    setInterval(() => {if (navigator.onLine){checkAll();}}, autocheckInterval * 1000);
    console.log("--- " + new Date().toLocaleTimeString() +" --- KÍCH HOẠT AUTOCHECK ---");
}

// You can add code here to periodically update the room status
// For example, using setInterval:
// setInterval(updateRoomStatus, 5000); // Update every 5 seconds
console.log("Display Name: "+nameInput.value)
checkStatusButton.addEventListener('click', function(event) {
    event.preventDefault(); // Chặn form submit mặc định
    const fullname = nameInput.value.trim();
    if (fullname === "") {
        alert("Vui lòng nhập tên của bạn trước khi kiểm tra.");
        return;
    }
    checkAll(); // Gọi hàm checkAll sau khi đã chắc chắn lấy được fullname
}); // Sửa ở đây

function checkAll() {
    let acount = 0;
    let roomCount = document.getElementById("active-rooms");
    for (const roomId in rooms){
        //  Ví dụ về link trả về trạng thái (thay đổi theo API của bạn)
        const statusLink = `https://trans.naviconference.com/RestApi/Service/JoinMeetingVer2?transID=88888888${roomId.replace("room-", "")}&displayName=${encodeURI(nameInput.value)}`;

        if (!navigator.onLine){
            rooms[roomId]="LOST_CONNECTION";
            updateRoomStatus();
            continue;
        }
        fetch(statusLink)
            .then(response => response.text()) // hoặc .json() nếu trả về JSON
            .then(data => {
                const statusArray = data.split('|');
                const roomStatus = statusArray[0];
                
                
                //roomElement = document.setElement(roomId, roomStatus);
                rooms[roomId]=roomStatus;
                updateRoomStatus();
                if(roomStatus =="OK"){
                    acount++;
                    const roomInfo = JSON.parse(statusArray[1]);
                    //  Xử lý roomStatus ở đây (ví dụ: hiển thị lên trang)
                    console.log("--- "+ new Date().toLocaleTimeString() +" --- Phòng " + roomId.replace("room-", "") + ": "+ roomStatus + " --- Zoom ID: " + format344(roomInfo.MeetingID));
                } else{
                    console.log("--- "+ new Date().toLocaleTimeString() +" --- Phòng " + roomId.replace("room-", "") + ": "+ roomStatus);
                }
                if(acount == 0){
                    roomCount.innerHTML = `<p>Không có phòng học nào đang hoạt động.</p>`;
                } else {
                    roomCount.innerHTML = `<p>Có <strong>${acount} phòng học</strong> đang hoạt động.</p>`;
                }
            })
            .catch(error => console.error("Lỗi:", error));
    }
    updateRoomStatus();
    console.log("--- Active Count: " + acount);
    showToast('Kiểm tra trạng thái phòng học đã xong.');
}

function JoinRoom(roomId){
    const statusLink2 = `https://trans.naviconference.com/RestApi/Service/JoinMeetingVer2?transID=88888888${roomId.replace("room-", "")}&displayName=${encodeURI(nameInput.value)}`;
    let url="";
    fetch(statusLink2)
    .then(response => response.text()) // hoặc .json() nếu trả về JSON
    .then(data => {
        const statusArray = data.split('|');
        const roomInfo = JSON.parse(statusArray[1]);
        console.log("ID:", roomInfo.MeetingID);
        console.log("Display Name:", roomInfo.DisplayName);
        if( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
            url = `zoomus://zoom.us/join?action=join&confno=${roomInfo.MeetingID}&uid=${encodeURI(roomInfo.DisplayName)}&uname=${encodeURI(roomInfo.DisplayName)}&browser=chrome&pwd=${roomInfo.Password}`;
        }
        else {
            url = `zoommtg://zoom.us/join?action=join&confno=${roomInfo.MeetingID}&uid=${encodeURI(roomInfo.DisplayName)}&uname=${encodeURI(roomInfo.DisplayName)}&browser=chrome&pwd=${roomInfo.Password}`;
        }
        console.log('Joining...');
        window.location.href = url;
    })
    .catch(error => console.error("Lỗi:", error));
}

function format344(NumberString) {
    var cleaned = ('' + NumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return null;
}