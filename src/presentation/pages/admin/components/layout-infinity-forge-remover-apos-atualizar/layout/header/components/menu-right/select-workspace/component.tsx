

import { WorkSpace } from './interfaces'
import { customStyles } from './custom-styles'

import * as S from './styles'
import { Avatar, FormHandler, Select } from 'infinity-forge';

export function SelectWorkSpace({ workspaces }: { workspaces?: WorkSpace }) {
  if (!workspaces?.list || workspaces.list.length === 0) {
    return <></>
  }

  function Item({ data, ...props }) {
    const isOption = props?.innerProps?.id?.includes('option') ;
    const optionIsActive = isOption && workspaces?.activeWorkspace === data.value
    return (
      <S.Item
        className={`item ${optionIsActive ? "active" : ""}`}
        {...props.innerProps}
        $isOption={isOption}
      >
        <div className='content_option'>
          {data?.img && <Avatar className='avatar' image={data.img} />}

          <div>
            <span className='font-14-regular title_workspace'>{data?.label}</span>

            {data?.subtitle && <span className='font-12-regular subtitle' style={{ color: isOption ? "#828282" : "#fff" }}>{data.subtitle}</span>}
          </div>
        </div>

        {isOption && <div className='active_workspace'><div></div></div>}
      </S.Item>
    )
  }

  return (
    <S.SelectWorkSpace>
      <FormHandler
        onChangeForm={workspaces?.onChangeWorkSpace && { callbackResult: workspaces.onChangeWorkSpace }}
        initialData={{ workspace: workspaces.activeWorkspace }}
      >
        <Select
          name='workspace'
          menuPlacement='auto'
          options={workspaces.list}
          onlyOneValue
          customStlyes={customStyles}
          CustomOption={Item}
          isSearchable={false}
          placeholder='Navegar para clinica'
          value={workspaces.activeWorkspace}
        />
      </FormHandler>
    </S.SelectWorkSpace>
  )
}
