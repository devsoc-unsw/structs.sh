import ConfigurationSelect from './ConfigurationSelect';
import styles from 'styles/Configuration.module.css';

interface LinkedListAnnotations {
  nodeVariable: string;
  dataType: string; //TODO: custom types
  dataVariable: string;
  nextVariable: string;
}

const Configuration = ({ typeDeclarations }) => {
  return (
    <div>
      {typeDeclarations.map((type, index) => (
        <div key={index} className={styles.configuratorItem}>
          <span>{type.name}</span>
          <ConfigurationSelect />
        </div>
      ))}
    </div>
  );
};

export default Configuration;
