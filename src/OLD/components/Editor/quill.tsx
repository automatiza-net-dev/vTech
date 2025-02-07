import { useEffect, useRef } from 'react'

import Quill from 'quill'

export function EditorQuill(props: { value?: string; handleOnChange: (value: string) => void }) {
  const ID = 'id-' + Math.random().toString(36).substring(2, 9)

  const quillRef = useRef<Quill>(null)

  useEffect(() => {
    if (!quillRef.current) {
      const reference = new Quill('#' + ID, {
        theme: 'snow',
      }) as any

      (quillRef as any).current = reference

      if (props.value) {
        reference.root.innerHTML = props.value
      }

      reference.on(Quill.events.TEXT_CHANGE, () => {
        const html = reference.root.innerHTML
        
        console.log(html)
        if(html !== props.value) {
          props.handleOnChange(html)
        }else {
          
        }
      })
    }
  }, [])

  useEffect(() => {
    if (quillRef.current && props.value !== undefined && quillRef.current.root.innerHTML !== props.value) {

      const editor = quillRef.current
      if (editor.root.innerHTML !== props.value) {
        editor.root.innerHTML = props.value
      }
    }
  }, [props.value])

  return (
      <div id={ID} />
  )
}
