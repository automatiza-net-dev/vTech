import styled from "styled-components";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  rtl: boolean;
}

const StyledSidebarHeader = styled("div")`
  height: 64px;
  min-height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > a {
    width: 100%;
    overflow: hidden;
  }
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  rtl,
  ...rest
}) => {
  return (
    <div style={{ height: 50 }}>
      {/* <StyledSidebarHeader {...rest}>
        <Link href="/dashboard">
          <div
            style={{
              maxWidth: "100%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LogoClient />
          </div>
        </Link>
      </StyledSidebarHeader> */}
    </div>
  );
};
