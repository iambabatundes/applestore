const mediaData = [
  {
    id: 1,
    fileName: "image",
    author: "applestore",
    fileSize: "20kb",
    fileType: "image",
    date: "June 2020",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },

  {
    id: 2,
    fileName: "image",
    author: "applestore",
    fileSize: "20kb",
    fileType: "image",
    date: "May 2021",
    dataUrl:
      "https://images.unsplash.com/photo-1518965493882-35b838ace024?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
  },
  {
    id: 3,
    fileName: "image",
    author: "applestore",
    fileSize: "20kb",
    fileType: "image",
    date: "October 2022",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 4,
    fileName: "image",
    fileType: "image",
    author: "applestore",
    fileSize: "20kb",
    date: "November 2023",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 5,
    fileName: "image",
    fileType: "image",
    author: "applestore",
    fileSize: "20kb",
    date: "December 2021",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 6,
    fileName: "image",
    author: "applestore",
    fileSize: "20kb",
    fileType: "image",
    date: "April 2021",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 7,
    fileName: "image",
    author: "applestore",
    fileType: "image",
    fileSize: "20kb",
    date: "March 2023",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 8,
    fileName: "image",
    author: "applestore",
    fileType: "image",
    fileSize: "20kb",
    date: "October 2023",
    dataUrl:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },

  {
    id: 9,
    fileName: "images",
    author: "applestore",
    fileType: "image",
    fileSize: "20kb",
    date: "January 2023",
    dataUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
  },
  {
    id: 10,
    fileName: "horse-and-foal.mp4",
    author: "applestore",
    fileType: "video",
    fileSize: "20kb",
    date: "May 2023",
    dataUrl: "/video3.mp4",
  },
  {
    id: 11,
    fileName: "wood-nature.mp4",
    author: "applestore",
    fileType: "video",
    fileSize: "20kb",
    date: "July 2023",
    dataUrl: "/video2.mp4",
  },

  {
    id: 12,
    fileName: "person-with-face.mp4",
    author: "applestore",
    fileType: "video",
    fileSize: "20kb",
    date: "Auguest 2023",
    dataUrl: "/video1.mp4",
  },
  {
    id: 13,
    fileName: "LAWALPHOTOCARD.pdf",
    author: "applestore",
    fileType: "pdf",
    fileSize: "20kb",
    date: "September 2023",
    dataUrl: "../images/LAWALPHOTOCARD.pdf",
  },
  {
    id: 14,
    fileName: "MITAIRES.docx",
    author: "applestore",
    fileSize: "20kb",
    fileType: "doc",
    date: "June 2022",
    dataUrl: "../images/MITAIRES.docx",
  },
];

export function getMediaDatas() {
  return mediaData;
}

export function getMediaData(id) {
  return mediaData.find((media) => media.id === id);
}
