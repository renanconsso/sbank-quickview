export async function sendPhotoToBackend(file: File) {
  console.log("Enviando arquivo para o backend:", file);
  console.log("Tamanho:", file.size, "bytes - Tipo:", file.type);

  const formdata = new FormData();
  formdata.append("file", file);

  const requestOptions: RequestInit = {
    method: "POST",
    body: formdata,
  };

  const response = await fetch("http://127.0.0.1:8000/api/v1/recognition/identification", requestOptions);

  if (!response.ok) {
    throw new Error("Erro ao enviar imagem");
  }

  return await response.json();
}
