

export default function Variables({  handleInsert, templates }) {
  return (
    templates?.length > 0 &&
    templates.map((template) => (
      <>
        <div
          className="variable-item"
          onClick={() => {
            if (!template?.complex) {

              handleInsert(template?.replacer)

            } else {

              handleInsert(`<ul>${template?.replacer}</ul>`)
            }
          }}
        >
          {template?.replacer}
        </div>
        <hr />
      </>
    ))
  );
}
