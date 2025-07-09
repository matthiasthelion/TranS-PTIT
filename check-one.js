const checkStatusButton = document.getElementById('checkStatusButton');
const urlParams = new URLSearchParams(window.location.search);
const fullnameFromURL = urlParams.get('fullname');
const namebox = document.getElementById('displayname');
const transID = urlParams.get('room');
const autocheckParam = parseInt(urlParams.get('autocheck'), 10);
const autocheckInterval = isNaN(autocheckParam) ? 0 : Math.max(autocheckParam, 0);
const autojoin = urlParams.get('autojoin') === 'true';
var aciID;
//var acount = 0;

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
    {
        let roomId=transID;
        const roomElement = document.getElementById('room-status');
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
                accessButton.innerText = `Vào lớp`;
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
                roomElement.innerText = `[${new Date().toLocaleTimeString()}]\n Phòng chưa được mở`;
                break;
            case "REQUIRED_LOGIN":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">🔒</div>`;
                roomElement.innerText = `[${new Date().toLocaleTimeString()}]\n Bạn cần đăng nhập để vào phòng`;
                break;
            case "NOT_PARTICIPANT":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">⛔</div>`;
                roomElement.innerText = `[${new Date().toLocaleTimeString()}]\n Bạn không phải đại biểu của phòng này`;
                break;
            case "LOST_CONNECTION":
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">❌</div>`;
                roomElement.innerText = `[${new Date().toLocaleTimeString()}]\n Mất kết nối Internet`;
                break;
            default:
                roomElement.classList.remove("room-ok");
                roomElement.classList.add("room-not-ok");
                //roomElement.innerHTML = `<div class="big-icon">🔄</div>`;
                roomElement.innerHTML = `<img src="./images/circleloader.gif" alt="loading" width="60">Đang kiểm tra...`;
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
    checkRoom();
    showToast("Thiết bị của bạn đã mất kết nối Internet. Vui lòng kiểm tra lại mạng.");
    //const roomCount = document.getElementById("active-rooms");
    //    roomCount.innerHTML = `<p>Mất kết nối Internet.</p>`;
    console.log("--- " + new Date().toLocaleTimeString() +" --- MẤT INTERNET ---");
});

window.addEventListener('online', () => {
    checkRoom();
    showToast("Phục hồi kết nối Internet thành công.");
    console.log("--- " + new Date().toLocaleTimeString() +" --- PHỤC HỒI INTERNET ---");
});

// Initial update
if (fullnameFromURL) {
    //namebox.innerText = `${decodeURIComponent(fullnameFromURL)}`;
    checkRoom();
}
updateRoomStatus();
if (autocheckInterval > 0) {
    aciID = setInterval(() => {
        if (navigator.onLine){checkRoom();}
    }, autocheckInterval * 1000);
    console.log("--- " + new Date().toLocaleTimeString() +" --- KÍCH HOẠT AUTOCHECK --- aciID=" + aciID);
}
// You can add code here to periodically update the room status
// For example, using setInterval:
// setInterval(updateRoomStatus, 5000); // Update every 5 seconds
console.log("Display Name: "+decodeURIComponent(fullnameFromURL))
/*
checkStatusButton.addEventListener('click', function(event) {
    event.preventDefault(); // Chặn form submit mặc định
    const fullname = decodeURIComponent(fullnameFromURL);
    if (fullname === "") {
        alert("Vui lòng nhập tên của bạn trước khi kiểm tra.");
        return;
    }
    checkRoom(); // Gọi hàm check sau khi đã chắc chắn lấy được fullname
}); // Sửa ở đây
*/

function checkRoom() {
    let acount = 0;
    {
        let roomId=transID;
        //  Ví dụ về link trả về trạng thái (thay đổi theo API của bạn)
        const statusLink = `https://trans.naviconference.com/RestApi/Service/JoinMeetingVer2?transID=88888888${roomId.replace("room-", "")}&displayName=${fullnameFromURL}`;

        if (!navigator.onLine){
            rooms[roomId]="LOST_CONNECTION";
            updateRoomStatus();
            return;
        }
        fetch(statusLink)
            .then(response => response.text()) // hoặc .json() nếu trả về JSON
            .then(data => {
                const statusArray = data.split('|');
                const roomStatus = statusArray[0];
                //  Xử lý roomStatus ở đây (ví dụ: hiển thị lên trang)
                console.log("--- "+ new Date().toLocaleTimeString() +" --- Phòng " + roomId.replace("room-", "") + ": "+ roomStatus);
                //roomElement = document.setElement(roomId, roomStatus);
                rooms[roomId]=roomStatus;
                updateRoomStatus();
                if(roomStatus =="OK"){
                    document.getElementById('active-id').innerHTML = `
                    <div class="property-grid">
                        <div class="single-property">
                            <div class="room-label">Phòng học</div>
                            <div class="room-status">${JSON.parse(statusArray[1]).HostName}</div>
                        </div>
                        <div class="single-property">
                            <div class="room-label">Zoom ID</div>
                            <div class="room-status">${format344(JSON.parse(statusArray[1]).MeetingID)}</div>
                        </div>
                        <div class="single-property">
                            <div class="room-label">Tên hiển thị</div>
                            <div class="room-status">${JSON.parse(statusArray[1]).DisplayName}</div>
                        </div>
                    </div>`;
                    if(autojoin){
                        JoinRoom(roomId);
                    }
                } else {
                    document.getElementById('active-id').innerText = statusArray[1];
                }
            })
            .catch(error => console.error("Lỗi:", error));
    }
    updateRoomStatus();
    /*
    if(acount == 0){
        //const roomCount = document.getElementById("active-rooms");
        //roomCount.innerHTML = `<p>Không có phòng học nào đang hoạt động.</p>`;
        showToast('Phòng học không hoạt động.');
        //console.log('Không có phòng học nào đang hoạt động.');
    } else {
        //const roomCount = document.getElementById("active-rooms");
        //roomCount.innerHTML = `<p>Có ${acount} phòng học đang hoạt động.</p>`;
        showToast('Phòng học đang hoạt động.\nZoom ID: ');
        //console.log('Có ' + acount + ' phòng học đang hoạt động.');"
    }
        */
}

function JoinRoom(roomId){
    const statusLink2 = `https://trans.naviconference.com/RestApi/Service/JoinMeetingVer2?transID=88888888${roomId.replace("room-", "")}&displayName=${fullnameFromURL}`;
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
    clearInterval(aciID);
}

function format344(NumberString) {
    var cleaned = ('' + NumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return null;
}