// @ts-nocheck
// Core
import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

import { Container } from "./styles";
// PropTypes
import PropTypes from "prop-types";

let ReactQuill;
export let quillObj;

const Editor = React.memo(function Editor({
  editorState,
  setEditorState,
  readOnly = false
}: any) {
  const [index, setIndex] = useState(0);

  quillObj = React.createRef();

  // useEffect(() => {
  //   setTimeout(quillObj.current.focus(), 1000);
  // }, []);
  const [ready, setReady] = useState(false);

  if (!document || !window) return false;

  useEffect(() => {
    const startPage = async () => {
      if (document && window) {
        ReactQuill = (await import("react-quill")).default;
        setReady(true);
      }
    };

    startPage();
  }, [document, window]);

  if (!ready) return false;

  return (
    <Container>
      <ReactQuill
        className="react-quill"
        readOnly={readOnly}
        value={editorState}
        modules={modules}
        ref={quillObj}
        onChange={(value) => {
          setEditorState(value);
        }}
      />
    </Container>
  );
});

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      ["link"]
    ]
    // handlers: {
    //   image: imageHandler,
    // },
  }
};

export default Editor;

Editor.propTypes = {
  editorState: PropTypes.string,
  setEditorState: PropTypes.func.isRequired
};
