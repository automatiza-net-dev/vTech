// @ts-nocheck
// Core
import React, { memo, useState, useEffect, useCallback } from "react";

// Components
import { Upload } from "antd";
import { Button as ButtonA } from "@/OLD/components/mini-components/Button";

// Icons
import { PlusOutline } from "styled-icons/evaicons-outline";

const UploadArquives = memo(function UploadArquives({ fileList, setFileList }) {
  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (isJpgOrPng) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return notification.error({
          message: "Você só pode upar imagens até 2MB!",
        });
      }
    }

    return true;
  }, []);

  return (
    <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-top">
      <label>Anexos</label>
      <Upload
        name="pet-photos"
        className="avatar-uploader uk-text-center"
        beforeUpload={beforeUpload}
        fileList={fileList}
        onChange={(info) => {
          setFileList(info.fileList);
        }}
      >
        {fileList.length > 0 ? (
          <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-small-top">
            <ButtonA>
              <PlusOutline size={15} className="upload-icon" /> Adicionar anexos
            </ButtonA>
            {fileList.map((item, i) => (
              <img
                src={item.preview}
                alt="avatar"
                key={i}
                style={{ width: "100%" }}
              />
            ))}
          </div>
        ) : (
          <ButtonA>
            <PlusOutline size={15} className="upload-icon" /> Adicionar anexos
          </ButtonA>
        )}
      </Upload>
    </div>
  );
});

export default UploadArquives;
