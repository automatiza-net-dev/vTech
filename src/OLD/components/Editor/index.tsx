import dynamic from 'next/dynamic'

import { Container } from "./styles";

const EditorQuill = dynamic(() => import("./quill").then(r => r.EditorQuill), {
  loading: () => <div>loading...</div>,
  ssr: false,
});

function Editor({ editorState, setEditorState }: any) {
  return (
    <Container>
         <EditorQuill  value={editorState} handleOnChange={setEditorState} />
    </Container>
  );
}



export default Editor;
