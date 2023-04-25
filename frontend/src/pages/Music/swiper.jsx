/** @format */

import React, { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined ,DownloadOutlined,CloseCircleOutlined} from "@ant-design/icons";
const Carousel = (props) => {
  const { images ,handleCancel ,index} = props;
  const [currentIndex, setCurrentIndex] = useState(index || 0 );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  const handlePrevClick = () => {
    setCurrentIndex((currentIndex + images.length - 1) % images.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {images.map((item, index) => {
        return (
          <img
            key={item.url}
            src={item.url || getBase64(item.originFileObj)}
            alt={`carousel-${index}`}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              left: `${index === currentIndex ? "0" : "100%"}`,
              transition: "left 1s ease-in-out",
            }}
          />
        );
      })}
      <CloseCircleOutlined  style={{ position: "absolute", top: "1%", right: "1%", color: "#FFF" ,fontSize:"32px"}} onClick={handleCancel} />
      <LeftOutlined
        style={{ position: "absolute", top: "50%", left: "2%", color: "#FFF" ,fontSize:"64px"}}
        onClick={handlePrevClick}
      />
      <RightOutlined
        style={{ position: "absolute", top: "50%", right: "2%", color: "#FFF",fontSize:"64px" }}
        onClick={handleNextClick}
      />
      <DownloadOutlined style={{ position: "absolute", bottom: "2%", left: "50%", color: "#FFF",fontSize:"32px",transform:"translateX(-50%)"}} />
    </div>
  );
};

export default Carousel;
