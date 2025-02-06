import supabase from "@/lib/supabase/client";

const ASCIIFileName = (name) => {
  const extension = name.split('.').pop(); 
  const baseName = name.replace(/\.[^/.]+$/, ""); 
  const ASCIIdBaseName = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "");
  return `${ASCIIdBaseName}-${Date.now()}.${extension}`;
};

export const uploadImage = async (file, bucketName = "images") => {
  if (!(file instanceof File)) {
    throw new Error("유효하지 않은 파일 형식입니다.");
  }

  const fileName = ASCIIFileName(file.name);
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: urlError } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (urlError) {
    throw new Error(urlError.message);
  }

  return data.publicUrl;
};
