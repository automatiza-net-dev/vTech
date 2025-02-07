import { useEffect, useState } from "react";
import { Container } from "./styles";
import { FormHandler, TextEditor } from "infinity-forge";

function Editor({ editorState, setEditorState, readOnly = false }: any) {

  const [start, setStart] = useState(false);

  useEffect(() => {
  
    setTimeout(() => {
      setStart(true)
    }, 200)
  }, [])

  if(!start) {
    return <></>
  }

  return (
    <Container>
      <FormHandler
        initialData={{ textEditor: editorState }}
        onChangeForm={{
          callbackResult: (data) => {
            console.log({data})
            if(data?.textEditor) {
              console.log("nem entro aqui")
              setEditorState(data?.textEditor);
            }
          },
        }}
      >
        <TextEditor name="textEditor"  />
      </FormHandler>
    </Container>
  );
}


export default Editor;
