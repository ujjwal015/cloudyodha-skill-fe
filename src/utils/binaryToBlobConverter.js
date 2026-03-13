export const binaryToBlobImageConverter = (imageDetails)=>{
  const url = imageDetails?.url ? imageDetails?.url : imageDetails
  const {data , type} =url
  const blob = new Blob([new Uint8Array(data)], {type});
  const imageUrl = URL.createObjectURL(blob)
  return imageUrl || 'https://via.placeholder.com/80x30?text=Client'
}