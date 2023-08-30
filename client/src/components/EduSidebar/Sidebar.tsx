import React from 'react';
import SidebarItem from './SidebarItem';
import { EduCategory } from 'assets/edu/EduCategory';
import style from './Sidebar.module.scss';

const Sidebar = () => {
  return (
		<div className={style.sidebar}>
			{EduCategory.map((item, index) => (
				<SidebarItem key={index} name={item.name} url={item.url} level={item.level} children={item.children} />
			)) }
		</div>
	)
};

export default Sidebar;
