const socket = io("http://localhost:4000");

let namespaceSocket = null;

function stringToHtml(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body.firstChild;
}

function clearRooms() {
    const roomsElement = document.getElementById("rooms");
    if (roomsElement) {
        roomsElement.innerHTML = "";
    }
}
// global var to store rooms data and use them for roomClick event
let availableRooms = {};
//get rooms of a namespace and create its part
function initNamespaceConnection(endpoint) {
    if (namespaceSocket) {
        namespaceSocket.close();
    }
    namespaceSocket = io(`http://localhost:4000/${endpoint}`);

    namespaceSocket.on("connect", () => {

        namespaceSocket.on("roomList", rooms => {
            availableRooms = {};
            const roomsElement = document.getElementById("rooms");
            if (roomsElement) {
                roomsElement.innerHTML = "";
                for (const room of rooms) {
                    const li = document.createElement("li");
                    const img = document.createElement("img")
                    img.classList.add("room-image");
                    li.classList.add("room-list-name");
                    li.innerText = room.name || room; // roomTitle or room name
                    li.dataset.room = room.name
                    img.src = room.image;
                    li.appendChild(img);
                    roomsElement.appendChild(li);
                    room.endpoint = endpoint;
                    availableRooms[room.name] = room;
                }
            }
        });
    });
}

function getRoomInfo(room) {
    document.querySelector(".room-header").setAttribute("roomName", room.name);
    document.querySelector(".room-header").setAttribute("endpoint", room.endpoint);
    namespaceSocket.emit("joinRoom", room)
    namespaceSocket.on("countOfOnlineUsers", count => {
        document.getElementById("online-count").innerText = `online Users:${count}`  
    })
    getMessages(room)
}

//get namespaces and rooms and show firs namespace as default
socket.on("connect", () => {
    socket.on("namespacesList", namespacesList => {
        const namespacesElement = document.getElementById("namespaces");
        namespacesElement.innerHTML = ""; // Clear existing items
        if (namespacesList.length > 0) {
            // Show first namespace as default
            initNamespaceConnection(namespacesList[0].endpoint);
            document.getElementById("group-title").innerText = namespacesList[0].title;
        }

        for (const namespace of namespacesList) {
            const li = document.createElement("li");
            li.innerText = namespace.title;
            li.dataset.endpoint = namespace.endpoint;
            namespacesElement.appendChild(li);

            // Attach click listener to each namespace item
            li.addEventListener("click", () => {
                const selectedEndpoint = li.dataset.endpoint;
                const selectedTitle = li.innerText;

                // Update button text
                document.getElementById("group-title").innerText = selectedTitle

                // Connect to selected namespace
                initNamespaceConnection(selectedEndpoint);
            });
        }
    });
    window.addEventListener("keydown", (e) => {
        const roomTitle = document.getElementById("room-header").innerText;
        if(e.code == "Enter") {
            if(!roomTitle) {
                alert("یک گروه را انتخاب کنید")
            } else {
                sendMessage();
            }
        }
    });
    document.getElementById("sendButton").addEventListener("click", () => {
        const roomTitle = document.getElementById("room-header").innerText;
        if(!roomTitle) {
            alert("یک گروه را انتخاب کنید")
        } else {
            sendMessage();
        }
    })
});


const roomsContainer = document.getElementById('rooms');
// Event delegation to handle room selection
roomsContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
    const selectedRoomName = event.target.dataset.room;
    const selectedRoom = availableRooms[selectedRoomName];
    getRoomInfo(selectedRoom);
    const roomHeader = document.getElementById("room-header");
    if(selectedRoom && roomHeader) {
        roomHeader.innerHTML = "";
        const img = document.createElement("img")
        const p = document.createElement("p")
        img.classList.add("room-image");
        p.classList.add("room-title")
        img.src = selectedRoom.image;
        p.innerText = selectedRoom.name;
        roomHeader.appendChild(img);
        roomHeader.appendChild(p);
    }
    
    }
});


// for sending messages to chat page and send to server to save in database
function sendMessage() {
    const roomName = document.querySelector(".room-header").getAttribute("roomName");
    const endpoint = document.querySelector(".room-header").getAttribute("endpoint");
    let message = document.querySelector(".input-area input#messageInput").value;
    if(message.trim() == "") {
        return alert("input message cannot be empty")
    }
    const userId = document.getElementById("userId").value;
    namespaceSocket.emit("newMessage", {
        message,
        roomName,
        endpoint,
        sender: userId
    });
    namespaceSocket.off("confirmMessage")
    namespaceSocket.on("confirmMessage", data => {
        console.log(data.message)
        const li = stringToHtml(`
            <li class="${(userId == data.sender)? 'message sent' : 'message received'}">
              <img src="/uploads/cooking.JPG" alt="User Profile" class="profile-image" />
              <span>${data.message}</span>
            </li>
        `);
        document.getElementById("message-container").appendChild(li);
        //empty messages box here
        document.querySelector(".input-area input#messageInput").value = "";
        const messagesElement = document.querySelector("div.messages");
        messagesElement.scrollTo(0, messagesElement.scrollHeight);
    })
}

function getMessages(room) {
    const roomContainer = document.getElementById("message-container");
    if(roomContainer) {
        roomContainer.innerHTML = "";
    }
    const messages = room.messages;
    const roomName = document.querySelector(".room-header").getAttribute("roomName");
    const userId = document.getElementById("userId").value;
    for (const message of messages) {
        const li = stringToHtml(`
            <li class="${(userId == message.sender)? 'message sent' : 'message received'}">
                <img src="uploads/cooking.JPG" alt="userPic">
                <span>${message.message}</span>
            </li>
        `);
        document.querySelector(".messages ul").appendChild(li);
    }
}




