import React from 'react';
import classNames from 'classnames/bind';
import styles from './StackInspector.module.scss';
import { isStructTypeName, isPointerType, isArrayType } from '../../Types/backendType';
import { useGlobalStore } from '../../Store/globalStateStore';

const CollapsibleDescription = ({ collapsed, children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
  const [isOverflowing, setIsOverflowing] = React.useState(true);
  const valueSpanRef = React.useRef(null);

  const cx = classNames.bind(styles);
  const valueClassName = cx('value', { expandedvalue: !isCollapsed });
  const buttonClassName = cx('collapsebutton', { hidden: !isOverflowing && isCollapsed });

  React.useEffect(() => {
    const valueSpan = valueSpanRef.current;

    const handleResize = () => {
      if (valueSpan) {
        const overflowing = valueSpan.scrollWidth > valueSpan.clientWidth;
        setIsOverflowing(overflowing);
      }
    };

    // Initial call on mount
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <>
      <a href="#" className={buttonClassName} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '▸' : '▾'}
      </a>
      <code className={valueClassName} aria-expanded={isCollapsed} ref={valueSpanRef}>
        {children}
      </code>
    </>
  );
};

const StackInspector = () => {
  const debuggerData = useGlobalStore().currFrame;
  // array of html divs each representing a local
  const localDivs = [];

  for (const [name, memoryValue] of Object.entries(debuggerData.stack_data)) {
    // NOTE: this processes the actual output of the debugger correctly, but
    // does not conform to the backend types (i.e. debugger is sending data in
    // slightly incorrect format at the moment)
    var localValue;
    console.log(memoryValue);
    if (isStructTypeName(memoryValue.type.typeName)) {
      // localValue = "<struct>";
      localValue = memoryValue.value;
    } else if (isPointerType(memoryValue.type)) {
      localValue = '<pointer>';
    } else if (/\[\d+\]$/.test(memoryValue.type)) {
      // localValue = "<array>";
      localValue = memoryValue.value;
    } else {
      localValue = memoryValue.value;
    }

    localDivs.push({
      type: memoryValue.type,
      name,
      value: localValue,
    });
  }

  function defaultTemplate(localDiv) {
    return (
      <>
        <dt>
          <code>
            <span className={styles.type}>{localDiv.type}</span>&nbsp;
            <span className={styles.name}>{localDiv.name}</span>
          </code>
        </dt>
        <dd>
          <code className={styles.value}>{localDiv.value}</code>
        </dd>
      </>
    );
  }

  function arrayTemplate(localDiv) {
    const typeWords = localDiv.type.split(' ');
    let arrayLengthIndicator = typeWords.pop();
    let arrayType;
    if (arrayLengthIndicator[0] == '*') {
      // array of pointers
      // looks like "char *[3]"
      // TODO: handle double pointers
      arrayLengthIndicator = arrayLengthIndicator.substring(1);
      arrayType = `${typeWords.join(' ')} *`;
    } else {
      // includes the trailing space
      arrayType = `${typeWords.join(' ')} `;
    }
    return (
      <>
        <dt>
          <code>
            <span className={styles.type}>{arrayType}</span>
            <span className={styles.name}>{localDiv.name}</span>
            <span className={styles.type}>{arrayLengthIndicator}</span>
          </code>
        </dt>
        <dd>
          <CollapsibleDescription collapsed>{localDiv.value}</CollapsibleDescription>
        </dd>
      </>
    );
  }

  function pointerTemplate(localDiv) {
    // NOTE: single pointers only
    const fixedType = localDiv.type.slice(0, -1);
    return (
      <>
        <dt>
          <code>
            <span className={styles.type}>{`${fixedType} *`}</span>
            <span className={styles.name}>{localDiv.name}</span>
          </code>
        </dt>
        <dd>
          <code className={styles.value}>{localDiv.value}</code>
        </dd>
      </>
    );
  }

  function divMapper(localDiv) {
    if (/\[\d+\]$/.test(localDiv.type)) {
      return arrayTemplate(localDiv);
    }
    if (isPointerType(localDiv.type)) {
      // todo: handle arrays of pointers
      return pointerTemplate(localDiv);
    }
    return defaultTemplate(localDiv);
  }

  return (
    <div className={styles.stackInspector}>
      <div className={styles.frame}>
        <div className={styles.frameHeader}>
          <code className={styles.function}>{debuggerData.frame_info.function}()</code>{' '}
          <span className={styles.location}>
            @ {debuggerData.frame_info.file}:{debuggerData.frame_info.line_num}
          </span>
        </div>
        <dl>{localDivs.map(divMapper)}</dl>
      </div>
    </div>
  );
};

export default StackInspector;
