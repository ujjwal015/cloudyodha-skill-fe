import React, { useEffect, useState } from 'react'
import PDFIcon from "./../../../assets/new-icons/IconPDF.svg";
import JPGIcon from "./../../../assets/new-icons/IconJPG.svg";
import XLSIcon from "./../../../assets/new-icons/IconXLS.svg";
import DOCSIcon from "./../../../assets/new-icons/IconDocs.svg";
import PNGIcon from "./../../../assets/new-icons/IconPNG.svg"

function Image(props) {
    const [data,setData]=useState(null);

 const handleFileIcon=(certificateName)=>{
    if(certificateName.endsWith(".jpg") || certificateName.endsWith(".jpeg")){
      setData(JPGIcon)
    }
    else if(certificateName.endsWith(".png")){
        setData(PNGIcon)
    }
    else if(certificateName.endsWith(".xls") || certificateName.endsWith(".xlsx")){
      setData(XLSIcon)
    }
    else if(certificateName.endsWith(".doc") || certificateName.endsWith(".docx")){
      setData(DOCSIcon)
    }
    else if(certificateName.endsWith(".pdf")){
      setData(PDFIcon)
    }
  }
  useEffect(()=>{
    handleFileIcon(props.certificateName)
  },[props.certificateName])
  
  return (

    <div>
    <img src={data ||""}  width={45} height={45} alt=""  />
    </div>
  )
}

export default Image
