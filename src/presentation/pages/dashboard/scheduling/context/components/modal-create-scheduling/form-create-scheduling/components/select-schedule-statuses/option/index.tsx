import * as S from "./styles";

export function Option({ innerRef, innerProps, data }) {
  return (
    <S.Option ref={innerRef} {...innerProps}>
      <div
        className="ball"
        style={{
          background: data.color,
        }}
      />

      <span>{data.label}</span>
    </S.Option>
  );
}
