import { Error } from "@/presentation";

import { Tutor } from "@/domain";
import { AddTutor } from "./add-tutor";
import { SelectActiveTutor } from "./select-active-tutor";

import * as S from "./styles";

export function Tutors({ tutors, id }: { tutors: Tutor[]; id: string }) {
  return (
    <Error name="birthDate">
      <S.Tutors>
        <div className="tutors-list">
          <div className="actions">
            <AddTutor id={id} tutors={tutors} />

            {tutors.length > 1 && <SelectActiveTutor tutors={tutors} id={id} />}
          </div>

          <div className="list">
            {tutors?.map((tutor, index) => (
              <span key={tutor.id} className="name">
                {tutor.isMain ? <strong>{tutor?.name}</strong> : tutor?.name}

                <strong>{tutors.length - 1 === index ? "" : " | "}</strong>
              </span>
            ))}
          </div>
        </div>
      </S.Tutors>
    </Error>
  );
}
