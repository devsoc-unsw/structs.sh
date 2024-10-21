import React, { MouseEventHandler, ReactNode } from 'react';
import styles from 'styles/Button.module.css';
import classNames from 'classnames';

export const Button = ({
  variant = 'outline',
  onClick,
  disabled = false,
  children,
  className,
}: {
  variant?: 'outline' | 'primary';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    className={classNames(styles.button, styles[variant], className)}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
