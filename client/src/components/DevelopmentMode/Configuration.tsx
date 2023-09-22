import classNames from 'classnames';
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
      {typeDeclarations.filter(isSelfReferencing).map((typeDeclaration, index: number) => (
        <div key={index}>
          <div className={styles.configuratorItem}>
            <span>{typeDeclaration.name}</span>
            <ConfigurationSelect />
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
    </div>
  );
};

export default Configuration;
