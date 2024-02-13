import React, { MouseEventHandler, ReactNode } from 'react';
import styles from 'styles/Button.module.css';
import classNames from 'classnames';

export const Button = ({
	variant = "outline",
	onClick,
	disabled = false,
	children
}: {
	variant?: "outline" | "primary",
	onClick?: MouseEventHandler<HTMLButtonElement>,
	disabled?: boolean,
	children: ReactNode
}) => (
	<button
		className={classNames(styles.button, styles[variant])}
		onClick={onClick}
		disabled={disabled}
	>
		{children}
	</button>
);
