import SidebarItem from './SidebarItem';
import style from './Sidebar.module.scss';

interface SubCategory {
name: string;
url: string;
level: number;
children: SubCategory[]; // Assuming there could be nested subcategories
}

interface Category {
name: string;
url: string;
level: number;
children: SubCategory[];
}

const eduPages = import.meta.glob('../../edu-pages/*.mdx');


// Helper function to convert camelCase to spaced words
const formatName = (name) => {
    return name
      // insert space before all caps
      .replace(/([A-Z])/g, ' $1')
      // uppercase the first character
      .replace(/^./, str => str.toUpperCase());
}

// Define a function to create the educational structure
const createEduStructure = (): Category[] => {
    const filenames = Object.keys(eduPages).map(path => path.split('/').pop().split('.')[0]);
  
    const eduStructure: Record<string, Category> = {};
  
    filenames.forEach(filename => {
      const [mainCategory, subCategory] = filename.split('-');
  
      if (!eduStructure[mainCategory]) {
        eduStructure[mainCategory] = {
          name: formatName(mainCategory),
          url: `/${mainCategory}`,
          level: 1,
          children: []
        };
      }
  
      if (subCategory) {
        eduStructure[mainCategory].children.push({
          name: formatName(subCategory),
          url: `/${mainCategory}-${subCategory}`,
          level: 2,
          children: []
        });
      }
    });
  
    return Object.values(eduStructure);
  };
  
  const dynamicEduCategories = createEduStructure();
  
  // Render the Sidebar with proper types
  const Sidebar = () => {
    return (
        <div className={style.sidebar}>
        {dynamicEduCategories.map((category, index) => (
            <SidebarItem key={index} name={category.name} url={category.url} level={category.level} children={category.children} />
        )) }
        </div>
    );
  };


export default Sidebar;
