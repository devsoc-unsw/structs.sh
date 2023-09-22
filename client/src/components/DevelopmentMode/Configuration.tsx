import classNames from 'classnames';
import * as RadioGroup from '@radix-ui/react-radio-group';
import ConfigurationSelect from './ConfigurationSelect';
import styles from 'styles/Configuration.module.css';

interface LinkedListAnnotations {
  nodeVariable: string;
  dataType: string; //TODO: custom types
  dataVariable: string;
  nextVariable: string;
}

const Configuration = ({ typeDeclarations }) => {
  const isSelfReferencing = (typeDeclaration) => {
    console.log(typeDeclaration);
    if (!('fields' in typeDeclaration)) {
      return false;
    }

    return (
      typeDeclaration.fields.length >= 2 &&
      typeDeclaration.fields.some((field) => field.type.includes(typeDeclaration.name))
    );
  };
  return (
    <div>
      <RadioGroup.Root className={styles.RadioGroupRoot}>
        {typeDeclarations.filter(isSelfReferencing).map((typeDeclaration, index: number) => (
          <div key={index}>
            <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
              <RadioGroup.Item value={typeDeclaration.name} className={styles.RadioGroupItem}>
                <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
              </RadioGroup.Item>
              <label className={styles.Label}>{typeDeclaration.name}</label>
            </div>

            {isSelfReferencing(typeDeclaration) &&
              typeDeclaration.fields.map((field) => (
                <div className={classNames(styles.configuratorItem, styles.field)}>
                  <span>
                    {field.type} {field.name}
                  </span>
                  <ConfigurationSelect />
                </div>
              ))}
          </div>
        ))}
      </RadioGroup.Root>
    </div>
  );
};

export default Configuration;
