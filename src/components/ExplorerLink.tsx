import React from "react";
import { Typography } from "antd";
import { PublicKey } from "@solana/web3.js";
import { shortenAddress } from "../utils";

export const ExplorerLink = (props: {
  address: string | PublicKey;
  type: string;
  code?: boolean;
  style?: React.CSSProperties;
  length?: number;
}) => {
  const { type, code } = props;

  const address = typeof props.address === "string" ? props.address : props.address?.toBase58();

  if (!address) {
    return null;
  }

  const length = props.length ?? 9;

  return (
    <a
      href={`https://explorer.solana.com/${type}/${address}`}
      target="_blank"
      rel="noreferrer noopener"
      title={address}
      style={props.style}
    >
      {code ? (
        <Typography.Text style={props.style} code>
          {shortenAddress(address, length)}
        </Typography.Text>
      ) : (
        shortenAddress(address, length)
      )}
    </a>
  );
};
