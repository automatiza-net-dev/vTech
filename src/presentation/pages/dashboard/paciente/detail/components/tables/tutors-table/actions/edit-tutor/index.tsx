import { useState } from "react";
import { Tooltip } from "infinity-forge";

import { Tutor } from "@/domain";
import { Modal } from "@/presentation";

import { Edit } from "@/OLD/components/Tutor/Edit";

import * as S from "./styles";

export function EditTutor(
  props: Tutor & { setVisible: React.Dispatch<React.SetStateAction<boolean>> }
) {
  const [modal, setModal] = useState(false);

  return (
    <S.EditTutor>
      <Modal stateModal={modal} setModal={setModal} maxwidth="1200px">
        <Edit tutorId={props?.id} setVisible={setModal} />
      </Modal>

      <Tooltip
        content="Editar"
        trigger={
          <button onClick={() => setModal(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
            >
              <path
                d="M2.27614 9.59326L9.03753 2.83183L8.09473 1.88901L1.33333 8.65046V9.59326H2.27614ZM2.82843 10.9266H0V8.09813L7.62333 0.474801C7.88373 0.214454 8.3058 0.214454 8.56613 0.474801L10.4518 2.36042C10.7121 2.62077 10.7121 3.04288 10.4518 3.30323L2.82843 10.9266ZM0 12.2599H12V13.5933H0V12.2599Z"
                fill="#828282"
              />
            </svg>
          </button>
        }
      />
    </S.EditTutor>
  );
}
