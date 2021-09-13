import React, { useMemo, useState } from "react";
import {
  addLiquidity,
  usePoolForBasket,
  PoolOperation,
} from "../../utils/pools";
import { Button, Card, Col, Dropdown, Popover, Radio, Row } from "antd";
import { useWallet } from "../../context/wallet";
import {
  useConnection,
  useConnectionConfig,
  useSlippageConfig,
} from "../../context/connection";
import { Spin } from "antd";
import { LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { notify } from "../../utils/notifications";
import { SupplyOverview } from "./supplyOverview";
import { CurrencyInput } from "../currencyInput";
import { PoolConfigCard } from "./config";
import "./add.less";
import { CurveType, PoolInfo, TokenSwapLayout } from "../../models";
import { useCurrencyPairState } from "../../utils/currencyPair";
import {
  CREATE_POOL_LABEL,
  ADD_LIQUIDITY_LABEL,
  generateActionLabel,
  generateExactOneLabel,
} from "../labels";
import { AdressesPopover } from "./address";
import { formatPriceNumber, getPoolName } from "../../utils/utils";
import { useMint, useUserAccounts } from "../../utils/accounts";
import { useEnrichedPools } from "../../context/market";
import { PoolIcon } from "../tokenIcon";
import { AppBar } from "../appBar";
import { Settings } from "../settings";
import { programIds } from "../../utils/ids";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
<style>
  
</style>
export const AddToLiquidity = () => {
  const { wallet, connect, connected } = useWallet();
  const connection = useConnection();
  const [pendingTx, setPendingTx] = useState(false);
  const [depositType, setDepositType] = useState("both");
  const {
    A,
    B,
    setLastTypedAccount,
    setPoolOperation,
    options,
    setOptions,
  } = useCurrencyPairState();
  const [depositToken, setDepositToken] = useState<string>(A.mintAddress);
  const pool = usePoolForBasket([A?.mintAddress, B?.mintAddress]);
  const { slippage } = useSlippageConfig();
  const { tokenMap } = useConnectionConfig();
  const isLatestLayout = programIds().swapLayout === TokenSwapLayout;

  const executeAction = !connected
    ? connect
    : async (instance?: PoolInfo) => {
        const currentDepositToken = getDepositToken();
        if (
          isLatestLayout &&
          depositType === "one" &&
          currentDepositToken?.account &&
          currentDepositToken.mint
        ) {
          setPendingTx(true);
          const components = [
            {
              account: currentDepositToken.account,
              mintAddress: currentDepositToken.mintAddress,
              amount: currentDepositToken.convertAmount(),
            },
          ];
          addLiquidity(
            connection,
            wallet,
            components,
            slippage,
            instance,
            options,
            depositType
          )
            .then(() => {
              setPendingTx(false);
            })
            .catch((e) => {
              console.log("Transaction failed", e);
              notify({
                description:
                  "Please try again and approve transactions from your wallet",
                message: "Adding liquidity cancelled.",
                type: "error",
              });
              setPendingTx(false);
            });
        } else if (A.account && B.account && A.mint && B.mint) {
          setPendingTx(true);
          const components = [
            {
              account: A.account,
              mintAddress: A.mintAddress,
              amount: A.convertAmount(),
            },
            {
              account: B.account,
              mintAddress: B.mintAddress,
              amount: B.convertAmount(),
            },
          ];

          // use input from B as offset during pool init for curve with offset
          if (
            options.curveType === CurveType.ConstantProductWithOffset &&
            !instance
          ) {
            options.token_b_offset = components[1].amount;
            components[1].amount = 0;
          }

          addLiquidity(
            connection,
            wallet,
            components,
            slippage,
            instance,
            options
          )
            .then(() => {
              setPendingTx(false);
            })
            .catch((e) => {
              console.log("Transaction failed", e);
              notify({
                description:
                  "Please try again and approve transactions from your wallet",
                message: "Adding liquidity cancelled.",
                type: "error",
              });
              setPendingTx(false);
            });
        }
      };

  const hasSufficientBalance = A.sufficientBalance() && B.sufficientBalance();
  const getDepositToken = () => {
    if (!depositToken) {
      return undefined;
    }
    return depositToken === A.mintAddress ? A : B;
  };
  const handleToggleDepositType = (item: any) => {
    if (item === pool?.pubkeys.mint.toBase58()) {
      setDepositType("both");
    } else if (item === A.mintAddress) {
      if (depositType !== "one") {
        setDepositType("one");
      }
      setDepositToken(A.mintAddress);
    } else if (item === B.mintAddress) {
      if (depositType !== "one") {
        setDepositType("one");
      }
      setDepositToken(B.mintAddress);
    }
  };
  const createPoolButton = pool && (
    <Button
      className="add-button"
      type="primary"
      size="large"
      onClick={() => executeAction()}
      disabled={
        connected &&
        (pendingTx ||
          !A.account ||
          !B.account ||
          A.account === B.account ||
          !hasSufficientBalance)
      }
    >
      {generateActionLabel(CREATE_POOL_LABEL, connected, tokenMap, A, B)}
      {pendingTx && <Spin indicator={antIcon} className="add-spinner" />}

    </Button>
  );

  const addLiquidityButton = (
    <Dropdown.Button
      className="add-button"
      onClick={() => executeAction(pool)}
      trigger={["click"]}
      disabled={
        connected &&
        (depositType === "both"
          ? pendingTx ||
            !A.account ||
            !B.account ||
            A.account === B.account ||
            !hasSufficientBalance
          : !getDepositToken()?.account ||
            !getDepositToken()?.sufficientBalance())
      }
      type="primary"
      
      size="large"
      overlay={
        <PoolConfigCard
          options={options}
          setOptions={setOptions}
          action={createPoolButton}
        />
      }
    >
      {depositType === "both"
        ? generateActionLabel(
            pool ? ADD_LIQUIDITY_LABEL : CREATE_POOL_LABEL,
            connected,
            tokenMap,
            A,
            B
          )
        : generateExactOneLabel(connected, tokenMap, getDepositToken())}
      {pendingTx && <Spin indicator={antIcon} className="add-spinner" />}
    </Dropdown.Button>
  );

  const getTokenOptions = () => {
    let name: string = "";
    let mint: string = "";
    if (pool) {
      name = getPoolName(tokenMap, pool);
      mint = pool.pubkeys.mint.toBase58();
    }
    return (
      <>
        {pool && (
          <Radio key={mint} value={mint} name={name}>
            Add {name}
          </Radio>
        )}
        {[A, B].map((item) => {
          return (
            <Radio
              key={item.mintAddress}
              value={item.mintAddress}
              name={item.name}
            >
              Add {item.name}
            </Radio>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="input-card">
        <AdressesPopover pool={pool} />
        <Popover
          trigger="hover"
          content={
            <div style={{ width: 300 }}>
              Liquidity providers earn a fixed percentage fee on all trades
              proportional to their share of the pool. Fees are added to the
              pool, accrue in real time and can be claimed by withdrawing your
              liquidity.
            </div>
          }
        >
          <Button type="text">Read more about providing liquidity.</Button>
        </Popover>
        {isLatestLayout && pool && (
          <div className="flex-row-center">
            <Radio.Group
              style={{ margin: "10px 0" }}
              onChange={(item) => handleToggleDepositType(item.target.value)}
              value={
                depositType === "both"
                  ? pool?.pubkeys.mint.toBase58()
                  : getDepositToken()?.mintAddress
              }
            >
              {getTokenOptions()}
            </Radio.Group>
          </div>
        )}
        {depositType === "both" && (
          <>
            <CurrencyInput
              title="Input"
              onInputChange={(val: any) => {
                setPoolOperation(PoolOperation.Add);
                if (A.amount !== val) {
                  setLastTypedAccount(A.mintAddress);
                }
                A.setAmount(val);
              }}
              amount={A.amount}
              mint={A.mintAddress}
              onMintChange={(item) => {
                A.setMint(item);
              }}
            />
            <div>+</div>
            <CurrencyInput
              title={
                options.curveType === CurveType.ConstantProductWithOffset
                  ? "Offset"
                  : "Input"
              }
              onInputChange={(val: any) => {
                setPoolOperation(PoolOperation.Add);
                if (B.amount !== val) {
                  setLastTypedAccount(B.mintAddress);
                }
                B.setAmount(val);
              }}
              amount={B.amount}
              mint={B.mintAddress}
              onMintChange={(item) => {
                B.setMint(item);
              }}
            />
          </>
        )}
        {depositType === "one" && depositToken && (
          <CurrencyInput
            title="Input"
            onInputChange={(val: any) => {
              setPoolOperation(PoolOperation.Add);
              const dToken = getDepositToken();
              if (dToken && dToken.amount !== val) {
                setLastTypedAccount(dToken.mintAddress);
              }
              getDepositToken()?.setAmount(val);
            }}
            amount={getDepositToken()?.amount}
            mint={getDepositToken()?.mintAddress}
            hideSelect={true}
          />
        )}
        {addLiquidityButton}
        {pool && <PoolPrice pool={pool} />}
        <SupplyOverview pool={pool} />
      </div>

      <YourPosition pool={pool} />
    </>
  );
};

export const PoolPrice = (props: { pool: PoolInfo }) => {
  const pool = props.pool;
  const pools = useMemo(() => [props.pool].filter((p) => p) as PoolInfo[], [
    props.pool,
  ]);
  const enriched = useEnrichedPools(pools)[0];

  const { userAccounts } = useUserAccounts();
  const lpMint = useMint(pool.pubkeys.mint);

  const ratio =
    userAccounts
      .filter((f) => pool.pubkeys.mint.equals(f.info.mint))
      .reduce((acc, item) => item.info.amount.toNumber() + acc, 0) /
    (lpMint?.supply.toNumber() || 0);

  if (!enriched) {
    return null;
  }
  return (
    <Card
      className="ccy-input"
      style={{ borderRadius: 20, width: "100%" }}
      bodyStyle={{ padding: "7px" }}
      size="small"
      title="Prices and pool share"
    >
      <Row style={{ width: "100%" }}>
        <Col span={8}>
          {formatPriceNumber.format(
            parseFloat(enriched.liquidityA) / parseFloat(enriched.liquidityB)
          )}
        </Col>
        <Col span={8}>
          {formatPriceNumber.format(
            parseFloat(enriched.liquidityB) / parseFloat(enriched.liquidityA)
          )}
        </Col>
        <Col span={8}>
          {ratio * 100 < 0.001 && ratio > 0 ? "<" : ""}
          &nbsp;{formatPriceNumber.format(ratio * 100)}%
        </Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <Col span={8}>
          {enriched.names[0]} per {enriched.names[1]}
        </Col>
        <Col span={8}>
          {enriched.names[1]} per {enriched.names[0]}
        </Col>
        <Col span={8}>Share of pool</Col>
      </Row>
    </Card>
  );
};

export const YourPosition = (props: { pool?: PoolInfo }) => {
  const { pool } = props;
  const pools = useMemo(() => [props.pool].filter((p) => p) as PoolInfo[], [
    props.pool,
  ]);
  const enriched = useEnrichedPools(pools)[0];
  const { userAccounts } = useUserAccounts();
  const lpMint = useMint(pool?.pubkeys.mint);

  if (!pool || !enriched) {
    return null;
  }
  const baseMintAddress = pool.pubkeys.holdingMints[0].toBase58();
  const quoteMintAddress = pool.pubkeys.holdingMints[1].toBase58();

  const ratio =
    userAccounts
      .filter((f) => pool.pubkeys.mint.equals(f.info.mint))
      .reduce((acc, item) => item.info.amount.toNumber() + acc, 0) /
    (lpMint?.supply.toNumber() || 0);

  return (
    <Card
      className="ccy-input"
      style={{ borderRadius: 20, width: "100%" }}
      bodyStyle={{ padding: "7px" }}
      size="small"
      title="Your Position"
    >
      <div className="pool-card" style={{ width: "initial" }}>
        <div className="pool-card-row">
          <div className="pool-card-cell">
            <div style={{ display: "flex", alignItems: "center" }}>
              <PoolIcon mintA={baseMintAddress} mintB={quoteMintAddress} />
              <h3 style={{ margin: 0 }}>{enriched?.name}</h3>
            </div>
          </div>
          <div className="pool-card-cell">
            <h3 style={{ margin: 0 }}>
              {formatPriceNumber.format(ratio * enriched.supply)}
            </h3>
          </div>
        </div>
        <div className="pool-card-row" style={{ margin: 0 }}>
          <div className="pool-card-cell">Your Share:</div>
          <div className="pool-card-cell">
            {ratio * 100 < 0.001 && ratio > 0 ? "<" : ""}
            {formatPriceNumber.format(ratio * 100)}%
          </div>
        </div>
        <div className="pool-card-row" style={{ margin: 0 }}>
          <div className="pool-card-cell">{enriched.names[0]}:</div>
          <div className="pool-card-cell">
            {formatPriceNumber.format(ratio * enriched.liquidityA)}
          </div>
        </div>
        <div className="pool-card-row" style={{ margin: 0 }}>
          <div className="pool-card-cell">{enriched.names[1]}:</div>
          <div className="pool-card-cell">
            {formatPriceNumber.format(ratio * enriched.liquidityB)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const AddToLiquidityView = () => {
  return (
    <>
      <AppBar
        right={
          <Popover
            placement="topRight"
            title="Settings"
            content={<Settings />}
            trigger="click"
          >
            <Button
              shape="circle"
              size="large"
              type="text"
              icon={<SettingOutlined />}
            />
          </Popover>
        }
      />
      <Card
        className="exchange-card"
        headStyle={{ padding: 0 }}
        bodyStyle={{ position: "relative" }}
      >
        <AddToLiquidity />
      </Card>
    </>
  );
};
