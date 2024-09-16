import { Error } from "infinity-forge";

import { Tutor } from "@/domain";
import { AddTutor } from "./add-tutor";
import { SelectActiveTutor } from "./select-active-tutor";

import * as S from "./styles";
import { FormCreatePatient } from "@/presentation/pages/dashboard/paciente";
import { useQueryClient } from "react-query";

export function Tutors({
  tutors,
  id,
  name,
}: {
  tutors: Tutor[];
  id: string;
  name: string;
}) {
  const queryClient = useQueryClient();

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
                {tutor.isMain ? (
                  <strong>{tutor?.name}</strong>
                ) : !name ? (
                  <FormCreatePatient
                    onSuccess={() =>
                      queryClient.invalidateQueries(["RemotePatient"])
                    }
                    trigger={<span>{tutor?.name}</span>}
                    patientId={tutor.id}
                    isModal
                  />
                ) : (
                  tutor?.name
                )}

                <strong>{tutors.length - 1 === index ? "" : " | "}</strong>
              </span>
            ))}
          </div>
        </div>
      </S.Tutors>
    </Error>
  );
}
