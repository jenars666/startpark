import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFile(file: File, folderPath: string): Promise<string> {
  if (!file) throw new Error("No file provided");
  if (!storage) throw new Error("Firebase storage is not configured");
  
  const fileRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
  
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
}
