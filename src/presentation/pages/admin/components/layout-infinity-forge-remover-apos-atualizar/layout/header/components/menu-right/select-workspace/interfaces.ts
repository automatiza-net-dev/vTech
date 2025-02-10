export type WorkSpaceItem = {
  label: string
  value: string
  img: string
  subtitle?: string
}

export type WorkSpace = {
  list: WorkSpaceItem[]
  onChangeWorkSpace?: (dataForm: { workspace: any }) => void
  activeWorkspace: WorkSpaceItem['value']
}
