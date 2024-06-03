interface IErrorBoundaryComponentProps {
  name: string;
}

export const ErrorBoundaryComponent = ({
  name,
}: IErrorBoundaryComponentProps) => {
  return (
    <div className="title-2-bold" style={{ color: "#000" }}>
      Error component: {name}
    </div>
  );
};
