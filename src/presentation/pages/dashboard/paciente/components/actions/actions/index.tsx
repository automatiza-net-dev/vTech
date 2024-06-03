import { Dropdown, DropdownMenu } from "semantic-ui-react";

import { Error } from "@/presentation";
import { Button } from "infinity-forge";

import { options } from "./options";
import { DropdownItemAction } from "./dropdown-item";

export function Actions() {
  return (
    <Error name="AddButton">
      <Dropdown simple icon={null} trigger={<Button text="ADICIONAR" />}>
        <DropdownMenu>
          {options.map((option) => (
            <DropdownItemAction key={option.value} {...option} />
          ))}
        </DropdownMenu>
      </Dropdown>
    </Error>
  );
}
