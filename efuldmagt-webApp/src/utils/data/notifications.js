export const notificationsList = [
  {
    id: 1,
    data: {
      actionType: "create_fuldmagt",
      fuldmagtId: "12345",
    },
    section: "today",
    read: false,
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
    user: "John Doe",
    body: "John Doe has created a new fuldmagt.",
    time: "2 hours ago",
  },
  {
    id: 2,
    data: {
      actionType: "revoke_fuldmagt",
      fuldmagtId: "67890",
    },
    section: "earlier",
    read: true,
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
    user: "Jane Smith",
    body: "Jane Smith has revoked a fuldmagt.",
    time: "1 day ago",
  },
  {
    id: 3,
    data: {
      actionType: "request_fuldmagt",
      fuldmagtRequestId: "54321",
    },
    section: "today",
    read: false,
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
    user: "Alice Johnson",
    body: "Alice Johnson has requested a new fuldmagt.",
    time: "3 days ago",
  },
];
