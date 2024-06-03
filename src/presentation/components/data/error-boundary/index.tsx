import { ErrorBoundary } from "react-error-boundary"
import { ErrorBoundaryComponent } from "./error-body";

interface IErrorBoundary {
    name: string;
    children: React.ReactNode
}

export function Error({ name, children }: IErrorBoundary) {
  return (
    <ErrorBoundary
      FallbackComponent={() =>
        ErrorBoundaryComponent({ name })
      }
      onError={(arg1, arg2) => {
        console.log("erro:");
        console.log(arg1, arg2);
      }}
    >
        {children}
    </ErrorBoundary>
  );
}
