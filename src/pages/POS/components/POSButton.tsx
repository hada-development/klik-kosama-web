import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { MouseEventHandler, ReactElement } from 'react';

type Props = {
  icon: ReactElement;
  title: string;
  type?: ButtonType;
  onClick?: MouseEventHandler;
  danger?: any;
  disabled?: boolean;
  loading?: boolean;
};

export default function POSButton({
  icon,
  title,
  type,
  onClick,
  danger,
  disabled,
  loading,
}: Props) {
  return (
    <Button
      loading={loading}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        fontSize: '16px',
        padding: '30px 8px',
      }}
      type={type}
      onClick={onClick}
      danger={danger}
      disabled={disabled}
    >
      {icon}
      <span
        style={{
          marginTop: '2px',
          fontWeight: 'bold',
          fontSize: '10pt',
          marginInlineStart: '0px',
        }}
      >
        {title}
      </span>
    </Button>
  );
}
