import { UnsplashImage } from "@/types/types";
import { createApi } from "unsplash-js";

const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
if(!accessKey){
throw new Error("Unsplash access key is missing. Check your environment variables");
}

const unsplashApi = createApi({ accessKey });

export async function getRandomImage(): Promise<UnsplashImage | null> {
  try{
    const result = await unsplashApi.photos.getRandom({
      orientation: "landscape",
    });

    if(result.type === "success"){
      const photo = Array.isArray(result.response)
        ? result.response[0]
        : result.response;
      return{
        url : photo.urls.regular,
        user : {
          name : photo.user.name,
          username : photo.user.username,
        },
        link : photo.links.html,
      };
    }else{
      console.error("Unsplash error:", result.errors);
      return null;
    }
  }catch(error){
    console.error("Failed to fetch Unsplash image:", error);
    return null;
  }
}