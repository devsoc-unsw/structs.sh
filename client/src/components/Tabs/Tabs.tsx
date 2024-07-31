import React, { ReactNode } from 'react';
import * as Internal from '@radix-ui/react-tabs';
import styles from 'styles/Tabs.module.css';

export const Tabs = React.forwardRef<HTMLDivElement, Internal.TabsProps>(
  ({ children, ...props }, ref) => (
    <Internal.Root className={styles.TabsRoot} defaultValue="0" ref={ref} {...props}>
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
  )
);

// https://stackoverflow.com/questions/41581130/what-is-react-component-displayname-used-for
// ESLINT THING
Tabs.displayName = 'Tabs';

interface TabProps {
  // TODO: Don't fix this, it's not worth it because it involve radix-ui's source code
  // eslint-disable-next-line react/no-unused-prop-types
  label: string;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => (
  <div className={styles.TabsContent}>{children}</div>
);
