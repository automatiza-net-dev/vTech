import { Layout } from "antd";
import Header from "@/OLD/components/mini-components/Header";
import ErrorBoundary from "@/OLD/components/ErrorBoundary";
import SiderController from "@/OLD/components/mini-components/SiderController";

export default function Controller() {
  return (
    <ErrorBoundary>
      <Layout style={{ minHeight: "100vh" }}>
        <Header origin={"controller"} />
        <Layout className="site-layout">
          <SiderController />
        </Layout>
      </Layout>
    </ErrorBoundary>
  );
}
