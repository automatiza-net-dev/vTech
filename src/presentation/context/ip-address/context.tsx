import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface IPAddress {
  IPAddress: string;
  setIPAddress: Dispatch<SetStateAction<string>>;
}

const IPAddressContext = createContext<IPAddress>({} as IPAddress);

export const IPAddressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [IPAddress, setIPAddress] = useState("");

  return (
    <IPAddressContext.Provider value={{ IPAddress, setIPAddress }}>
      {children}
    </IPAddressContext.Provider>
  );
};

export function useIPAddress() {
  const context = useContext(IPAddressContext);
  return context;
}
