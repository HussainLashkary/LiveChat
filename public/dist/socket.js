const socket = io("http://localhost:4000");

let namespaceSocket = null;

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
        namespaceSocket.disconnect();
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
                    availableRooms[room.name] = room;
                }
            }
        });
    });
}

function getRoomInfo(room) {
    namespaceSocket.emit("joinRoom", room)
    namespaceSocket.on("countOfOnlineUsers", count => {
        document.getElementById("online-count").innerText = count  
    })
}
//get namespaces and rooms and show firs namespace as default
socket.on("connect", () => {
    socket.on("namespacesList", namespacesList => {
        const namespacesElement = document.getElementById("namespaces");
        namespacesElement.innerHTML = ""; // Clear existing items

        if (namespacesList.length > 0) {
            // Show first namespace as default
            initNamespaceConnection(namespacesList[0].endpoint);
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
                console.log(selectedTitle)

                // Update button text
                document.getElementById("group-title").innerText = selectedTitle

                // Connect to selected namespace
                initNamespaceConnection(selectedEndpoint);
            });
        }
    });
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
        img.src = selectedRoom.image;
        p.innerText = selectedRoom.name;
        roomHeader.appendChild(img);
        roomHeader.appendChild(p);
    }
    // Additional logic to join room can be added here
    }
});
