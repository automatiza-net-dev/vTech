// Core
// @ts-nocheck
import React, { memo } from "react";

// Utils
import { removeParagraph } from "@/OLD/utils/removeParagraph";

import { quillObj } from "@/OLD/components/Editor";

const Variables = memo(function ({ body, setBody, templates }) {
  return (
    templates?.length > 0 &&
    templates.map((template) => (
      <>
        <div
          className="variable-item"
          onClick={() => {
            quillObj.current.getEditor().insertText(
              quillObj.current.getEditor().getSelection((prv) => prv),
              template?.replacer
            );
            setTimeout(() => {
              quillObj?.current
                ?.getEditor()
                ?.setSelection(body?.length + template?.replacer.length, 0);
            }, 10);
          }}
        >
          {template?.replacer}
        </div>
        <hr />
      </>
    ))
  );
});

export default Variables;
