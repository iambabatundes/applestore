import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/posts";

export function getPosts() {
  return http.get(apiEndPoint);
}

export function getPost(postId) {
  return http.get(`${apiEndPoint}/${postId}`);
}

// export function savePost(post) {
//   console.log(post);
//   const formData = new FormData();
//   for (const key in post) {
//     if (key === "postMainImage" && post[key]) {
//       formData.append(key, post[key], post[key].name);
//     } else if (key !== "postMainImage") {
//       formData.append(key, post[key]);
//     }
//   }
//   return http.post(apiEndPoint, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }

// export function savePost(post) {
//   console.log(post);
//   const formData = new FormData();

//   for (const key in post) {
//     if (key === "postMainImage" && post[key]) {
//       if (post[key] instanceof File) {
//         formData.append(key, post[key], post[key].name);
//       } else {
//         console.error(`postMainImage is not a File:`, post[key]);
//       }
//     } else {
//       formData.append(key, post[key]);
//     }
//   }

//   return http.post(apiEndPoint, formData);
// }

async function fetchImageAsBlob(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${imageUrl}`);
  }
  return await response.blob();
}

export async function savePost(post) {
  console.log(post);
  const formData = new FormData();

  for (const key in post) {
    if (key === "postMainImage" && post[key]) {
      if (post[key].type === "image" && post[key].src) {
        try {
          const imageBlob = await fetchImageAsBlob(post[key].src);
          formData.append(key, imageBlob, post[key].filename);
        } catch (error) {
          console.error("Failed to fetch and convert image:", error);
          return Promise.reject(new Error("Failed to fetch and convert image"));
        }
      } else {
        console.error("postMainImage is not a valid image object:", post[key]);
        return Promise.reject(
          new Error("postMainImage is not a valid image object")
        );
      }
    } else {
      formData.append(key, post[key]);
    }
  }

  return http.post(apiEndPoint, formData);
}

// export function updatePost(postId, post) {
//   const formData = new FormData();
//   for (const key in post) {
//     if (key === "postMainImage" && post[key]) {
//       formData.append(key, post[key], post[key].name);
//     } else if (key !== "postMainImage") {
//       formData.append(key, post[key]);
//     }
//   }
//   return http.put(`${apiEndPoint}/${postId}`, formData);
// }

export async function updatePost(postId, post) {
  console.log(post);
  const formData = new FormData();

  for (const key in post) {
    if (key === "postMainImage" && post[key]) {
      if (post[key].type === "image" && post[key].src) {
        try {
          const imageBlob = await fetchImageAsBlob(post[key].src);
          formData.append(key, imageBlob, post[key].filename);
        } catch (error) {
          console.error("Failed to fetch and convert image:", error);
          return Promise.reject(new Error("Failed to fetch and convert image"));
        }
      } else {
        console.error("postMainImage is not a valid image object:", post[key]);
        return Promise.reject(
          new Error("postMainImage is not a valid image object")
        );
      }
    } else {
      formData.append(key, post[key]);
    }
  }

  const url = `${apiEndPoint}/${postId}`;
  return http.put(url, formData);
}

export function deletePost(postId) {
  return http.delete(`${apiEndPoint}/${postId}`);
}

export function getPostsByTag(tagId) {
  return http.get(`${apiEndPoint}/tag/${tagId}`);
}
