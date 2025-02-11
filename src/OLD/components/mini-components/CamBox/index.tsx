// @ts-nocheck
import React, { memo, useEffect, useState } from "react";

import { Button } from "antd";

import moment from "moment";

const CamBox = memo(function CamBox({ setVisible, setFileList }) {
  const [photo, setPhoto] = useState(false);
  const [videoContent, setVideoContent] = useState(false);

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    const videoComponent = document.querySelector("#video-box");
    setVideoContent(videoComponent);
    videoComponent.srcObject = stream;
    videoComponent.play();
  });

  return (
    <div>
      <video id="video-box" style={{ display: !!photo ? "none" : "block" }} />
      <canvas
        id="canvas-box"
        width="500"
        height="500"
        style={{ display: !photo && "none" }}
      />
      <hr />
      <footer className="uk-flex uk-flex-right">
        <div className="uk-flex uk-width-1-2 uk-flex-around">
          {!photo ? (
            <Button
              type="primary"
              onClick={() => {
                setPhoto(true);
                const canvasComponent = document.querySelector("#canvas-box");
                canvasComponent.getContext("2d").drawImage(videoContent, 0, 0);
              }}
            >
              Tirar Foto
            </Button>
          ) : (
            <Button onClick={() => setPhoto(false)}> Tirar Outra </Button>
          )}
          <Button
            onClick={() => {
              setVisible(false);
            }}
          >
            Cancelar
          </Button>
        </div>
        {photo && (
          <Button
            type="primary"
            onClick={() => {
              const canvasComponent = document.querySelector("#canvas-box");
              const url = canvasComponent.toDataURL();
              fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                  const file = new File(
                    [blob],
                    `Foto Câmera - ${moment(new Date()).format("DD/MM/YYYY")}`,
                    {
                      type: "image/png",
                    }
                  );
                  setFileList([{ originFileObj: file }]);
                });
              setVisible(false);
            }}
          >
            Usar Foto
          </Button>
        )}
      </footer>
    </div>
  );
});

export default CamBox;
