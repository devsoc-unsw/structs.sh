import React, { ReactNode } from 'react';
import * as Internal from '@radix-ui/react-tabs';
import styles from 'styles/Tabs.module.css';

export const Tabs = ({
  children,
}: {
  children: ReactNode,
}) => (
  <Internal.Root className={styles.TabsRoot} defaultValue="0">
    <Internal.List className={styles.TabsList} aria-label="Tabs">
      {React.Children.map(children, (child, index) => (
        <Internal.Trigger className={styles.TabsTrigger} value={String(index)} key={index}>
          {React.isValidElement(child) && child.props.label}
        </Internal.Trigger>
      ))}
    </Internal.List>
    {React.Children.map(children, (child, index) => (
      <Internal.Content asChild value={String(index)} key={index}>
        {child}
      </Internal.Content>
    ))}
  </Internal.Root>
);

export const Tab = ({
  children
}: {
  label: string,
  children: ReactNode
}) => (
  <div className={styles.TabsContent}>
    {children}
  </div>
);
