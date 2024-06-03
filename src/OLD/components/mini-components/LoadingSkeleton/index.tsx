// @ts-nocheck
import {Skeleton } from "antd";

export function  LoadingSkeleton({ active = true }) {
  return (
    <div className="uk-padding">
      <Skeleton active={active} />
      <Skeleton active={active} />
      <Skeleton active={active} />
      <Skeleton active={active} />
    </div>
  );
}
